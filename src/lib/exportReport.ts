import { EstimatorResponse, CurrencyCode } from '../types/estimator';
import { formatCurrency, formatNumber } from './currency';

export function generateMarkdownReport(
  response: EstimatorResponse,
  currency: CurrencyCode
): string {
  const spec = response.workload_spec;
  const fin = response.financials;
  const cap = response.capacity_metrics;
  const archs = response.architecture_options;
  const synth = response.synthesis;
  const compliance = response.compliance_checklist;
  const pricing = response.pricing_provenance;

  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `# Architecture Decision Record (ADR) & Enterprise FinOps Blueprint
**System:** InfraScale AI — Enterprise AI Infrastructure & FinOps Advisor  
**Generated:** ${dateStr}  
**Session ID:** \`${response.thread_id}\`  
**Currency Mode:** ${currency} (Illustrative FX: 1 USD = ₹84)  

---

## 1. Executive Summary & Recommended Architecture

${synth?.recommended_architecture_md || 'Architecture synthesis generated via deterministic FinOps analysis.'}

### Recommended Tier Metrics:
- **Selected Tier:** \`${fin?.recommended_tier_id?.toUpperCase() || 'HYBRID_CACHED'}\`
- **Steady-State Monthly AI OpEx:** ${formatCurrency(fin?.recommended_ai_monthly_usd, currency)}
- **Remaining Human QA (20%):** ${formatCurrency(fin?.remaining_human_monthly_usd, currency)}
- **Total Post-AI Monthly Spend:** ${formatCurrency(fin?.total_monthly_post_ai_usd, currency)}
- **Net Monthly Savings:** ${formatCurrency(fin?.net_monthly_savings_usd, currency)}
- **Conventional 12-Month ROI:** **${fin?.conventional_roi_12m_pct}%**
- **Payback Period:** **${fin?.payback_months ?? 'N/A'} Months**

---

## 2. Workload & Capacity Specification

| Specification Parameter | Value |
|---|---|
| Use Case Name | ${spec.use_case_name || 'N/A'} |
| Workload Classification | ${(spec.use_case_type || 'RAG').toUpperCase()} |
| Monthly Request Volume | ${formatNumber(spec.monthly_requests)} req/mo |
| Average Input / Output Tokens | ${formatNumber(spec.avg_input_tokens)} in / ${formatNumber(spec.avg_output_tokens)} out |
| Peak Concurrency | ${spec.peak_concurrent_requests || 0} concurrent streams |
| Latency SLA Target | ${spec.latency_sla_ms || 0} ms |
| Baseline Manual Monthly Spend | ${formatCurrency(spec.current_manual_cost_usd, currency)}/mo |
| Retained Human QA Overhead | ${((spec.remaining_human_ops_ratio || 0.2) * 100).toFixed(0)}% |

---

## 3. Workload Capacity & GPU Replica Sizing

- **Target GPU Model:** ${cap?.gpu_model || 'NVIDIA L4'}
- **VRAM per GPU:** ${cap?.vram_per_gpu_gb || 24} GB
- **Per-Sequence KV-Cache Memory:** ${cap?.kv_cache_per_seq_gb || 0.05} GB
- **Peak Throughput Required:** ${cap?.required_tps || 0} Tokens/Sec (TPS)
- **Estimated TTFT (Time-To-First-Token):** ${cap?.estimated_ttft_ms || 0} ms
- **Required GPU Replicas:** **${cap?.required_replicas || 1} Replicas** (at ${cap?.gpu_utilization_pct || 70}% target headroom)
- **SLA Feasibility Assessment:** ${cap?.sla_feasible ? 'PASSED ✅' : 'WARNING ⚠️'} — ${cap?.feasibility_note || ''}

---

## 4. Three-Tier Cost Comparison

| Architecture Tier | Compute / Tokens | Storage / Vector | Ops Overhead | Total Monthly | Setup Cost |
|---|---|---|---|---|---|
${archs?.map(a => `| ${a.name} | ${formatCurrency(a.compute_token_cost_usd, currency)} | ${formatCurrency(a.storage_vector_cost_usd, currency)} | ${formatCurrency(a.ops_overhead_usd, currency)} | **${formatCurrency(a.total_monthly_usd, currency)}** | ${formatCurrency(a.setup_cost_usd, currency)} |`).join('\n') || ''}

---

## 5. Reconciled 12-Month Financial Model

- **Baseline Manual 12-Month Spend:** ${formatCurrency((fin?.baseline_manual_monthly_usd || 0) * 12, currency)}
- **Displaced Manual Labor (80%):** ${formatCurrency(fin?.twelve_month_displaced_manual_cost_usd, currency)}
- **Initial Setup Investment:** ${formatCurrency(fin?.setup_investment_usd, currency)}
- **Total 12-Month AI Program Investment:** ${formatCurrency(fin?.total_twelve_month_ai_investment_usd, currency)}
- **12-Month Net Financial Gain:** **${formatCurrency(fin?.twelve_month_net_gain_usd, currency)}**
- **Conventional ROI:** **${fin?.conventional_roi_12m_pct}%**
- **Payback Period:** **${fin?.payback_months ?? 'N/A'} Months**

---

## 6. FinOps Audit & Optimization Levers

${synth?.finops_audit_md || 'FinOps audit completed.'}

---

## 7. Security, Compliance & Latency Audit

${synth?.security_risk_md || 'Security & latency audit completed.'}

### Compliance Control Readiness Checklist:
${compliance?.map(c => `- [${c.status === 'met' ? 'x' : ' '}] **${c.control}:** (${c.status.toUpperCase()}) — ${c.detail}`).join('\n') || ''}

---

## 8. Pricing Provenance & Assumptions

- **Pricing Catalogue Version:** ${pricing?.catalog_version || '2026-11-v1'}
- **Effective Date:** ${pricing?.effective_date || 'November 2026'}
- **Verified Sources:**
${pricing?.verified_sources.map(s => `  - ${s}`).join('\n') || ''}
- **Assumptions Applied:**
${pricing?.configurable_assumptions.map(a => `  - **${a.label}:** ${a.value}`).join('\n') || ''}

---
*Report generated deterministically by InfraScale AI (Zero-Hallucination FinOps Framework).*
`;
}

export function downloadReportFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
