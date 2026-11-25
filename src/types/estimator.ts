export type NodeStatus =
  | "pending"
  | "running"
  | "awaiting_input"
  | "completed";

export type CurrencyCode = "USD" | "INR";

export type WorkloadType =
  | "rag"
  | "extraction"
  | "agent"
  | "copilot";

export interface WorkloadSpec {
  use_case_name: string;
  use_case_type: WorkloadType;
  monthly_requests: number;
  avg_input_tokens: number;
  avg_output_tokens: number;
  peak_concurrent_requests: number;
  cacheable_prompt_ratio: number;
  is_async_batchable: boolean;
  compliance_requirements: string[];
  latency_sla_ms: number;
  current_manual_cost_usd: number;
  remaining_human_ops_ratio: number;
}

export interface CapacityMetrics {
  gpu_model: string;
  vram_per_gpu_gb: number;
  kv_cache_per_seq_gb: number;
  required_tps: number;
  estimated_ttft_ms: number;
  gpu_utilization_pct: number;
  required_replicas: number;
  sla_feasible: boolean;
  feasibility_note: string;
}

export interface ArchitectureOption {
  id: "standard_api" | "hybrid_cached" | "self_hosted_gpu";
  name: string;
  compute_token_cost_usd: number;
  storage_vector_cost_usd: number;
  ops_overhead_usd: number;
  total_monthly_usd: number;
  setup_cost_usd: number;
  recommended: boolean;
  sla_feasible: boolean;
}

export interface FinancialSummary {
  recommended_tier_id: ArchitectureOption["id"];
  baseline_manual_monthly_usd: number;
  setup_investment_usd: number;
  recommended_ai_monthly_usd: number;
  remaining_human_monthly_usd: number;
  total_monthly_post_ai_usd: number;
  net_monthly_savings_usd: number;
  twelve_month_displaced_manual_cost_usd: number;
  total_twelve_month_ai_investment_usd: number;
  twelve_month_net_gain_usd: number;
  cumulative_12m_savings_usd: number;
  conventional_roi_12m_pct: number;
  payback_months: number | null;
}

export interface MonthlyProjection {
  month: string;
  cumulative_manual_usd: number;
  cumulative_ai_program_usd: number;
}

export interface ComplianceCheckItem {
  control: string;
  status: "met" | "action_required" | "hard_constraint";
  detail: string;
}

export interface PricingProvenance {
  catalog_version: string;
  effective_date: string;
  verified_sources: string[];
  is_mock_data: boolean;
  configurable_assumptions: {
    label: string;
    value: string;
  }[];
}

export interface NodeStatuses {
  intake_extractor: NodeStatus;
  hitl_clarifier: NodeStatus;
  deterministic_tools: NodeStatus;
  parallel_critics: NodeStatus;
  executive_synthesizer: NodeStatus;
}

export interface EstimatorResponse {
  thread_id: string;
  status: "awaiting_input" | "completed" | "error";
  assistant_message: string;
  quick_replies: string[];
  workload_spec: Partial<WorkloadSpec>;
  node_statuses: NodeStatuses;
  financials: FinancialSummary | null;
  capacity_metrics: CapacityMetrics | null;
  architecture_options: ArchitectureOption[] | null;
  monthly_projections: MonthlyProjection[] | null;
  compliance_checklist: ComplianceCheckItem[] | null;
  pricing_provenance: PricingProvenance | null;
  synthesis: {
    recommended_architecture_md: string;
    finops_audit_md: string;
    security_risk_md: string;
  } | null;
}

export interface ChatMessageItem {
  id: string;
  sender: "user" | "assistant";
  content: string;
  timestamp: string;
  quickReplies?: string[];
  isThinking?: boolean;
}

export interface EnterprisePreset {
  id: string;
  title: string;
  badge: string;
  tagline: string;
  description: string;
  workload: WorkloadSpec;
}
