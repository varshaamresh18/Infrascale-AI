import React, { useState } from 'react';
import {
  SlidersHorizontal,
  RotateCcw,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Cpu,
  Layers,
  Sparkles,
} from 'lucide-react';
import { WorkloadSpec } from '../../types/estimator';
import { formatNumber } from '../../lib/currency';

interface WhatIfSimulatorProps {
  workload: WorkloadSpec;
  defaultWorkload: WorkloadSpec;
  onWorkloadChange: (updated: WorkloadSpec) => void;
  onReset: () => void;
  onRerunAnalysis: () => void;
  isSimulating?: boolean;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({
  workload,
  defaultWorkload,
  onWorkloadChange,
  onReset,
  onRerunAnalysis,
  isSimulating = false,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleSliderChange = (field: keyof WorkloadSpec, value: number) => {
    onWorkloadChange({
      ...workload,
      [field]: value,
    });
  };

  return (
    <div className="rounded-xl border border-border bg-card-elevated overflow-hidden shadow-card-glow">
      {/* Header Banner */}
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-card-hover/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-text-primary">
                Interactive What-If Scenario Simulator
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                Reactive FinOps
              </span>
            </div>
            <p className="text-xs text-text-muted">
              Adjust volume, context length, concurrency & cache ratios for live recalculated ROI & GPU capacity
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onReset();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-text-secondary hover:text-text-primary rounded-lg border border-border hover:bg-card transition-all"
            title="Reset to scenario defaults"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onRerunAnalysis();
            }}
            disabled={isSimulating}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-background bg-primary hover:bg-primary-hover rounded-lg shadow-cyan-glow transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>Re-run Analysis</span>
          </button>

          <button className="p-1 text-text-muted hover:text-text-primary">
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Sliders Grid */}
      {isOpen && (
        <div className="p-4 pt-0 border-t border-border/60 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-3">
          {/* Slider 1: Monthly Requests */}
          <div className="space-y-1.5 bg-[#090D16]/60 p-3 rounded-lg border border-border/80">
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-secondary font-medium">Monthly Requests</span>
              <span className="font-mono text-primary font-bold">
                {formatNumber(workload.monthly_requests, true)}
              </span>
            </div>
            <input
              type="range"
              min={10000}
              max={1000000}
              step={10000}
              value={workload.monthly_requests}
              onChange={(e) => handleSliderChange('monthly_requests', Number(e.target.value))}
              className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-[10px] font-mono text-text-muted">
              <span>10k</span>
              <span>1,000k</span>
            </div>
          </div>

          {/* Slider 2: Average Input Tokens */}
          <div className="space-y-1.5 bg-[#090D16]/60 p-3 rounded-lg border border-border/80">
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-secondary font-medium">Avg Input Tokens</span>
              <span className="font-mono text-emerald font-bold">
                {formatNumber(workload.avg_input_tokens)}
              </span>
            </div>
            <input
              type="range"
              min={500}
              max={12000}
              step={250}
              value={workload.avg_input_tokens}
              onChange={(e) => handleSliderChange('avg_input_tokens', Number(e.target.value))}
              className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-emerald"
            />
            <div className="flex justify-between text-[10px] font-mono text-text-muted">
              <span>500</span>
              <span>12k</span>
            </div>
          </div>

          {/* Slider 3: Peak Concurrent Users */}
          <div className="space-y-1.5 bg-[#090D16]/60 p-3 rounded-lg border border-border/80">
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-secondary font-medium">Peak Concurrency</span>
              <span className="font-mono text-amber font-bold">
                {workload.peak_concurrent_requests} streams
              </span>
            </div>
            <input
              type="range"
              min={5}
              max={500}
              step={5}
              value={workload.peak_concurrent_requests}
              onChange={(e) => handleSliderChange('peak_concurrent_requests', Number(e.target.value))}
              className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-amber"
            />
            <div className="flex justify-between text-[10px] font-mono text-text-muted">
              <span>5</span>
              <span>500</span>
            </div>
          </div>

          {/* Slider 4: Prompt Cache Hit Rate */}
          <div className="space-y-1.5 bg-[#090D16]/60 p-3 rounded-lg border border-border/80">
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-secondary font-medium">Prompt Cache Hit</span>
              <span className="font-mono text-primary font-bold">
                {((workload.cacheable_prompt_ratio || 0.7) * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={0.9}
              step={0.05}
              value={workload.cacheable_prompt_ratio ?? 0.7}
              onChange={(e) => handleSliderChange('cacheable_prompt_ratio', Number(e.target.value))}
              className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-[10px] font-mono text-text-muted">
              <span>0%</span>
              <span>90%</span>
            </div>
          </div>

          {/* Slider 5: Remaining Human QA Review */}
          <div className="space-y-1.5 bg-[#090D16]/60 p-3 rounded-lg border border-border/80">
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-secondary font-medium">Remaining Human QA</span>
              <span className="font-mono text-rose font-bold">
                {((workload.remaining_human_ops_ratio || 0.2) * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={0.5}
              step={0.05}
              value={workload.remaining_human_ops_ratio ?? 0.2}
              onChange={(e) => handleSliderChange('remaining_human_ops_ratio', Number(e.target.value))}
              className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-rose"
            />
            <div className="flex justify-between text-[10px] font-mono text-text-muted">
              <span>0% (Full Auto)</span>
              <span>50%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
