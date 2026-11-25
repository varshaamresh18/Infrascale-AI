import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Zap, Clock, ShieldAlert } from 'lucide-react';
import { FinancialSummary, CurrencyCode } from '../../types/estimator';
import { formatCurrency } from '../../lib/currency';

interface KpiCardsProps {
  financials: FinancialSummary | null;
  currency: CurrencyCode;
}

export const KpiCards: React.FC<KpiCardsProps> = ({ financials, currency }) => {
  if (!financials) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-28 rounded-xl border border-border/60 bg-card-elevated/50 animate-pulse p-4"
          />
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Recommended Monthly AI OpEx',
      value: formatCurrency(financials.recommended_ai_monthly_usd, currency),
      subtext: `Tier: ${financials.recommended_tier_id.toUpperCase().replace('_', ' ')}`,
      icon: Zap,
      accentColor: 'text-primary',
      bgGlow: 'border-primary/30 shadow-cyan-glow',
      badge: 'Optimized Compute',
      badgeStyle: 'bg-primary/10 text-primary border-primary/20',
    },
    {
      title: 'Net Monthly Savings',
      value: formatCurrency(financials.net_monthly_savings_usd, currency),
      subtext: `After ${formatCurrency(financials.remaining_human_monthly_usd, currency)} Human QA`,
      icon: TrendingUp,
      accentColor: 'text-emerald',
      bgGlow: 'border-emerald/30 shadow-emerald-glow',
      badge: 'Post-AI Net',
      badgeStyle: 'bg-emerald/10 text-emerald border-emerald/20',
    },
    {
      title: 'Conventional 12M ROI',
      value: `${financials.conventional_roi_12m_pct}%`,
      subtext: `Net Gain: ${formatCurrency(financials.twelve_month_net_gain_usd, currency)}`,
      icon: DollarSign,
      accentColor: 'text-emerald-light',
      bgGlow: 'border-emerald/30',
      badge: 'Verified Math',
      badgeStyle: 'bg-emerald/10 text-emerald-light border-emerald/20',
    },
    {
      title: 'Steady-State Payback',
      value: financials.payback_months !== null ? `${financials.payback_months} mo` : 'N/A',
      subtext: `Setup: ${formatCurrency(financials.setup_investment_usd, currency)} recouped`,
      icon: Clock,
      accentColor: 'text-amber-light',
      bgGlow: 'border-amber/30',
      badge: financials.payback_months !== null ? 'Rapid Horizon' : 'Deficit',
      badgeStyle: 'bg-amber/10 text-amber border-amber/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: idx * 0.08 }}
            className={`rounded-xl border bg-card-elevated p-4 relative overflow-hidden transition-all hover:bg-card-hover group ${card.bgGlow}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-text-secondary">
                {card.title}
              </span>
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-medium border ${card.badgeStyle}`}
              >
                {card.badge}
              </span>
            </div>

            <div className="flex items-baseline justify-between mt-1">
              <div className="font-mono text-2xl font-bold tracking-tight text-text-primary group-hover:scale-[1.02] transition-transform">
                {card.value}
              </div>
              <div className="p-1.5 rounded-lg bg-card border border-border/80">
                <Icon className={`w-4 h-4 ${card.accentColor}`} />
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-border/40 flex items-center justify-between text-[11px] text-text-muted">
              <span className="truncate">{card.subtext}</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
