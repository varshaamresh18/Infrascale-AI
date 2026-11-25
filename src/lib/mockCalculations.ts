import {
  WorkloadSpec,
  FinancialSummary,
  CapacityMetrics,
  ArchitectureOption,
  MonthlyProjection,
} from '../types/estimator';

/**
 * Deterministic Financial ROI Engine
 * Strictly adheres to Section 7 formulas and numerical verification.
 */
export function calculateFinancialSummary(
  workload: WorkloadSpec,
  recommendedMonthlyAiCost: number,
  setupInvestment: number,
  recommendedTierId: ArchitectureOption['id'] = 'hybrid_cached'
): FinancialSummary {
  const baselineManual = workload.current_manual_cost_usd;
  const humanRatio = workload.remaining_human_ops_ratio;

  // 1. Remaining Human Operations Cost
  const remainingHumanMonthly = baselineManual * humanRatio;

  // 2. Total Monthly Post-AI Cost
  const totalMonthlyPostAi = recommendedMonthlyAiCost + remainingHumanMonthly;

  // 3. Net Monthly Savings
  const netMonthlySavings = baselineManual - totalMonthlyPostAi;

  // 4. 12-Month Displaced Manual Cost
  const twelveMonthDisplacedManual = (baselineManual - remainingHumanMonthly) * 12;

  // 5. Total 12-Month AI Investment
  const totalTwelveMonthAiInvestment = setupInvestment + (recommendedMonthlyAiCost * 12);

  // 6. 12-Month Net Financial Gain
  const twelveMonthNetGain = twelveMonthDisplacedManual - totalTwelveMonthAiInvestment;

  // 7. Conventional 12-Month ROI (%)
  const conventionalRoi = totalTwelveMonthAiInvestment > 0
    ? Number(((twelveMonthNetGain / totalTwelveMonthAiInvestment) * 100).toFixed(1))
    : 0;

  // 8. Steady-state Payback Period (Months)
  const paybackMonths = netMonthlySavings > 0
    ? Number((setupInvestment / netMonthlySavings).toFixed(2))
    : null;

  return {
    recommended_tier_id: recommendedTierId,
    baseline_manual_monthly_usd: Math.round(baselineManual),
    setup_investment_usd: Math.round(setupInvestment),
    recommended_ai_monthly_usd: Math.round(recommendedMonthlyAiCost),
    remaining_human_monthly_usd: Math.round(remainingHumanMonthly),
    total_monthly_post_ai_usd: Math.round(totalMonthlyPostAi),
    net_monthly_savings_usd: Math.round(netMonthlySavings),
    twelve_month_displaced_manual_cost_usd: Math.round(twelveMonthDisplacedManual),
    total_twelve_month_ai_investment_usd: Math.round(totalTwelveMonthAiInvestment),
    twelve_month_net_gain_usd: Math.round(twelveMonthNetGain),
    cumulative_12m_savings_usd: Math.round(netMonthlySavings * 12),
    conventional_roi_12m_pct: conventionalRoi,
    payback_months: paybackMonths,
  };
}

/**
 * Deterministic Workload Capacity Planner (GPU Sizing & SLA Feasibility)
 */
