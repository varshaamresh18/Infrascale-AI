import React, { useState, useEffect, useCallback } from 'react';
import {
  CurrencyCode,
  EnterprisePreset,
  EstimatorResponse,
  WorkloadSpec,
  ChatMessageItem,
  NodeStatuses,
} from './types/estimator';
import { ENTERPRISE_PRESETS } from './lib/mockData';
import { ApiClient } from './lib/api';
import { MockEstimatorService } from './lib/mockService';
import { TopNavbar } from './components/layout/TopNavbar';
import { Sidebar } from './components/layout/Sidebar';
import { MainWorkspace } from './components/layout/MainWorkspace';

export const App: React.FC = () => {
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('customer_support_rag');
  const [activeWorkload, setActiveWorkload] = useState<WorkloadSpec>(ENTERPRISE_PRESETS[0].workload);
  const [defaultWorkload, setDefaultWorkload] = useState<WorkloadSpec>(ENTERPRISE_PRESETS[0].workload);
  
  const [currentResponse, setCurrentResponse] = useState<EstimatorResponse | null>(null);
  const [threadId, setThreadId] = useState<string>(() => crypto.randomUUID());
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [currentStageMessage, setCurrentStageMessage] = useState<string>('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  const [nodeStatuses, setNodeStatuses] = useState<NodeStatuses>({
    intake_extractor: 'completed',
    hitl_clarifier: 'completed',
    deterministic_tools: 'completed',
    parallel_critics: 'completed',
    executive_synthesizer: 'completed',
  });

  const [chatMessages, setChatMessages] = useState<ChatMessageItem[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      content: `Welcome to InfraScale AI. I have initialized the **${ENTERPRISE_PRESETS[0].title}** scenario (100k requests/mo, strict data residency). Review the calculated FinOps breakdown below or adjust parameters in the simulator.`,
      timestamp: 'Just now',
    },
  ]);

  const [quickReplies, setQuickReplies] = useState<string[]>([
    'Explore What-If Scenarios',
    'Simulate Higher Concurrency (100 streams)',
    'Switch to Legal & Invoice Extraction',
  ]);

  // Execute full workflow analysis
  const executeAnalysis = useCallback(
    async (workloadToAnalyze: WorkloadSpec, presetId?: string) => {
      setIsThinking(true);
      try {
        const response = await ApiClient.runAnalysis(
          workloadToAnalyze,
          presetId,
          (statuses, stageMsg) => {
            setNodeStatuses(statuses);
            setCurrentStageMessage(stageMsg);
          }
        );
        setCurrentResponse(response);
        setNodeStatuses(response.node_statuses);
        setCurrentStageMessage('');
      } catch (err) {
        console.error('Analysis failed:', err);
      } finally {
        setIsThinking(false);
      }
    },
    []
  );

  // Initial load: populate with Preset 1
  useEffect(() => {
    executeAnalysis(ENTERPRISE_PRESETS[0].workload, ENTERPRISE_PRESETS[0].id);
  }, [executeAnalysis]);

  // Handle Preset Switching
  const handleSelectPreset = (preset: EnterprisePreset) => {
    setSelectedPresetId(preset.id);
    setActiveWorkload(preset.workload);
    setDefaultWorkload(preset.workload);
    setMobileSidebarOpen(false);

    setChatMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        sender: 'assistant',
        content: `Loaded **${preset.title}** preset (${preset.tagline}). Running 5-node LangGraph capacity & FinOps pipeline...`,
        timestamp: 'Now',
      },
    ]);

    setQuickReplies([
      'Explore What-If Scenarios',
      'Download Architecture Brief (.md)',
      'Inspect Compliance Readiness',
    ]);

    executeAnalysis(preset.workload, preset.id);
  };

  // Handle Chat message submission
  const handleSendMessage = (text: string) => {
    const userMsg: ChatMessageItem = {
      id: crypto.randomUUID(),
      sender: 'user',
      content: text,
      timestamp: 'Now',
    };
    setChatMessages((prev) => [...prev, userMsg]);

    setIsThinking(true);

    setTimeout(() => {
      const chatResult = MockEstimatorService.handleChatMessage(text, activeWorkload);

      setChatMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          sender: 'assistant',
          content: chatResult.assistantMessage,
          timestamp: 'Now',
        },
      ]);

      setQuickReplies(chatResult.quickReplies);
      setNodeStatuses(chatResult.nodeStatuses);
      setIsThinking(false);

      if (chatResult.status === 'completed' || Object.keys(chatResult.updatedWorkload).length > 2) {
        const merged = { ...activeWorkload, ...chatResult.updatedWorkload } as WorkloadSpec;
        setActiveWorkload(merged);
        executeAnalysis(merged);
      }
    }, 700);
  };

  // Handle Quick Reply selection
  const handleSelectQuickReply = (reply: string) => {
    if (reply.includes('Legal & Invoice')) {
      handleSelectPreset(ENTERPRISE_PRESETS[1]);
      return;
    }
    if (reply.includes('Higher Concurrency')) {
      handleWorkloadChange({
        ...activeWorkload,
        peak_concurrent_requests: 100,
        latency_sla_ms: 1000,
      });
      return;
    }
    handleSendMessage(reply);
  };

  // Handle What-If Sliders Change (real-time recalculation)
  const handleWorkloadChange = (updated: WorkloadSpec) => {
    setActiveWorkload(updated);
    if (currentResponse) {
      const recalculated = ApiClient.recalculateWhatIf(updated, currentResponse);
      setCurrentResponse(recalculated);
    }
  };

  // Reset What-If
  const handleResetWhatIf = () => {
    setActiveWorkload(defaultWorkload);
    if (currentResponse) {
      const recalculated = ApiClient.recalculateWhatIf(defaultWorkload, currentResponse);
      setCurrentResponse(recalculated);
    }
  };

  // Reset Session
  const handleNewSession = () => {
    const newId = crypto.randomUUID();
    setThreadId(newId);
    setChatMessages([
      {
        id: crypto.randomUUID(),
        sender: 'assistant',
        content:
          'Initialized new FinOps architecture session. Describe a workload or select one of the enterprise presets from the left sidebar.',
        timestamp: 'Just now',
      },
    ]);
    setQuickReplies([
      'Customer Support RAG (100k req/mo)',
      'Legal & Invoice Batch (50k docs/mo)',
      'Internal Engineering Copilot (2,500 devs)',
    ]);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* 1. Top Navigation Bar */}
      <TopNavbar
        currency={currency}
        onCurrencyToggle={setCurrency}
        currentResponse={currentResponse}
        onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
      />

      {/* 2. Responsive Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Mobile Slide-over Sidebar Drawer */}
        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm lg:hidden flex"
            onClick={() => setMobileSidebarOpen(false)}
          >
            <div
              className="w-[320px] max-w-[85vw] bg-[#090D16] h-full overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <Sidebar
                selectedPresetId={selectedPresetId}
                onSelectPreset={handleSelectPreset}
                activeWorkload={activeWorkload}
                nodeStatuses={nodeStatuses}
                currentStageMessage={currentStageMessage}
                currency={currency}
              />
            </div>
          </div>
        )}

        {/* Desktop Left Sidebar */}
        <div className="hidden lg:block shrink-0 h-[calc(100vh-61px)]">
          <Sidebar
            selectedPresetId={selectedPresetId}
            onSelectPreset={handleSelectPreset}
            activeWorkload={activeWorkload}
            nodeStatuses={nodeStatuses}
            currentStageMessage={currentStageMessage}
            currency={currency}
          />
        </div>

        {/* Main Workspace (Scrollable) */}
        <div className="flex-1 h-[calc(100vh-61px)] overflow-y-auto">
          <MainWorkspace
            response={currentResponse}
            workload={activeWorkload}
            defaultWorkload={defaultWorkload}
            currency={currency}
            chatMessages={chatMessages}
            quickReplies={quickReplies}
            isThinking={isThinking}
            onSendMessage={handleSendMessage}
            onSelectQuickReply={handleSelectQuickReply}
            onNewSession={handleNewSession}
            onWorkloadChange={handleWorkloadChange}
            onResetWhatIf={handleResetWhatIf}
            onRerunAnalysis={() => executeAnalysis(activeWorkload, selectedPresetId)}
            threadId={threadId}
          />
        </div>
      </div>
    </div>
  );
};
