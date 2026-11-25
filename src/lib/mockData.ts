import {
  EnterprisePreset,
  ComplianceCheckItem,
  PricingProvenance,
} from '../types/estimator';

export const ENTERPRISE_PRESETS: EnterprisePreset[] = [
  {
    id: 'customer_support_rag',
    title: 'Customer Support RAG',
    badge: 'Preset 1 • RAG',
    tagline: '100k req/mo • Strict VPC & Residency',
    description: 'Tier-1 customer service assistant with knowledge base retrieval, strict data residency constraints, and 20% human exception review.',
    workload: {
      use_case_name: 'Customer Support RAG Bot',
      use_case_type: 'rag',
      monthly_requests: 100000,
      avg_input_tokens: 3500,
      avg_output_tokens: 450,
      peak_concurrent_requests: 25,
      cacheable_prompt_ratio: 0.70,
      is_async_batchable: false,
      compliance_requirements: [
        'regional_data_residency',
        'encryption_at_rest_transit',
        'zero_data_retention',
        'audit_logging_redaction'
      ],
      latency_sla_ms: 1500,
      current_manual_cost_usd: 8000,
      remaining_human_ops_ratio: 0.20,
    },
  },
  {
    id: 'invoice_legal_extraction',
    title: 'Legal & Invoice Extraction',
    badge: 'Preset 2 • Extraction',
    tagline: '50k docs/mo • Async Batch Processing',
    description: 'Document intelligence pipeline parsing multi-page invoices, vendor contracts, and compliance filings via cost-effective batch windows.',
    workload: {
      use_case_name: 'Automated Invoice & Legal Parser',
      use_case_type: 'extraction',
      monthly_requests: 50000,
      avg_input_tokens: 8500,
      avg_output_tokens: 650,
      peak_concurrent_requests: 15,
      cacheable_prompt_ratio: 0.85,
      is_async_batchable: true,
      compliance_requirements: [
        'encryption_at_rest_transit',
        'soc2_type_ii',
        'zero_data_retention',
        'contractual_data_isolation'
      ],
      latency_sla_ms: 8000,
      current_manual_cost_usd: 15000,
      remaining_human_ops_ratio: 0.15,
    },
  },
  {
    id: 'internal_dev_copilot',
    title: 'Internal Engineering Copilot',
    badge: 'Preset 3 • Copilot',
    tagline: '2,500 devs • High Concurrency & Low Latency',
    description: 'In-IDE developer assistant for code completion, unit testing, and architectural review with stringent sub-second latency SLAs.',
    workload: {
      use_case_name: 'Enterprise Developer Copilot',
      use_case_type: 'copilot',
      monthly_requests: 350000,
      avg_input_tokens: 2200,
      avg_output_tokens: 350,
      peak_concurrent_requests: 110,
      cacheable_prompt_ratio: 0.60,
      is_async_batchable: false,
      compliance_requirements: [
        'vpc_peering_privatelink',
        'airgap_model_weights',
        'ip_indemnification',
        'zero_third_party_training'
      ],
      latency_sla_ms: 800,
      current_manual_cost_usd: 35000,
      remaining_human_ops_ratio: 0.10,
    },
  },
];

export const MOCK_PRICING_PROVENANCE: PricingProvenance = {
  catalog_version: '2026-11-v1',
  effective_date: 'November 2026',
  verified_sources: [
    'Google Cloud Vertex AI Pricing (Gemini 2.5/3.0 Enterprise)',
    'AWS EC2 G5/G6 & L4 Instance Price Index (us-east-1)',
    'Azure OpenAI Service Rate Card'
  ],
  is_mock_data: true,
  configurable_assumptions: [
    { label: 'Prompt Cache Hit Ratio', value: '70% average across recurring system prompts & docs' },
    { label: 'Model Routing Split', value: '70% Gemini Flash-Lite / 30% Gemini Pro' },
    { label: 'Async Batch Discount', value: '50% reduction for 24-hour SLA queues' },
    { label: 'Cloud GPU Headroom', value: '70% max utilization target for traffic spikes' },
    { label: 'Illustrative FX Rate', value: '1 USD = 84.00 INR (Presentation Layer Only)' }
  ]
};

