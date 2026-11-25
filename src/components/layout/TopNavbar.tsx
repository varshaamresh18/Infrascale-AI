import React from 'react';
import { Cpu, Download, Sparkles, Menu } from 'lucide-react';
import { CurrencyCode, EstimatorResponse } from '../../types/estimator';
import { generateMarkdownReport, downloadReportFile } from '../../lib/exportReport';

interface TopNavbarProps {
  currency: CurrencyCode;
  onCurrencyToggle: (currency: CurrencyCode) => void;
  currentResponse: EstimatorResponse | null;
  onToggleMobileSidebar: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  currency,
  onCurrencyToggle,
  currentResponse,
  onToggleMobileSidebar,
}) => {
  const handleExport = () => {
    if (!currentResponse) return;
    const reportMd = generateMarkdownReport(currentResponse, currency);
    const filename = `InfraScale_Architecture_Brief_${currentResponse.workload_spec.use_case_name?.replace(/\s+/g, '_') || 'Report'}.md`;
    downloadReportFile(filename, reportMd);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-[#090D16]/90 backdrop-blur-md px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Brand & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileSidebar}
            className="p-1.5 rounded-lg border border-border/80 text-text-secondary hover:text-text-primary hover:bg-card-elevated lg:hidden transition-colors"
            title="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/40 shadow-cyan-glow">
              <Cpu className="w-5 h-5 text-primary" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald shadow-emerald-glow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-text-primary text-base sm:text-lg">
                  InfraScale<span className="text-primary font-mono ml-0.5">AI</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-semibold rounded bg-primary/10 text-primary border border-primary/20">
                  v2.0
                </span>
              </div>
              <p className="text-xs text-text-secondary hidden md:block">
                Stateful Multi-Agent FinOps & Cloud Architecture Advisor
              </p>
            </div>
          </div>
        </div>

        {/* Right: Controls & Badges */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mode Indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-card-elevated border border-border text-[11px] font-mono text-text-secondary">
            <span className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse" />
            <span className="font-semibold text-amber-light">DEMO MODE</span>
            <span className="hidden xl:inline text-text-muted text-[10px]">• Local Deterministic Engines</span>
          </div>

          {/* Currency Toggle */}
          <div className="flex items-center bg-card-elevated p-0.5 rounded-lg border border-border">
            <button
              onClick={() => onCurrencyToggle('USD')}
              className={`px-2.5 py-1 text-xs font-mono font-medium rounded-md transition-all ${
                currency === 'USD'
                  ? 'bg-primary text-background font-semibold shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
              title="Currency: US Dollar"
            >
              $ USD
            </button>
            <button
              onClick={() => onCurrencyToggle('INR')}
              className={`px-2.5 py-1 text-xs font-mono font-medium rounded-md transition-all ${
                currency === 'INR'
                  ? 'bg-primary text-background font-semibold shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
              title="Currency: Indian Rupee (1 USD = ₹84)"
            >
              ₹ INR
            </button>
          </div>

          {/* Export Report Button */}
          <button
            onClick={handleExport}
            disabled={!currentResponse}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium font-sans transition-all border ${
              currentResponse
                ? 'bg-card-elevated hover:bg-card-hover border-primary/30 text-primary-light hover:border-primary shadow-sm active:scale-95'
                : 'bg-card opacity-50 cursor-not-allowed border-border text-text-muted'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export Architecture Brief</span>
            <span className="sm:hidden">Export</span>
          </button>
        </div>
      </div>
    </header>
  );
};
