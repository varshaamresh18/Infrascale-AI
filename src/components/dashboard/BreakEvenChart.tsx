import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { MonthlyProjection, CurrencyCode } from '../../types/estimator';
import { USD_TO_INR_RATE } from '../../lib/currency';
import { TrendingUp, Award } from 'lucide-react';

interface BreakEvenChartProps {
  projections: MonthlyProjection[] | null;
  currency: CurrencyCode;
  paybackMonths: number | null;
}

export const BreakEvenChart: React.FC<BreakEvenChartProps> = ({
  projections,
  currency,
  paybackMonths,
}) => {
  if (!projections || projections.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card-elevated p-5 flex items-center justify-center h-80 text-text-muted text-xs">
        Projections available after running architecture analysis.
      </div>
    );
  }

  const multiplier = currency === 'INR' ? USD_TO_INR_RATE : 1;

  const data = projections.map((p) => ({
    month: p.month,
    'Status-Quo Manual': Math.round(p.cumulative_manual_usd * multiplier),
    'Post-AI Program': Math.round(p.cumulative_ai_program_usd * multiplier),
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const manualVal = payload.find((p: any) => p.dataKey === 'Status-Quo Manual')?.value || 0;
      const aiVal = payload.find((p: any) => p.dataKey === 'Post-AI Program')?.value || 0;
      const netSavings = manualVal - aiVal;

      return (
        <div className="rounded-lg border border-border bg-[#090D16] p-3 text-xs shadow-card-glow font-mono">
          <p className="font-sans font-semibold text-text-primary mb-1.5">{label} Cumulative</p>
          <div className="flex items-center justify-between gap-4 py-0.5">
            <span className="flex items-center gap-1.5 text-rose">
              <span className="w-2 h-2 rounded-full bg-rose" />
              Manual Cost:
            </span>
            <span className="text-text-primary font-medium">
              {currency === 'INR' ? `₹${manualVal.toLocaleString('en-IN')}` : `$${manualVal.toLocaleString('en-US')}`}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4 py-0.5">
            <span className="flex items-center gap-1.5 text-primary">
              <span className="w-2 h-2 rounded-full bg-primary" />
              AI Program:
            </span>
            <span className="text-text-primary font-medium">
              {currency === 'INR' ? `₹${aiVal.toLocaleString('en-IN')}` : `$${aiVal.toLocaleString('en-US')}`}
            </span>
          </div>
          <div className="mt-1.5 pt-1.5 border-t border-border flex items-center justify-between font-bold">
            <span className="text-text-secondary font-sans">Cumulative Savings:</span>
            <span className={netSavings >= 0 ? 'text-emerald' : 'text-rose'}>
              {currency === 'INR' ? `₹${netSavings.toLocaleString('en-IN')}` : `$${netSavings.toLocaleString('en-US')}`}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-xl border border-border bg-card-elevated p-4 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-sm font-semibold text-text-primary">
              12-Month Cumulative Cost & Break-Even Curve
            </h3>
            <p className="text-xs text-text-muted">
              Cumulative Status-Quo vs. Total AI Program Investment
            </p>
          </div>
          {paybackMonths !== null && (
            <span className="flex items-center gap-1 text-[11px] font-mono text-emerald px-2 py-0.5 rounded bg-emerald/10 border border-emerald/20">
              <Award className="w-3 h-3" />
              Break-Even: Month {Math.max(1, Math.ceil(paybackMonths))}
            </span>
          )}
        </div>

        <div className="h-64 w-full mt-3">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -10, bottom: 20 }}
            >
              <defs>
                <linearGradient id="colorManual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#F43F5E" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorAi" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis
                dataKey="month"
                stroke="#64748B"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#273449' }}
              />
              <YAxis
                stroke="#64748B"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#273449' }}
                tickFormatter={(val) => {
                  if (currency === 'INR') {
                    return val >= 10000000
                      ? `₹${(val / 10000000).toFixed(1)}Cr`
                      : val >= 100000
                      ? `₹${(val / 100000).toFixed(0)}L`
                      : `₹${(val / 1000).toFixed(0)}k`;
                  }
                  return val >= 1000000
                    ? `$${(val / 1000000).toFixed(1)}M`
                    : val >= 1000
                    ? `$${(val / 1000).toFixed(0)}k`
                    : `$${val}`;
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                iconType="circle"
              />
              <Area
                type="monotone"
                dataKey="Status-Quo Manual"
                stroke="#F43F5E"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorManual)"
              />
              <Area
                type="monotone"
                dataKey="Post-AI Program"
                stroke="#10B981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorAi)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-xs text-text-muted">
        <span className="font-sans">Crossover Point: Initial setup recouped rapidly</span>
        <span className="font-mono text-emerald">
          Net 12M Delta: +
          {projections.length > 0 &&
            (projections[11].cumulative_manual_usd - projections[11].cumulative_ai_program_usd > 0
              ? `${(
                  ((projections[11].cumulative_manual_usd - projections[11].cumulative_ai_program_usd) /
                    projections[11].cumulative_ai_program_usd) *
                  100
                ).toFixed(0)}% return`
              : 'Deficit')}
        </span>
      </div>
    </div>
  );
};
