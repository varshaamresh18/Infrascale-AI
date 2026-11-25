import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Clock, AlertCircle, ArrowDown } from 'lucide-react';
import { NodeStatus, NodeStatuses } from '../../types/estimator';

interface LangGraphStepperProps {
  statuses: NodeStatuses;
  currentStageMessage?: string;
}

interface StepMeta {
  key: keyof NodeStatuses;
  title: string;
  subtitle: string;
  tech: string;
}

const STEPS: StepMeta[] = [
  {
    key: 'intake_extractor',
    title: '1. Intake & Extractor',
    subtitle: 'Extracts WorkloadSpec parameters',
    tech: 'Gemini + Pydantic v2',
  },
  {
    key: 'hitl_clarifier',
    title: '2. HITL Clarifier Check',
    subtitle: 'Audits volume, concurrency, SLA',
    tech: 'StateGraph interrupt()',
  },
  {
    key: 'deterministic_tools',
    title: '3. Deterministic Engines',
    subtitle: 'Zero-hallucination math & GPU sizing',
    tech: 'Pure Python Engines',
  },
  {
    key: 'parallel_critics',
    title: '4. Parallel Critics',
    subtitle: 'FinOps vs. Security & SLA audit',
    tech: 'Parallel Fan-Out Execution',
  },
  {
    key: 'executive_synthesizer',
    title: '5. Executive Synthesizer',
    subtitle: 'Consolidated ADR & Blueprint',
    tech: 'Fan-In Merge Node',
  },
];

export const LangGraphStepper: React.FC<LangGraphStepperProps> = ({
  statuses,
  currentStageMessage,
}) => {
  const getStatusIcon = (status: NodeStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-emerald" />;
      case 'running':
        return (
          <div className="relative flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping absolute" />
            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
          </div>
        );
      case 'awaiting_input':
        return <AlertCircle className="w-4 h-4 text-amber animate-bounce" />;
      default:
        return <Circle className="w-3.5 h-3.5 text-text-muted" />;
    }
  };

  const getStatusBadge = (status: NodeStatus) => {
    switch (status) {
      case 'completed':
        return (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald/10 text-emerald border border-emerald/20">
            DONE
          </span>
        );
      case 'running':
        return (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-primary/10 text-primary border border-primary/30 animate-pulse">
            RUNNING
          </span>
        );
      case 'awaiting_input':
        return (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber/10 text-amber border border-amber/30">
            AWAITING INPUT
          </span>
        );
      default:
        return (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono text-text-muted bg-card border border-border">
            QUEUED
          </span>
        );
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card-elevated p-4">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-border/80">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <h3 className="text-xs font-semibold tracking-wider uppercase text-text-secondary">
            LangGraph Execution Pipeline
          </h3>
        </div>
        <span className="text-[10px] font-mono text-text-muted">5-Node StateGraph</span>
      </div>

      {currentStageMessage && (
        <div className="mb-3 px-2.5 py-1.5 rounded-lg bg-[#090D16]/60 border border-primary/20 text-[11px] font-mono text-primary-light flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
          <span className="truncate">{currentStageMessage}</span>
        </div>
      )}

      <div className="space-y-3 relative">
        {STEPS.map((step, idx) => {
          const status = statuses[step.key] || 'pending';
          const isLast = idx === STEPS.length - 1;

          return (
            <div key={step.key} className="relative flex items-start gap-3 group">
              {/* Vertical connector line */}
              {!isLast && (
                <div
                  className={`absolute left-3.5 top-6 bottom-0 w-0.5 -ml-[1px] transition-colors duration-300 ${
                    status === 'completed' ? 'bg-emerald/40' : 'bg-border'
                  }`}
                  style={{ height: 'calc(100% + 2px)' }}
                />
              )}

              {/* Node Icon Circle */}
              <div
                className={`relative z-10 flex items-center justify-center w-7 h-7 rounded-full border transition-all duration-300 shrink-0 ${
                  status === 'completed'
                    ? 'bg-emerald/10 border-emerald/50'
                    : status === 'running'
                    ? 'bg-primary/20 border-primary shadow-cyan-glow'
                    : status === 'awaiting_input'
                    ? 'bg-amber/20 border-amber'
                    : 'bg-card border-border'
                }`}
              >
                {getStatusIcon(status)}
              </div>

              {/* Step info */}
              <div className="flex-1 min-w-0 pb-1">
                <div className="flex items-center justify-between gap-1">
                  <span
                    className={`text-xs font-medium truncate ${
                      status === 'running'
                        ? 'text-primary-light font-semibold'
                        : status === 'completed'
                        ? 'text-text-primary'
                        : 'text-text-secondary'
                    }`}
                  >
                    {step.title}
                  </span>
                  {getStatusBadge(status)}
                </div>
                <p className="text-[11px] text-text-muted leading-tight mt-0.5">
                  {step.subtitle}
                </p>
                <span className="text-[10px] font-mono text-primary/70">
                  {step.tech}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
