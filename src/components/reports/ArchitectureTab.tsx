import React from 'react';
import {
  ArchitectureOption,
  CapacityMetrics,
  CurrencyCode,
} from '../../types/estimator';
import { formatCurrency, formatNumber } from '../../lib/currency';
import {
  Server,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Layers,
  ShieldCheck,
} from 'lucide-react';

interface ArchitectureTabProps {
  architectureOptions: ArchitectureOption[] | null;
  capacityMetrics: CapacityMetrics | null;
  recommendedArchitectureMd?: string;
  currency: CurrencyCode;
}

export const ArchitectureTab: React.FC<ArchitectureTabProps> = ({
  architectureOptions,
  capacityMetrics,
  recommendedArchitectureMd,
  currency,
}) => {
  return (
    <div className="space-y-5 text-xs">
      {/* Executive Rationale Card */}
      <div className="rounded-xl border border-primary/30 bg-card-elevated p-4 shadow-cyan-glow">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1 rounded bg-primary/10 text-primary">
            <Zap className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-semibold text-text-primary">
            Architecture Decision Record (ADR) Synthesis
          </h4>
        </div>
        <div className="prose prose-invert max-w-none text-xs text-text-secondary leading-relaxed space-y-2">
          {recommendedArchitectureMd ? (
            <div className="whitespace-pre-line font-sans text-xs">
              {recommendedArchitectureMd}
            </div>
          ) : (
            <p>
              The hybrid architecture offers the optimal cost-performance frontier for this workload, leveraging prompt caching to minimize recurring input token expenses while maintaining sub-second SLA compliance.
            </p>
          )}
        </div>
      </div>

      {/* Side-by-Side 3-Tier Architecture Comparison Table */}
      <div className="rounded-xl border border-border bg-card-elevated overflow-hidden">
        <div className="p-3.5 border-b border-border bg-[#090D16]/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald" />
            <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wider">
              Three-Tier Architecture Matrix
            </h4>
          </div>
          <span className="text-[10px] font-mono text-text-muted">
            Audited Against Provider Rate Cards
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-[#090D16] text-[11px] text-text-muted border-b border-border">
              <tr>
                <th className="py-2.5 px-3 font-sans">Architecture Tier</th>
                <th className="py-2.5 px-3">Compute / Tokens</th>
                <th className="py-2.5 px-3">Storage & Vector</th>
                <th className="py-2.5 px-3">SRE Ops Overhead</th>
                <th className="py-2.5 px-3">Total Monthly</th>
                <th className="py-2.5 px-3">Initial Setup</th>
                <th className="py-2.5 px-3 font-sans text-center">Recommendation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {architectureOptions?.map((tier) => (
                <tr
                  key={tier.id}
                  className={`transition-colors ${
                    tier.recommended
                      ? 'bg-primary/5 hover:bg-primary/10'
                      : 'hover:bg-card-hover/40'
                  }`}
                >
                  <td className="py-3 px-3 font-sans font-medium text-text-primary flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        tier.recommended ? 'bg-primary shadow-cyan-glow' : 'bg-border'
                      }`}
                    />
                    {tier.name}
                  </td>
                  <td className="py-3 px-3 text-text-secondary">
                    {formatCurrency(tier.compute_token_cost_usd, currency)}
                  </td>
                  <td className="py-3 px-3 text-text-secondary">
                    {formatCurrency(tier.storage_vector_cost_usd, currency)}
                  </td>
                  <td className="py-3 px-3 text-text-secondary">
                    {formatCurrency(tier.ops_overhead_usd, currency)}
                  </td>
                  <td className="py-3 px-3 font-bold text-text-primary">
                    {formatCurrency(tier.total_monthly_usd, currency)}
                  </td>
                  <td className="py-3 px-3 text-text-muted">
                    {formatCurrency(tier.setup_cost_usd, currency)}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {tier.recommended ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-primary/10 text-primary border border-primary/30">
                        <CheckCircle2 className="w-3 h-3" />
                        RECOMMENDED
                      </span>
                    ) : (
                      <span className="text-[10px] text-text-muted">Alternate</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* GPU Capacity Planner Card */}
      {capacityMetrics && (
        <div className="rounded-xl border border-border bg-card-elevated p-4">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-border/80">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-primary" />
              <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wider">
                Workload Capacity Planner (Hardware Sizing)
              </h4>
            </div>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${
                capacityMetrics.sla_feasible
                  ? 'bg-emerald/10 text-emerald border-emerald/30'
                  : 'bg-rose/10 text-rose border-rose/30'
              }`}
            >
              {capacityMetrics.sla_feasible ? 'SLA VERIFIED' : 'SLA BOTTLENECK'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono text-center">
            <div className="p-2.5 rounded-lg bg-[#090D16] border border-border">
              <span className="text-[10px] text-text-muted block font-sans">Target Hardware</span>
              <span className="text-xs font-bold text-text-primary mt-1 block">
                {capacityMetrics.gpu_model}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-[#090D16] border border-border">
              <span className="text-[10px] text-text-muted block font-sans">Per-GPU VRAM</span>
              <span className="text-xs font-bold text-primary mt-1 block">
                {capacityMetrics.vram_per_gpu_gb} GB
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-[#090D16] border border-border">
              <span className="text-[10px] text-text-muted block font-sans">KV-Cache / Seq</span>
              <span className="text-xs font-bold text-text-primary mt-1 block">
                {capacityMetrics.kv_cache_per_seq_gb} GB
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-[#090D16] border border-border">
              <span className="text-[10px] text-text-muted block font-sans">Peak TPS Req</span>
              <span className="text-xs font-bold text-emerald mt-1 block">
                {capacityMetrics.required_tps} TPS
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-[#090D16] border border-border">
              <span className="text-[10px] text-text-muted block font-sans">Target Utilization</span>
              <span className="text-xs font-bold text-amber mt-1 block">
                {capacityMetrics.gpu_utilization_pct}%
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-[#090D16] border border-primary/30">
              <span className="text-[10px] text-text-muted block font-sans">Required Replicas</span>
              <span className="text-sm font-extrabold text-primary-light mt-0.5 block">
                {capacityMetrics.required_replicas} Replicas
              </span>
            </div>
          </div>

          <div className="mt-3 p-2.5 rounded bg-[#090D16]/80 border border-border/80 text-[11px] text-text-secondary font-mono flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald shrink-0" />
            <span>{capacityMetrics.feasibility_note}</span>
          </div>
        </div>
      )}
    </div>
  );
};
