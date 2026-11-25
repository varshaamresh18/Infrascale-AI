import {
  EstimatorResponse,
  WorkloadSpec,
  EnterprisePreset,
  NodeStatuses,
} from '../types/estimator';
import {
  ENTERPRISE_PRESETS,
  MOCK_COMPLIANCE_ITEMS,
  MOCK_PRICING_PROVENANCE,
  MOCK_SYNTHESIS_REPORTS,
} from './mockData';
import {
  calculateCapacityMetrics,
  calculateArchitectureOptions,
  calculateFinancialSummary,
  generateMonthlyProjections,
} from './mockCalculations';

export class MockEstimatorService {
  /**
   * Run full analysis on an enterprise preset or workload spec.
   * Can accept a progress callback to drive the 5-node animated tracker.
   */
  public static async analyzeWorkload(
    workload: WorkloadSpec,
    presetId?: string,
    onProgress?: (statuses: NodeStatuses, stageMessage: string) => void
  ): Promise<EstimatorResponse> {
    const threadId = crypto.randomUUID();

    const nodeStatuses: NodeStatuses = {
      intake_extractor: 'pending',
      hitl_clarifier: 'pending',
      deterministic_tools: 'pending',
      parallel_critics: 'pending',
      executive_synthesizer: 'pending',
    };

    // Stage 1: Intake & Extraction
    nodeStatuses.intake_extractor = 'running';
    onProgress?.({ ...nodeStatuses }, 'Extracting workload specifications via Pydantic schema...');
    await new Promise((r) => setTimeout(r, 450));
    nodeStatuses.intake_extractor = 'completed';

    // Stage 2: HITL Clarification Check
    nodeStatuses.hitl_clarifier = 'running';
    onProgress?.({ ...nodeStatuses }, 'Auditing parameters for volume, concurrency & compliance...');
    await new Promise((r) => setTimeout(r, 400));
    nodeStatuses.hitl_clarifier = 'completed';

    // Stage 3: Deterministic Calculations
    nodeStatuses.deterministic_tools = 'running';
    onProgress?.({ ...nodeStatuses }, 'Executing pure Python GPU Sizing, Pricing & 12M ROI engines...');
    await new Promise((r) => setTimeout(r, 550));

    const capacity = calculateCapacityMetrics(workload);
    const archOptions = calculateArchitectureOptions(workload, capacity);
    const recommendedArch = archOptions.find((a) => a.recommended) || archOptions[1];

    const financials = calculateFinancialSummary(
      workload,
      recommendedArch.total_monthly_usd,
      recommendedArch.setup_cost_usd,
      recommendedArch.id
    );

    const monthlyProjections = generateMonthlyProjections(
      financials.baseline_manual_monthly_usd,
      financials.recommended_ai_monthly_usd,
      financials.remaining_human_monthly_usd,
      financials.setup_investment_usd
    );

    nodeStatuses.deterministic_tools = 'completed';

    // Stage 4: Parallel Critics Fan-Out
    nodeStatuses.parallel_critics = 'running';
    onProgress?.({ ...nodeStatuses }, 'Fan-out: FinOps Critic & Security/Latency Architect evaluating outputs...');
    await new Promise((r) => setTimeout(r, 600));
    nodeStatuses.parallel_critics = 'completed';

    // Stage 5: Executive Blueprint Synthesizer
    nodeStatuses.executive_synthesizer = 'running';
    onProgress?.({ ...nodeStatuses }, 'Synthesizing final executive architecture decision brief...');
    await new Promise((r) => setTimeout(r, 450));
    nodeStatuses.executive_synthesizer = 'completed';

    // Pick synthesis report matching preset or generate default
    const synthesisKey = (presetId as keyof typeof MOCK_SYNTHESIS_REPORTS) || 'customer_support_rag';
    const synthesis = MOCK_SYNTHESIS_REPORTS[synthesisKey] || MOCK_SYNTHESIS_REPORTS.customer_support_rag;

    return {
      thread_id: threadId,
      status: 'completed',
      assistant_message: `Completed full architectural & financial evaluation for ${workload.use_case_name}. Verified against 12-month ROI models and cloud GPU capacity requirements.`,
      quick_replies: [
        'Explore What-If Scenarios',
        'Download Architecture Brief (.md)',
        'Compare GPU vs Hybrid API'
      ],
      workload_spec: workload,
      node_statuses: nodeStatuses,
      financials,
      capacity_metrics: capacity,
      architecture_options: archOptions,
      monthly_projections: monthlyProjections,
      compliance_checklist: MOCK_COMPLIANCE_ITEMS,
      pricing_provenance: MOCK_PRICING_PROVENANCE,
      synthesis,
    };
  }

