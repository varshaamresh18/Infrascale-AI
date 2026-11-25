import React from 'react';
import {
  Sparkles,
  Bot,
  FileText,
  Code2,
  Layers,
  ShieldCheck,
  Check,
  Sliders,
  DollarSign,
  Info,
} from 'lucide-react';
import {
  EnterprisePreset,
  WorkloadSpec,
  NodeStatuses,
  CurrencyCode,
} from '../../types/estimator';
import { ENTERPRISE_PRESETS } from '../../lib/mockData';
import { formatCurrency, formatNumber } from '../../lib/currency';
import { LangGraphStepper } from '../workflow/LangGraphStepper';

interface SidebarProps {
  selectedPresetId: string | null;
  onSelectPreset: (preset: EnterprisePreset) => void;
  activeWorkload: Partial<WorkloadSpec>;
  nodeStatuses: NodeStatuses;
  currentStageMessage?: string;
  currency: CurrencyCode;
}

export const Sidebar: React.FC<SidebarProps> = ({
  selectedPresetId,
  onSelectPreset,
  activeWorkload,
  nodeStatuses,
  currentStageMessage,
  currency,
}) => {
  const getPresetIcon = (id: string) => {
    switch (id) {
      case 'customer_support_rag':
        return <Bot className="w-4 h-4 text-primary" />;
      case 'invoice_legal_extraction':
        return <FileText className="w-4 h-4 text-emerald" />;
      case 'internal_dev_copilot':
        return <Code2 className="w-4 h-4 text-amber" />;
      default:
        return <Sparkles className="w-4 h-4 text-primary" />;
    }
  };

  return (
    <aside className="w-full lg:w-[340px] shrink-0 border-r border-border bg-[#090D16] p-4 flex flex-col gap-5 overflow-y-auto max-h-full">
      {/* SECTION A: Enterprise Workload Presets */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold tracking-wider uppercase text-text-secondary">
              Enterprise Presets
            </span>
          </div>
          <span className="text-[10px] font-mono text-text-muted">3 Architectures</span>
        </div>

        <div className="space-y-2">
          {ENTERPRISE_PRESETS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => onSelectPreset(preset)}
                className={`w-full text-left p-3 rounded-xl border transition-all text-xs relative group ${
                  isSelected
                    ? 'bg-card-elevated border-primary/60 shadow-cyan-glow ring-1 ring-primary/40'
                    : 'bg-card border-border/80 hover:border-border hover:bg-card-elevated'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div
                      className={`p-1.5 rounded-lg border ${
                        isSelected
                          ? 'bg-primary/20 border-primary/40'
                          : 'bg-card-elevated border-border'
                      }`}
                    >
                      {getPresetIcon(preset.id)}
                    </div>
                    <span className="font-semibold text-text-primary text-xs">
                      {preset.title}
                    </span>
                  </div>
                  {isSelected && (
                    <span className="w-4 h-4 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-text-muted line-clamp-2 mt-1">
                  {preset.description}
                </p>

                <div className="mt-2 pt-2 border-t border-border/50 flex items-center justify-between text-[10px] font-mono text-text-secondary">
                  <span>{preset.tagline.split('•')[0]}</span>
                  <span className="text-primary font-medium">{preset.workload.use_case_type.toUpperCase()}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION B: Extracted Workload Specification */}
      <div className="rounded-xl border border-border bg-card-elevated p-3.5 text-xs">
        <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-border/80">
          <div className="flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-emerald" />
            <span className="text-xs font-semibold tracking-wider uppercase text-text-secondary">
              Extracted Workload Spec
            </span>
          </div>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-primary/10 text-primary border border-primary/20">
            {activeWorkload.use_case_type?.toUpperCase() || 'CUSTOM'}
          </span>
        </div>

        <div className="space-y-1.5 font-mono text-[11px]">
          <div className="flex items-center justify-between py-0.5 border-b border-border/40">
            <span className="text-text-muted font-sans">Monthly Volume</span>
            <span className="text-text-primary font-medium">
              {formatNumber(activeWorkload.monthly_requests)} req/mo
            </span>
          </div>

          <div className="flex items-center justify-between py-0.5 border-b border-border/40">
            <span className="text-text-muted font-sans">Tokens (In / Out)</span>
            <span className="text-text-primary font-medium">
              {formatNumber(activeWorkload.avg_input_tokens)} / {formatNumber(activeWorkload.avg_output_tokens)}
            </span>
          </div>

          <div className="flex items-center justify-between py-0.5 border-b border-border/40">
            <span className="text-text-muted font-sans">Peak Concurrency</span>
            <span className="text-text-primary font-medium">
              {activeWorkload.peak_concurrent_requests || 0} streams
            </span>
          </div>

          <div className="flex items-center justify-between py-0.5 border-b border-border/40">
            <span className="text-text-muted font-sans">Latency SLA</span>
            <span className="text-emerald font-medium">
              {activeWorkload.latency_sla_ms || 0} ms
            </span>
          </div>

          <div className="flex items-center justify-between py-0.5 border-b border-border/40">
            <span className="text-text-muted font-sans">Baseline Manual Cost</span>
            <span className="text-rose font-medium">
              {formatCurrency(activeWorkload.current_manual_cost_usd, currency)}/mo
            </span>
          </div>

          <div className="flex items-center justify-between py-0.5">
            <span className="text-text-muted font-sans">Human QA Retention</span>
            <span className="text-amber font-medium">
              {((activeWorkload.remaining_human_ops_ratio || 0.2) * 100).toFixed(0)}%
            </span>
          </div>
        </div>

        {activeWorkload.compliance_requirements && activeWorkload.compliance_requirements.length > 0 && (
          <div className="mt-2.5 pt-2 border-t border-border/60">
            <span className="text-[10px] text-text-muted font-sans block mb-1">
              Active Compliance Constraints:
            </span>
            <div className="flex flex-wrap gap-1">
              {activeWorkload.compliance_requirements.map((c) => (
                <span
                  key={c}
                  className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-card border border-border text-text-secondary"
                >
                  {c.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SECTION C: 5-Node LangGraph Stepper */}
      <LangGraphStepper
        statuses={nodeStatuses}
        currentStageMessage={currentStageMessage}
      />
    </aside>
  );
};
