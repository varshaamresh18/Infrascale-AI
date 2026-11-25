/**
 * API Service Client
 * Clean, isolated adapter interface.
 * Currently runs against local mock service; easily switched to FastAPI endpoints (/api/*)
 * when backend is active.
 */

import { EstimatorResponse, WorkloadSpec, NodeStatuses } from '../types/estimator';
import { MockEstimatorService } from './mockService';

const IS_MOCK_MODE = true; // Set to false when connecting to FastAPI backend
const BACKEND_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface HealthStatus {
  status: 'ok' | 'cold_start' | 'offline';
  message: string;
  timestamp: string;
}

export const ApiClient = {
  /**
   * Health ping to check / wake up Render backend
   */
  async checkHealth(): Promise<HealthStatus> {
    if (IS_MOCK_MODE) {
      return {
        status: 'ok',
        message: 'Running in Client-Side Demo Mode (Zero Backend Required)',
        timestamp: new Date().toISOString(),
      };
    }

    try {
      const res = await fetch(`${BACKEND_BASE_URL}/api/health`, { method: 'GET' });
      if (!res.ok) throw new Error('Backend responding with error');
      return await res.json();
    } catch {
      return {
        status: 'offline',
        message: 'Backend server currently unreachable. Falling back to local deterministic engine.',
        timestamp: new Date().toISOString(),
      };
    }
  },

  /**
   * Run full architectural & FinOps analysis
   */
  async runAnalysis(
    workload: WorkloadSpec,
    presetId?: string,
    onProgress?: (statuses: NodeStatuses, stageMessage: string) => void
  ): Promise<EstimatorResponse> {
    if (IS_MOCK_MODE) {
      return await MockEstimatorService.analyzeWorkload(workload, presetId, onProgress);
    }

    // Future backend fetch integration
    const res = await fetch(`${BACKEND_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workload, preset_id: presetId }),
    });
    return await res.json();
  },

  /**
   * Real-time recalculation for What-If simulator
   */
  recalculateWhatIf(
    updatedWorkload: WorkloadSpec,
    currentResponse: EstimatorResponse
  ): EstimatorResponse {
    return MockEstimatorService.recalculateWhatIf(updatedWorkload, currentResponse);
  },
};