export const MOCK_COMPLIANCE_ITEMS: ComplianceCheckItem[] = [
  {
    control: 'Data Residency & Sovereignty',
    status: 'met',
    detail: 'Workload deployed exclusively in specified cloud region (e.g. AWS us-east-1 / GCP us-central1). Managed API endpoints configured with regional routing.'
  },
  {
    control: 'Encryption in Transit & at Rest',
    status: 'met',
    detail: 'TLS 1.3 enforced on all ingress/egress. Customer-managed encryption keys (CMEK) supported via AWS KMS / Google Cloud KMS.'
  },
  {
    control: 'Zero Data Retention (ZDR) & No Training',
    status: 'met',
    detail: 'Contractual ZDR agreements enabled on enterprise endpoints. Zero customer prompt or completion data logged or utilized for model fine-tuning.'
  },
  {
    control: 'Private Networking (VPC Peering / PrivateLink)',
    status: 'action_required',
    detail: 'Managed API requires AWS PrivateLink or GCP Service Directory endpoint configuration to eliminate public internet traversals.'
  },
  {
    control: 'Role-Based Access Control (RBAC) & Session Isolation',
    status: 'met',
    detail: 'Cryptographic tenant isolation enforced at database checkpoint level. Session tokens verified on every transaction.'
  },
  {
    control: 'Audit Logging & PII Redaction',
    status: 'met',
    detail: 'Automated PII scrubbing pipeline running locally before token submission. Full immutable LangSmith audit trail.'
  },
  {
    control: 'Regulatory Certification Scope (SOC2 / HIPAA / GDPR)',
    status: 'hard_constraint',
    detail: 'Architectural assessment verifies technical safeguards. Official regulatory compliance requires formal third-party audit and enterprise BAA execution.'
  }
];

