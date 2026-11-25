import React from 'react';
import { FinancialSummary, CurrencyCode } from '../../types/estimator';
import { formatCurrency } from '../../lib/currency';
import { Calculator, DollarSign, TrendingUp, HelpCircle } from 'lucide-react';

interface FinancialTabProps {
  financials: FinancialSummary | null;
  currency: CurrencyCode;
}

export const FinancialTab: React.FC<FinancialTabProps> = ({
  financials,
  currency,
}) => {
  if (!financials) {
    return (
      <div className="rounded-xl border border-border bg-card-elevated p-8 text-center text-text-muted text-xs">
        Financial models will appear after scenario analysis.
      </div>
    );
  }

  const rows = [
    {
      category: 'Status Quo Baseline',
      label: 'Baseline Manual Monthly OpEx',
      formula: 'Current human agent / manual labor spend',
      value: formatCurrency(financials.baseline_manual_monthly_usd, currency),
      highlight: false,
    },
    {
      category: 'Capital Expenditure',
      label: 'Initial Setup & Integration Investment',
      formula: 'RAG pipeline, prompt engineering, security & testing',
      value: formatCurrency(financials.setup_investment_usd, currency),
      highlight: false,
    },
    {
      category: 'Post-AI OpEx',
      label: 'Monthly AI Infrastructure OpEx',
      formula: 'Compute tokens + vector database + SRE monitoring',
      value: formatCurrency(financials.recommended_ai_monthly_usd, currency),
      highlight: false,
      color: 'text-primary',
    },
    {
      category: 'Post-AI OpEx',
      label: 'Remaining Human QA & Review OpEx',
      formula: 'Configured manual exception review buffer (e.g. 20%)',
      value: formatCurrency(financials.remaining_human_monthly_usd, currency),
      highlight: false,
      color: 'text-amber',
    },
    {
      category: 'Post-AI OpEx',
      label: 'Total Monthly Post-AI Cost',
      formula: 'Monthly AI Compute + Remaining Human Review',
      value: formatCurrency(financials.total_monthly_post_ai_usd, currency),
      highlight: true,
      color: 'text-rose-light',
    },
    {
      category: 'Net Cash Flow',
      label: 'Net Monthly Operational Savings',
      formula: 'Baseline Manual Cost − Total Post-AI Cost',
      value: formatCurrency(financials.net_monthly_savings_usd, currency),
      highlight: true,
      color: 'text-emerald font-bold',
    },
    {
      category: '12-Month Projections',
      label: '12-Month Displaced Manual Labor',
      formula: '(Baseline Manual − Remaining Human QA) × 12',
      value: formatCurrency(financials.twelve_month_displaced_manual_cost_usd, currency),
      highlight: false,
    },
    {
      category: '12-Month Projections',
      label: 'Total 12-Month AI Program Investment',
      formula: 'Initial Setup + (Monthly AI OpEx × 12)',
      value: formatCurrency(financials.total_twelve_month_ai_investment_usd, currency),
      highlight: false,
    },
    {
      category: '12-Month Projections',
      label: '12-Month Net Financial Gain',
      formula: '12M Displaced Manual − Total 12M AI Investment',
      value: formatCurrency(financials.twelve_month_net_gain_usd, currency),
      highlight: true,
      color: 'text-emerald-light font-bold text-sm',
    },
    {
      category: 'Executive Returns',
      label: 'Conventional 12-Month Investment ROI',
      formula: '(12M Net Gain / Total 12M Investment) × 100',
      value: `${financials.conventional_roi_12m_pct}%`,
      highlight: true,
      color: 'text-emerald font-extrabold text-sm',
    },
    {
      category: 'Executive Returns',
      label: 'Steady-State Payback Horizon',
      formula: 'Initial Setup / Net Monthly Savings',
      value: financials.payback_months !== null ? `${financials.payback_months} Months` : 'N/A',
      highlight: true,
      color: 'text-primary font-bold text-sm',
    },
  ];

  return (
    <div className="space-y-4 text-xs">
      <div className="rounded-xl border border-border bg-card-elevated overflow-hidden shadow-card-glow">
        <div className="p-3.5 border-b border-border bg-[#090D16]/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-emerald" />
            <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wider">
              Reconciled Financial Audit & Return on Investment Ledger
            </h4>
          </div>
          <span className="text-[10px] font-mono text-emerald px-2 py-0.5 rounded bg-emerald/10 border border-emerald/20">
            Deterministic Engine Verified
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-[#090D16] text-[11px] text-text-muted border-b border-border font-sans">
              <tr>
                <th className="py-2.5 px-3">Classification</th>
                <th className="py-2.5 px-3">Financial Metric</th>
                <th className="py-2.5 px-3">Calculation Formula / Rationale</th>
                <th className="py-2.5 px-3 text-right">Audited Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {rows.map((row, idx) => (
                <tr
                  key={idx}
                  className={`transition-colors ${
                    row.highlight
                      ? 'bg-card/70 font-semibold'
                      : 'hover:bg-card-hover/40'
                  }`}
                >
                  <td className="py-2.5 px-3 font-sans text-text-muted text-[11px]">
                    {row.category}
                  </td>
                  <td className="py-2.5 px-3 font-sans font-medium text-text-primary">
                    {row.label}
                  </td>
                  <td className="py-2.5 px-3 text-text-muted text-[11px]">
                    {row.formula}
                  </td>
                  <td className={`py-2.5 px-3 text-right ${row.color || 'text-text-primary'}`}>
                    {row.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