export function calculateCapacityMetrics(workload: WorkloadSpec): CapacityMetrics {
  const requests = workload.monthly_requests;
  const avgInput = workload.avg_input_tokens;
  const avgOutput = workload.avg_output_tokens;
  const concurrency = workload.peak_concurrent_requests;
  const latencySla = workload.latency_sla_ms;

  // Required aggregate TPS during peak hours
  const totalTokensPerReq = avgInput + avgOutput;
  // Estimated seconds per request based on output tokens generation speed (~40 tokens/sec)
  const reqDurationSec = Math.max(1, avgOutput / 40);
  const requiredTps = Math.round((concurrency * avgOutput) / reqDurationSec);

  // Estimated TTFT (Time To First Token) based on input size
  // Typically ~25ms base + 0.15ms per input token for self-hosted 8B
  const estimatedTtft = Math.round(35 + (avgInput * 0.08));

  // KV-Cache calculation per sequence:
  // For an 8B model (32 layers, 32 heads, dim 128, FP16):
  // 2 * 32 * 4096 * 2 bytes * context_tokens = ~0.5KB per token
  const contextLength = avgInput + avgOutput;
  const kvCachePerSeqGb = Number(((contextLength * 0.55 * 1024) / (1024 * 1024 * 1024)).toFixed(3));

  // Determine GPU Model & VRAM needed
  let gpuModel = 'NVIDIA L4 (24GB)';
  let vramPerGpu = 24;
  let baseWeightsGb = 16; // 8B FP16 / 14B INT8

  if (contextLength > 8000 || concurrency > 60) {
    gpuModel = 'NVIDIA A100 (80GB)';
    vramPerGpu = 80;
    baseWeightsGb = 32;
  } else if (contextLength > 4000 || concurrency > 30) {
    gpuModel = 'NVIDIA A10G (24GB)';
    vramPerGpu = 24;
    baseWeightsGb = 16;
  }

  // Active KV-Cache memory across peak concurrency
  const totalKvCacheGb = concurrency * kvCachePerSeqGb;
  const runtimeOverheadGb = 2.5; // CUDA context, PyTorch/vLLM buffer
  const memoryPerReplicaGb = baseWeightsGb + runtimeOverheadGb;

  // Headroom & Replica calculation (70% utilization target)
  const targetUtilCeiling = 0.70;
  const maxConcurrencyPerGpu = Math.max(1, Math.floor((vramPerGpu - memoryPerReplicaGb) / kvCachePerSeqGb));
  
  // Replicas needed for memory & concurrency
  const replicasForMemory = Math.ceil(concurrency / (maxConcurrencyPerGpu * targetUtilCeiling));
  // Replicas needed for throughput
  const tpsCapacityPerGpu = gpuModel.includes('A100') ? 450 : 180;
  const replicasForThroughput = Math.ceil(requiredTps / (tpsCapacityPerGpu * targetUtilCeiling));

  const requiredReplicas = Math.max(1, Math.max(replicasForMemory, replicasForThroughput));

  // Utilization percentage at peak
  const peakLoadCapacity = requiredReplicas * tpsCapacityPerGpu;
  const gpuUtilPct = Math.min(96, Math.round((requiredTps / peakLoadCapacity) * 100));

  // SLA Feasibility Check
  const estimatedP95Latency = estimatedTtft + (avgOutput * 22);
  const slaFeasible = estimatedP95Latency <= latencySla;
  const feasibilityNote = slaFeasible
    ? `SLA Feasible: Projected P95 latency (${estimatedP95Latency}ms) comfortably within ${latencySla}ms SLA target.`
    : `SLA Alert: Projected P95 latency (${estimatedP95Latency}ms) exceeds ${latencySla}ms SLA target. Consider higher tier GPU or managed hybrid routing.`;

  return {
    gpu_model: gpuModel,
    vram_per_gpu_gb: vramPerGpu,
    kv_cache_per_seq_gb: kvCachePerSeqGb,
    required_tps: requiredTps,
    estimated_ttft_ms: estimatedTtft,
    gpu_utilization_pct: Math.max(25, gpuUtilPct),
    required_replicas: requiredReplicas,
    sla_feasible: slaFeasible,
    feasibility_note: feasibilityNote,
  };
}

/**
 * 3-Tier Architecture Cost Model
 */
