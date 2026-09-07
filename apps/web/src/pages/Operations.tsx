import React, { useEffect, useState } from 'react';
import { fetchApi } from '../api/client';
import { ISystemHealth } from '@fraudshield/shared-types';
import { Activity, Server, Database, Cpu, RefreshCw, CheckCircle2 } from 'lucide-react';

export const Operations: React.FC = () => {
  const [health, setHealth] = useState<ISystemHealth | null>(null);
  const [loading, setLoading] = useState(true);

  const loadHealth = async () => {
    setLoading(true);
    const res = await fetchApi('/operations');
    if (res.success && res.data) {
      setHealth(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadHealth();
  }, []);

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#26332E] pb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#F1F5F2] tracking-tight flex items-center space-x-3">
            <Activity className="w-6 h-6 text-[#34D399]" />
            <span>Operations & System Health</span>
          </h1>
          <p className="text-[#9AA9A2] text-xs font-mono mt-1">
            Real-time infrastructure health monitoring, BullMQ queue depth, and operational telemetry
          </p>
        </div>

        <button
          onClick={loadHealth}
          className="btn-secondary text-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Health</span>
        </button>
      </div>

      {loading || !health ? (
        <p className="text-xs text-[#6B7A72] py-12 text-center font-mono">Checking infrastructure service health...</p>
      ) : (
        <div className="space-y-8">
          {/* Services Status Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="graphite-card p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#9AA9A2] uppercase tracking-wider">Node.js API Service</span>
                <Server className="w-4 h-4 text-[#34D399]" />
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#34D399]" />
                <span className="text-lg font-bold text-[#F1F5F2] font-mono">{health.apiStatus}</span>
              </div>
              <p className="text-xs text-[#6B7A72] font-mono">Uptime: {Math.floor(health.uptimeSeconds / 60)} mins</p>
            </div>

            <div className="graphite-card p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#9AA9A2] uppercase tracking-wider">PostgreSQL Ledger</span>
                <Database className="w-4 h-4 text-[#34D399]" />
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#34D399]" />
                <span className="text-lg font-bold text-[#F1F5F2] font-mono">{health.postgresStatus}</span>
              </div>
              <p className="text-xs text-[#6B7A72] font-mono">Pool Connections: Active</p>
            </div>

            <div className="graphite-card p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#9AA9A2] uppercase tracking-wider">Redis Cache & Limits</span>
                <Activity className="w-4 h-4 text-[#F59E0B]" />
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#34D399]" />
                <span className="text-lg font-bold text-[#F1F5F2] font-mono">{health.redisStatus}</span>
              </div>
              <p className="text-xs text-[#6B7A72] font-mono">Sliding Windows Active</p>
            </div>

            <div className="graphite-card p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#9AA9A2] uppercase tracking-wider">Python ML Service</span>
                <Cpu className="w-4 h-4 text-[#60A5FA]" />
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#34D399]" />
                <span className="text-lg font-bold text-[#F1F5F2] font-mono">{health.mlStatus}</span>
              </div>
              <p className="text-xs text-[#6B7A72] font-mono">Model: v1.0.0-rf Loaded</p>
            </div>
          </div>

          {/* Operational Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono">
            <div className="graphite-card p-6 space-y-2">
              <span className="text-xs font-semibold text-[#9AA9A2] uppercase tracking-wider block font-sans">BullMQ Queue Depth</span>
              <p className="text-3xl font-bold text-[#34D399]">{health.queueDepth} Pending Jobs</p>
              <p className="text-xs text-[#6B7A72] font-sans">{health.activeWorkers} Active Worker Threads</p>
            </div>

            <div className="graphite-card p-6 space-y-2">
              <span className="text-xs font-semibold text-[#9AA9A2] uppercase tracking-wider block font-sans">Decision Latency SLA</span>
              <p className="text-3xl font-bold text-[#34D399]">{health.avgDecisionLatencyMs}ms</p>
              <p className="text-xs text-[#6B7A72] font-sans">Measured Sub-millisecond Execution</p>
            </div>

            <div className="graphite-card p-6 space-y-2">
              <span className="text-xs font-semibold text-[#9AA9A2] uppercase tracking-wider block font-sans">System Error Rate</span>
              <p className="text-3xl font-bold text-[#34D399]">{health.errorRatePct}%</p>
              <p className="text-xs text-[#6B7A72] font-sans">Global Error Rate (&lt; 0.05% Threshold)</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