export const MOCK_SYNTHESIS_REPORTS = {
  customer_support_rag: {
    recommended_architecture_md: `### Executive Recommendation: Optimized Hybrid API Architecture

For this **Customer Support RAG workload (100k requests/month)**, the **Optimized Hybrid API (Cached + Routed)** configuration delivers the optimal balance of enterprise compliance, low latency, and maximum financial efficiency.

#### Key Decision Drivers:
1. **Cache Efficiency:** High prompt repetitiveness (system instructions, knowledge base context) achieves an estimated **70% prompt-cache hit rate**, slashing token compute expenditure by over **65%**.
2. **Dynamic Model Routing:** Routing 70% of standard intent lookups to lightweight models (Gemini Flash-Lite) while reserving flagship models for complex queries yields an average request latency of **~420ms**, well under the **1,500ms SLA**.
3. **Infrastructure Simplicity:** Avoids the heavy upfront capital and Kubernetes SRE operational overhead (\$1,200/mo) required to operate dedicated GPU replicas at this request volume.`,
    
    finops_audit_md: `### FinOps Optimization Audit & Unit Economics

- **Steady-State Monthly AI OpEx:** **\$640/month** (versus \$2,350/mo on unoptimized standard APIs).
- **Human Review Retention:** Factoring in a **20% human escalation/QA buffer** (\$1,600/mo), the total post-AI monthly spend is **\$2,240/mo**.
- **Net Monthly Savings:** Displaces **\$5,760/mo** against the \$8,000 baseline manual cost.
- **Payback Horizon:** Initial integration investment of **\$4,500** is fully recouped in **0.78 months (~24 days)**.
- **12-Month Net Financial Gain:** **\$64,620** net cash savings with a conventional investment ROI of **530.5%**.`,
    
    security_risk_md: `### Security, Latency & Architectural Risk Audit

- **Data Privacy:** Enterprise API Zero-Data-Retention (ZDR) guarantee ensures prompts are never retained or used for foundational training.
- **Latency Verification:** Projected P95 latency is **480ms**, well below the 1,500ms SLA threshold.
- **Availability & Failover:** Multi-region automatic failover with bounded retry and circuit-breaking prevents cascaded service degradation during upstream provider brownouts.`
  },

  invoice_legal_extraction: {
    recommended_architecture_md: `### Executive Recommendation: Asynchronous Batch Managed API Architecture

For this **Legal & Invoice Extraction pipeline (50k documents/month)**, an **Asynchronous Batch API** architecture achieves unbeatable unit economics by utilizing 24-hour processing windows at a **50% rate discount**.

#### Key Decision Drivers:
1. **Batch Discounting:** Documents are non-interactive and can be queued; batch processing drops token cost from \$4,200/mo down to **\$1,850/mo**.
2. **Context Window Handling:** Legal filings require large context windows (8,500 input tokens). Managed APIs effortlessly handle high-token bursts without needing massive GPU VRAM allocation.
3. **Deterministic Parsing:** High schema adherence with structured JSON outputs and 15% human exception review for low-confidence documents.`,
    
    finops_audit_md: `### FinOps Optimization Audit & Unit Economics

- **Steady-State Monthly AI OpEx:** **\$1,850/month**.
- **Human Review Retention:** 15% manual review overhead (\$2,250/mo), bringing total post-AI cost to **\$4,100/mo**.
- **Net Monthly Savings:** **\$10,900/month** compared to the \$15,000 baseline manual cost.
- **Payback Horizon:** Initial setup investment of **\$6,000** recouped in **0.55 months (~17 days)**.
- **12-Month Net Financial Gain:** **\$124,800** net gain with a 12-month ROI of **442.6%**.`,
    
    security_risk_md: `### Security, Latency & Architectural Risk Audit

- **SOC2 Type II & Contractual Isolation:** Vendor agreements must mandate SOC2 compliance and zero-retention storage for uploaded PDF artifacts.
- **Latency Compliance:** 8,000ms SLA easily met as batch jobs execute asynchronously in worker pools.
- **Risk Mitigation:** Strict regex and Pydantic validation before database insertion prevents poisoned extraction payloads.`
  },

  internal_dev_copilot: {
    recommended_architecture_md: `### Executive Recommendation: Dedicated Self-Hosted GPU Cluster (NVIDIA A100 / L4)

For the **Internal Engineering Copilot (2,500 developers, 350k req/mo)**, a **Self-Hosted GPU Cluster deployed inside a Private VPC** is the recommended choice due to strict IP protection and rigorous sub-second latency requirements.

#### Key Decision Drivers:
1. **Intellectual Property & Airgap:** Zero exposure of proprietary source code to external SaaS vendors; model weights run entirely inside the enterprise AWS/GCP VPC.
2. **Throughput & Concurrency:** 110 peak concurrent requests and 1,850 tokens/sec demand dedicated hardware to guarantee **<800ms Time-To-First-Token (TTFT)**.
3. **Fixed Compute Costs:** At high request volumes, dedicated GPU instances provide predictable flat-rate monthly costs compared to variable per-token API charges.`,
    
    finops_audit_md: `### FinOps Optimization Audit & Unit Economics

- **Steady-State Monthly AI OpEx:** **\$4,680/month** (Cloud GPU instances + storage + \$1,200/mo dedicated SRE overhead).
- **Human Oversight Buffer:** 10% senior architect review overhead (\$3,200/mo), total post-AI cost = **\$7,880/mo**.
- **Net Monthly Savings:** **\$27,120/month** against \$35,000 manual engineering baseline.
- **Payback Horizon:** Initial setup investment of **\$12,000** recouped in **0.44 months (~14 days)**.
- **12-Month Net Financial Gain:** **\$313,440** net gain with a 12-month ROI of **460.9%**.`,
    
    security_risk_md: `### Security, Latency & Architectural Risk Audit

- **Strict VPC Airgap:** PrivateLink and VPC endpoints ensure zero internet egress for code snippets.
- **Sub-Second SLA:** Dedicated vLLM engine delivers median latency of **320ms**, satisfying the 800ms SLA.
- **Operational Complexity:** Requires dedicated Kubernetes DaemonSets and GPU monitoring; failover to secondary cloud zone recommended.`
  }
};