export function calculateArchitectureOptions(
  workload: WorkloadSpec,
  capacity: CapacityMetrics
): ArchitectureOption[] {
  const reqs = workload.monthly_requests;
  const inputTok = workload.avg_input_tokens;
  const outputTok = workload.avg_output_tokens;
  const totalInputTokensM = (reqs * inputTok) / 1_000_000;
  const totalOutputTokensM = (reqs * outputTok) / 1_000_000;

  // 1. Standard Managed API (e.g. Gemini 1.5 Pro / Claude 3.5 Sonnet standard rates: $1.25/M in, $5.00/M out)
  const stdInputCost = totalInputTokensM * 1.50;
  const stdOutputCost = totalOutputTokensM * 5.50;
  const stdCompute = Math.round(stdInputCost + stdOutputCost);
  const stdStorage = Math.round(Math.min(300, 40 + (reqs * 0.0006)));
  const stdOps = 150;
  const stdTotal = stdCompute + stdStorage + stdOps;

  // 2. Optimized Hybrid API (Cached + Prompt Routing: 70% cache hit, Flash-Lite/Flash routing)
  // Caching saves ~75% on cached input tokens; model routing saves ~60%
  const cacheHitRatio = workload.cacheable_prompt_ratio || 0.70;
  const cachedInputTokensM = totalInputTokensM * cacheHitRatio;
  const uncachedInputTokensM = totalInputTokensM * (1 - cacheHitRatio);
  
  // Blended rates for Hybrid (Flash-Lite @ $0.075/M in, $0.30/M out; Cached in @ $0.018/M)
  const hybridInputCost = (cachedInputTokensM * 0.03) + (uncachedInputTokensM * 0.15);
  const hybridOutputCost = totalOutputTokensM * 0.60;
  const hybridCompute = Math.round(hybridInputCost + hybridOutputCost);
  const hybridStorage = Math.round(Math.min(250, 40 + (reqs * 0.0004)));
  const hybridOps = 200; // API gateway & routing maintenance
  const hybridTotal = hybridCompute + hybridStorage + hybridOps;

  // 3. Self-Hosted GPU (VPC Dedicated Infrastructure)
  // Hourly GPU cost: L4 ~$0.85/hr ($612/mo), A10G ~$1.20/hr ($864/mo), A100 ~$3.60/hr ($2592/mo)
  const hourlyRate = capacity.gpu_model.includes('A100')
    ? 3.60
    : capacity.gpu_model.includes('A10G')
      ? 1.20
      : 0.85;
  const gpuCompute = Math.round(capacity.required_replicas * hourlyRate * 730);
  const gpuStorage = Math.round(180 + (reqs * 0.0008)); // Cloud storage, model weights registry, vector DB
  const gpuOps = 1200; // Dedicated Kubernetes/cluster management, SRE & on-call overhead
  const gpuTotal = gpuCompute + gpuStorage + gpuOps;

  // Recommendation logic:
  // If strict VPC / airgap compliance or very high volume where GPU < Hybrid, pick GPU.
  // Otherwise, Optimized Hybrid API is typically the best ROI for most enterprise workloads.
  const hasStrictAirgap = workload.compliance_requirements.some(c => 
    c.toLowerCase().includes('airgap') || c.toLowerCase().includes('on-prem')
  );

  let recommendedId: ArchitectureOption['id'] = 'hybrid_cached';
  if (hasStrictAirgap && capacity.sla_feasible) {
    recommendedId = 'self_hosted_gpu';
  } else if (hybridTotal <= stdTotal && hybridTotal <= gpuTotal) {
    recommendedId = 'hybrid_cached';
  } else if (gpuTotal < hybridTotal && capacity.sla_feasible) {
    recommendedId = 'self_hosted_gpu';
  } else {
    recommendedId = 'standard_api';
  }

  return [
    {
      id: 'standard_api',
      name: 'Standard Managed API',
      compute_token_cost_usd: stdCompute,
      storage_vector_cost_usd: stdStorage,
      ops_overhead_usd: stdOps,
      total_monthly_usd: stdTotal,
      setup_cost_usd: 2500,
      recommended: recommendedId === 'standard_api',
      sla_feasible: true,
    },
    {
      id: 'hybrid_cached',
      name: 'Optimized Hybrid API (Cached + Routed)',
      compute_token_cost_usd: hybridCompute,
      storage_vector_cost_usd: hybridStorage,
      ops_overhead_usd: hybridOps,
      total_monthly_usd: hybridTotal,
      setup_cost_usd: 4500,
      recommended: recommendedId === 'hybrid_cached',
      sla_feasible: true,
    },
    {
      id: 'self_hosted_gpu',
      name: `Self-Hosted GPU (${capacity.gpu_model})`,
      compute_token_cost_usd: gpuCompute,
      storage_vector_cost_usd: gpuStorage,
      ops_overhead_usd: gpuOps,
      total_monthly_usd: gpuTotal,
      setup_cost_usd: 9500,
      recommended: recommendedId === 'self_hosted_gpu',
      sla_feasible: capacity.sla_feasible,
    },
  ];
}

/**
 * 12-Month Cumulative Cost & Break-Even Curve Generator
 */
export function generateMonthlyProjections(
  baselineManualMonthly: number,
  recommendedMonthlyAi: number,
  remainingHumanOpsMonthly: number,
  initialSetupInvestment: number
): MonthlyProjection[] {
  const projections: MonthlyProjection[] = [];
  const monthlyAiTotal = recommendedMonthlyAi + remainingHumanOpsMonthly;

  for (let m = 1; m <= 12; m++) {
    const cumulativeManual = baselineManualMonthly * m;
    const cumulativeAiProgram = initialSetupInvestment + (monthlyAiTotal * m);

    projections.push({
      month: `M${m}`,
      cumulative_manual_usd: Math.round(cumulativeManual),
      cumulative_ai_program_usd: Math.round(cumulativeAiProgram),
    });
  }

  return projections;
}
