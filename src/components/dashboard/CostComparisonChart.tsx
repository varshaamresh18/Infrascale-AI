import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  ArchitectureOption,
  CapacityMetrics,
  CurrencyCode,
} from '../../types/estimator';
import { formatCurrency, USD_TO_INR_RATE } from '../../lib/currency';
import { Server, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

interface CostComparisonChartProps {
  architectureOptions: ArchitectureOption[] | null;
  capacityMetrics: CapacityMetrics | null;
  currency: CurrencyCode;
}

export const CostComparisonChart: React.FC<CostComparisonChartProps> = ({
  architectureOptions,
  capacityMetrics,
  currency,
}) => {
  if (!architectureOptions || architectureOptions.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card-elevated p-5 flex items-center justify-center h-80 text-text-muted text-xs">
        Run an analysis to generate 3-tier TCO breakdown.
      </div>
    );
  }

  const multiplier = currency === 'INR' ? USD_TO_INR_RATE : 1;

  const data = architectureOptions.map((opt) => ({
    name: opt.name.length > 20 ? opt.name.slice(0, 18) + '...' : opt.name,
    fullName: opt.name,
    'Compute / Token': Math.round(opt.compute_token_cost_usd * multiplier),
    'Storage & Vector': Math.round(opt.storage_vector_cost_usd * multiplier),
    'Ops & Maintenance': Math.round(opt.ops_overhead_usd * multiplier),
    total: Math.round(opt.total_monthly_usd * multiplier),
    recommended: opt.recommended,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum: number, entry: any) => sum + (entry.value || 0), 0);
      return (
        <div className="rounded-lg border border-border bg-[#090D16] p-3 text-xs shadow-card-glow font-mono">
          <p className="font-sans font-semibold text-text-primary mb-1.5">{label}</p>
          {payload.map((entry: any) => (
            <div key={entry.name} className="flex items-center justify-between gap-4 py-0.5">
              <span className="flex items-center gap-1.5 text-text-secondary">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                {entry.name}:
              </span>
              <span className="text-text-primary font-medium">
                {currency === 'INR' ? `₹${entry.value.toLocaleString('en-IN')}` : `$${entry.value.toLocaleString('en-US')}`}
              </span>
            </div>
          ))}
          <div className="mt-1.5 pt-1.5 border-t border-border flex items-center justify-between font-bold">
            <span className="text-text-secondary font-sans">Total Monthly:</span>
            <span className="text-primary-light">
              {currency === 'INR' ? `₹${total.toLocaleString('en-IN')}` : `$${total.toLocaleString('en-US')}`}
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
              3-Tier Monthly TCO Architecture Comparison
            </h3>
            <p className="text-xs text-text-muted">
              Compute, vector storage, and SRE operations breakdown
            </p>
          </div>
          <span className="text-[10px] font-mono text-primary px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
            Per Month Spend
          </span>
        </div>

        <div className="h-64 w-full mt-3">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: -10, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis
                dataKey="name"
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
                    return val >= 100000 ? `₹${(val / 100000).toFixed(0)}L` : `₹${(val / 1000).toFixed(0)}k`;
                  }
                  return val >= 1000 ? `$${(val / 1000).toFixed(0)}k` : `$${val}`;
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                iconType="circle"
              />
              <Bar dataKey="Compute / Token" stackId="a" fill="#06B6D4" radius={[0, 0, 0, 0]} />
              <Bar dataKey="Storage & Vector" stackId="a" fill="#10B981" radius={[0, 0, 0, 0]} />
              <Bar dataKey="Ops & Maintenance" stackId="a" fill="#F59E0B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* GPU Capacity & SLA Feasibility Badges */}
      {capacityMetrics && (
        <div className="mt-3 pt-3 border-t border-border flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#090D16] border border-border">
            <Server className="w-3.5 h-3.5 text-primary" />
            <span className="text-text-muted">GPU:</span>
            <span className="text-text-primary font-medium">{capacityMetrics.gpu_model}</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#090D16] border border-border">
            <span className="text-text-muted">Replicas:</span>
            <span className="text-primary font-bold">{capacityMetrics.required_replicas}x</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#090D16] border border-border">
            <span className="text-text-muted">Peak TPS:</span>
            <span className="text-emerald font-medium">{capacityMetrics.required_tps}</span>
          </div>

          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded border ${
            capacityMetrics.sla_feasible
              ? 'bg-emerald/10 border-emerald/30 text-emerald'
              : 'bg-rose/10 border-rose/30 text-rose'
          }`}>
            {capacityMetrics.sla_feasible ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5" />
            )}
            <span className="font-semibold">
              {capacityMetrics.sla_feasible ? 'SLA Feasible' : 'SLA At Risk'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