  /**
   * Recalculate metrics in real-time when What-If sliders change
   */
  public static recalculateWhatIf(
    updatedWorkload: WorkloadSpec,
    currentResponse: EstimatorResponse
  ): EstimatorResponse {
    const capacity = calculateCapacityMetrics(updatedWorkload);
    const archOptions = calculateArchitectureOptions(updatedWorkload, capacity);
    const recommendedArch = archOptions.find((a) => a.recommended) || archOptions[1];

    const financials = calculateFinancialSummary(
      updatedWorkload,
      recommendedArch.total_monthly_usd,
      recommendedArch.setup_cost_usd,
      recommendedArch.id
    );

    const monthlyProjections = generateMonthlyProjections(
      financials.baseline_manual_monthly_usd,
      financials.recommended_ai_monthly_usd,
      financials.remaining_human_monthly_usd,
      financials.setup_investment_usd
    );

    return {
      ...currentResponse,
      workload_spec: updatedWorkload,
      capacity_metrics: capacity,
      architecture_options: archOptions,
      financials,
      monthly_projections: monthlyProjections,
    };
  }

  /**
   * Simulate a multi-turn chat interaction with Human-In-The-Loop clarification
   */
  public static handleChatMessage(
    message: string,
    currentWorkload: Partial<WorkloadSpec>
  ): {
    assistantMessage: string;
    quickReplies: string[];
    updatedWorkload: Partial<WorkloadSpec>;
    status: 'awaiting_input' | 'completed';
    nodeStatuses: NodeStatuses;
  } {
    const lower = message.toLowerCase();

    // Check if user answered a clarifying question
    if (lower.includes('100k') || lower.includes('100,000') || lower.includes('50k') || lower.includes('250k')) {
      const vol = lower.includes('100k') ? 100000 : lower.includes('50k') ? 50000 : 250000;
      return {
        assistantMessage: `Noted monthly request volume at ${vol.toLocaleString()}. What is your anticipated peak concurrency and latency SLA requirement?`,
        quickReplies: ['25 concurrent / 1500ms SLA', '50 concurrent / 1000ms SLA', '100 concurrent / 800ms SLA'],
        updatedWorkload: { ...currentWorkload, monthly_requests: vol },
        status: 'awaiting_input',
        nodeStatuses: {
          intake_extractor: 'completed',
          hitl_clarifier: 'awaiting_input',
          deterministic_tools: 'pending',
          parallel_critics: 'pending',
          executive_synthesizer: 'pending',
        },
      };
    }

    if (lower.includes('concurrent') || lower.includes('sla')) {
      return {
        assistantMessage: `Concurrency and latency SLAs mapped. What is your current baseline manual operating cost and remaining human review target (e.g. 20% QA)?`,
        quickReplies: ['$8,000/mo (20% QA)', '$15,000/mo (15% QA)', '$25,000/mo (10% QA)'],
        updatedWorkload: {
          ...currentWorkload,
          peak_concurrent_requests: lower.includes('100') ? 100 : lower.includes('50') ? 50 : 25,
          latency_sla_ms: lower.includes('800') ? 800 : lower.includes('1000') ? 1000 : 1500,
        },
        status: 'awaiting_input',
        nodeStatuses: {
          intake_extractor: 'completed',
          hitl_clarifier: 'awaiting_input',
          deterministic_tools: 'pending',
          parallel_critics: 'pending',
          executive_synthesizer: 'pending',
        },
      };
    }

    // Default general inquiry
    return {
      assistantMessage: `I've analyzed your initial description for "${message.slice(0, 45)}...". To calculate exact token economics and GPU replica sizing without hallucinations, I need three parameters:
1. Estimated monthly request volume
2. Latency SLA target
3. Current baseline manual operating cost`,
      quickReplies: ['100k requests/month', '50k requests/month', '250k requests/month'],
      updatedWorkload: {
        ...currentWorkload,
        use_case_name: message.length > 30 ? message.slice(0, 30) + '...' : message,
      },
      status: 'awaiting_input',
      nodeStatuses: {
        intake_extractor: 'completed',
        hitl_clarifier: 'awaiting_input',
        deterministic_tools: 'pending',
        parallel_critics: 'pending',
        executive_synthesizer: 'pending',
      },
    };
  }
}
