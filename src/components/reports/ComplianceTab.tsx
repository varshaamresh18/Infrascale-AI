import React from 'react';
import { ComplianceCheckItem } from '../../types/estimator';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  AlertCircle,
  CheckCircle2,
  FileCheck2,
  Info,
} from 'lucide-react';

interface ComplianceTabProps {
  complianceChecklist: ComplianceCheckItem[] | null;
  securityRiskMd?: string;
}

export const ComplianceTab: React.FC<ComplianceTabProps> = ({
  complianceChecklist,
  securityRiskMd,
}) => {
  const getStatusBadge = (status: ComplianceCheckItem['status']) => {
    switch (status) {
      case 'met':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald/10 text-emerald border border-emerald/30">
            <CheckCircle2 className="w-3 h-3" />
            CONTROL MET
          </span>
        );
      case 'action_required':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber/10 text-amber border border-amber/30">
            <AlertCircle className="w-3 h-3" />
            ACTION REQUIRED
          </span>
        );
      case 'hard_constraint':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-primary/10 text-primary border border-primary/30">
            <Lock className="w-3 h-3" />
            HARD CONSTRAINT
          </span>
        );
    }
  };

  return (
    <div className="space-y-5 text-xs">
      {/* Security & Latency Architecture Review */}
      <div className="rounded-xl border border-primary/30 bg-card-elevated p-4 shadow-cyan-glow">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1 rounded bg-primary/10 text-primary">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-semibold text-text-primary">
            Security, Latency & Architectural Risk Audit
          </h4>
        </div>
        <div className="text-text-secondary leading-relaxed space-y-2 font-sans text-xs whitespace-pre-line">
          {securityRiskMd ||
            'Security audit verifies network isolation, zero data retention policies, and cryptographic session isolation at the database layer.'}
        </div>
      </div>

      {/* Compliance Controls Checklist */}
      <div className="rounded-xl border border-border bg-card-elevated overflow-hidden">
        <div className="p-3.5 border-b border-border bg-[#090D16]/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-emerald" />
            <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wider">
              Architectural Compliance & Control Readiness Matrix
            </h4>
          </div>
          <span className="text-[10px] font-mono text-text-muted">
            {complianceChecklist?.length || 0} Controls Audited
          </span>
        </div>

        <div className="divide-y divide-border/60">
          {complianceChecklist?.map((item) => (
            <div
              key={item.control}
              className="p-3 hover:bg-card-hover/40 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-text-primary text-xs">
                    {item.control}
                  </span>
                </div>
                <p className="text-[11px] text-text-secondary leading-normal">
                  {item.detail}
                </p>
              </div>
              <div className="shrink-0">{getStatusBadge(item.status)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Important Disclaimer Banner */}
      <div className="rounded-lg border border-amber/30 bg-amber/5 p-3 flex items-start gap-2.5 text-[11px] text-amber-light">
        <Info className="w-4 h-4 text-amber shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <span className="font-semibold text-text-primary">Compliance Architecture Notice:</span> This assessment evaluates technical architectural patterns (residency, encryption, retention) and does not replace formal third-party audits required for SOC 2 Type II, HIPAA BAA, or DPDP certification.
        </p>
      </div>
    </div>
  );
};
