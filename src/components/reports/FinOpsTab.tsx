import React from 'react';
import { PricingProvenance, CurrencyCode } from '../../types/estimator';
import { formatCurrency, USD_TO_INR_RATE } from '../../lib/currency';
import {
  TrendingDown,
  Tag,
  CheckCircle,
  Sliders,
  Database,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

interface FinOpsTabProps {
  pricingProvenance: PricingProvenance | null;
  finopsAuditMd?: string;
  currency: CurrencyCode;
}

export const FinOpsTab: React.FC<FinOpsTabProps> = ({
  pricingProvenance,
  finopsAuditMd,
  currency,
}) => {
  return (
    <div className="space-y-5 text-xs">
      {/* FinOps Audit Rationale */}
      <div className="rounded-xl border border-emerald/30 bg-card-elevated p-4 shadow-emerald-glow">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1 rounded bg-emerald/10 text-emerald">
            <TrendingDown className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-semibold text-text-primary">
            FinOps Optimization & Unit Economics Audit
          </h4>
        </div>
        <div className="text-text-secondary leading-relaxed space-y-2 font-sans text-xs whitespace-pre-line">
          {finopsAuditMd ||
            'Unit economics show that implementing prompt caching and model routing drastically reduces recurring token OpEx without compromising end-user experience.'}
        </div>
      </div>

      {/* Two Column Grid: Verified Provider Rates vs Configurable Assumptions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Verified Provider Rates Card */}
        <div className="rounded-xl border border-border bg-card-elevated p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-border/80">
              <div className="flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-primary" />
                <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wider">
                  Verified Provider Rates
                </h4>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-primary/10 text-primary border border-primary/20">
                {pricingProvenance?.catalog_version || '2026-11-v1'}
              </span>
            </div>

            <div className="space-y-2 font-mono text-[11px]">
              <div className="flex items-center justify-between p-2 rounded bg-[#090D16] border border-border/60">
                <span className="text-text-secondary font-sans">Gemini Flash-Lite Input</span>
                <span className="text-text-primary font-medium">
                  {currency === 'INR' ? '₹6.30 / 1M tokens' : '$0.075 / 1M tokens'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-[#090D16] border border-border/60">
                <span className="text-text-secondary font-sans">Gemini Flash-Lite Output</span>
                <span className="text-text-primary font-medium">
                  {currency === 'INR' ? '₹25.20 / 1M tokens' : '$0.300 / 1M tokens'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-[#090D16] border border-border/60">
                <span className="text-text-secondary font-sans">Prompt Cache Discount</span>
                <span className="text-emerald font-semibold">
                  75% Off Cached Prompts
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-[#090D16] border border-border/60">
                <span className="text-text-secondary font-sans">Cloud GPU NVIDIA L4</span>
                <span className="text-text-primary font-medium">
                  {currency === 'INR' ? '₹71.40 / GPU-hr' : '$0.85 / GPU-hr'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-[#090D16] border border-border/60">
                <span className="text-text-secondary font-sans">Cloud GPU NVIDIA A100</span>
                <span className="text-text-primary font-medium">
                  {currency === 'INR' ? '₹302.40 / GPU-hr' : '$3.60 / GPU-hr'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-border/50 text-[10px] text-text-muted">
            Effective Date: {pricingProvenance?.effective_date || 'November 2026'} • Sourced from official public rate cards.
          </div>
        </div>

        {/* Configurable Optimization Assumptions */}
        <div className="rounded-xl border border-border bg-card-elevated p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-border/80">
              <div className="flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-amber" />
                <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wider">
                  Configurable FinOps Levers
                </h4>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-amber/10 text-amber border border-amber/20">
                Dynamic Assumptions
              </span>
            </div>

            <div className="space-y-2 text-[11px]">
              {pricingProvenance?.configurable_assumptions.map((assump) => (
                <div
                  key={assump.label}
                  className="p-2 rounded bg-[#090D16] border border-border/60"
                >
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-text-primary font-medium font-sans">
                      {assump.label}
                    </span>
                    <span className="text-amber font-semibold">{assump.value.split(' ')[0]}</span>
                  </div>
                  <p className="text-[10px] text-text-muted mt-0.5">{assump.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-border/50 text-[10px] text-amber-light flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber" />
            <span>Assumptions can be tuned live in the What-If Simulator.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
