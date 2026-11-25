import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Server,
  DollarSign,
  ShieldCheck,
  Calculator,
  FileSpreadsheet,
} from 'lucide-react';
import { EstimatorResponse, CurrencyCode } from '../../types/estimator';
import { ArchitectureTab } from './ArchitectureTab';
import { FinOpsTab } from './FinOpsTab';
import { ComplianceTab } from './ComplianceTab';
import { FinancialTab } from './FinancialTab';

interface ExecutiveReportProps {
  response: EstimatorResponse | null;
  currency: CurrencyCode;
}

type TabKey = 'architecture' | 'finops' | 'compliance' | 'financial';

export const ExecutiveReport: React.FC<ExecutiveReportProps> = ({
  response,
  currency,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('architecture');

  if (!response) {
    return null;
  }

  const tabs: { key: TabKey; label: string; icon: any }[] = [
    { key: 'architecture', label: '1. Architecture & Capacity Plan', icon: Server },
    { key: 'finops', label: '2. FinOps Audit & Provenance', icon: DollarSign },
    { key: 'compliance', label: '3. Compliance & Security Audit', icon: ShieldCheck },
    { key: 'financial', label: '4. Detailed Financial Ledger', icon: Calculator },
  ];

  return (
    <div className="rounded-xl border border-border bg-card-elevated overflow-hidden shadow-card-glow">
      {/* Tab Navigation Header */}
      <div className="flex border-b border-border bg-[#090D16]/80 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-medium transition-all shrink-0 border-b-2 relative ${
                isActive
                  ? 'border-primary text-primary-light bg-card-elevated/70'
                  : 'border-transparent text-text-secondary hover:text-text-primary hover:bg-card-hover/40'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-primary' : 'text-text-muted'}`} />
              <span>{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  transition={{ duration: 0.25 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content Body with Animation */}
      <div className="p-4 sm:p-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'architecture' && (
              <ArchitectureTab
                architectureOptions={response.architecture_options}
                capacityMetrics={response.capacity_metrics}
                recommendedArchitectureMd={response.synthesis?.recommended_architecture_md}
                currency={currency}
              />
            )}

            {activeTab === 'finops' && (
              <FinOpsTab
                pricingProvenance={response.pricing_provenance}
                finopsAuditMd={response.synthesis?.finops_audit_md}
                currency={currency}
              />
            )}

            {activeTab === 'compliance' && (
              <ComplianceTab
                complianceChecklist={response.compliance_checklist}
                securityRiskMd={response.synthesis?.security_risk_md}
              />
            )}

            {activeTab === 'financial' && (
              <FinancialTab
                financials={response.financials}
                currency={currency}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
