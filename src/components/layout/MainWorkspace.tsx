import React from 'react';
import {
  EstimatorResponse,
  WorkloadSpec,
  ChatMessageItem,
  CurrencyCode,
} from '../../types/estimator';
import { ArchitectChat } from '../chat/ArchitectChat';
import { KpiCards } from '../dashboard/KpiCards';
import { CostComparisonChart } from '../dashboard/CostComparisonChart';
import { BreakEvenChart } from '../dashboard/BreakEvenChart';
import { WhatIfSimulator } from '../dashboard/WhatIfSimulator';
import { ExecutiveReport } from '../reports/ExecutiveReport';

interface MainWorkspaceProps {
  response: EstimatorResponse | null;
  workload: WorkloadSpec;
  defaultWorkload: WorkloadSpec;
  currency: CurrencyCode;
  chatMessages: ChatMessageItem[];
  quickReplies: string[];
  isThinking: boolean;
  onSendMessage: (text: string) => void;
  onSelectQuickReply: (text: string) => void;
  onNewSession: () => void;
  onWorkloadChange: (updated: WorkloadSpec) => void;
  onResetWhatIf: () => void;
  onRerunAnalysis: () => void;
  threadId: string;
}

export const MainWorkspace: React.FC<MainWorkspaceProps> = ({
  response,
  workload,
  defaultWorkload,
  currency,
  chatMessages,
  quickReplies,
  isThinking,
  onSendMessage,
  onSelectQuickReply,
  onNewSession,
  onWorkloadChange,
  onResetWhatIf,
  onRerunAnalysis,
  threadId,
}) => {
  return (
    <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
      {/* 1. Consultative AI Architect Chat */}
      <section>
        <ArchitectChat
          messages={chatMessages}
          quickReplies={quickReplies}
          isThinking={isThinking}
          onSendMessage={onSendMessage}
          onSelectQuickReply={onSelectQuickReply}
          onNewSession={onNewSession}
          threadId={threadId}
        />
      </section>

      {/* 2. Four Prominent KPI Cards */}
      <section>
        <KpiCards
          financials={response?.financials || null}
          currency={currency}
        />
      </section>

      {/* 3. Interactive What-If Scenario Simulator */}
      {response && (
        <section>
          <WhatIfSimulator
            workload={workload}
            defaultWorkload={defaultWorkload}
            onWorkloadChange={onWorkloadChange}
            onReset={onResetWhatIf}
            onRerunAnalysis={onRerunAnalysis}
            isSimulating={isThinking}
          />
        </section>
      )}

      {/* 4. Side-by-Side Recharts Visualizations */}
      {response && (
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <CostComparisonChart
            architectureOptions={response.architecture_options}
            capacityMetrics={response.capacity_metrics}
            currency={currency}
          />

          <BreakEvenChart
            projections={response.monthly_projections}
            currency={currency}
            paybackMonths={response.financials?.payback_months ?? null}
          />
        </section>
      )}

      {/* 5. Four-Tab Executive Decision Report */}
      {response && (
        <section>
          <ExecutiveReport
            response={response}
            currency={currency}
          />
        </section>
      )}
    </main>
  );
};
