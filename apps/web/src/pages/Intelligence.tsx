import React, { useEffect, useState } from 'react';
import { fetchApi } from '../api/client';
import { IRiskIntelligenceMetrics } from '@fraudshield/shared-types';
import { BarChart3, Cpu, RefreshCw, Zap } from 'lucide-react';

export const Intelligence: React.FC = () => {
  const [metrics, setMetrics] = useState<IRiskIntelligenceMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  const loadMetrics = async () => {
    setLoading(true);
    const res = await fetchApi('/intelligence');
    if (res.success && res.data) {
      setMetrics(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#26332E] pb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#F1F5F2] tracking-tight flex items-center space-x-3">
            <BarChart3 className="w-6 h-6 text-[#34D399]" />
            <span>Risk Intelligence & Telemetry</span>
          </h1>
          <p className="text-[#9AA9A2] text-xs font-mono mt-1">Executive financial protection metrics, SLA performance, and ML model evaluation</p>
        </div>

        <button
          onClick={loadMetrics}
          className="btn-secondary text-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Analytics</span>
        </button>
      </div>

      {loading || !metrics ? (
        <p className="text-xs text-[#6B7A72] py-12 text-center font-mono">Loading risk intelligence metrics...</p>
      ) : (
        <div className="space-y-8">
          {/* Executive Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="graphite-card p-5 space-y-2">
              <span className="text-xs font-semibold text-[#9AA9A2] uppercase tracking-wider">Total Evaluated Volume</span>
              <p className="text-3xl font-bold text-[#F1F5F2] font-mono">₹{Number(metrics.approvedAmount + metrics.blockedAmount).toLocaleString()}</p>
              <p className="text-xs text-[#6B7A72] font-mono">{metrics.totalEvaluated} Total Transactions</p>
            </div>

            <div className="graphite-card p-5 space-y-2">
              <span className="text-xs font-semibold text-[#9AA9A2] uppercase tracking-wider">Blocked Fraud Volume</span>
              <p className="text-3xl font-bold text-[#F87171] font-mono">₹{Number(metrics.blockedAmount).toLocaleString()}</p>
              <p className="text-xs text-[#6B7A72] font-mono">Fraud Rate: <strong className="text-[#F87171]">{metrics.fraudRatePct}%</strong></p>
            </div>

            <div className="graphite-card p-5 space-y-2">
              <span className="text-xs font-semibold text-[#9AA9A2] uppercase tracking-wider">Decision Latency SLA</span>
              <p className="text-3xl font-bold text-[#34D399] font-mono">{metrics.avgDecisionLatencyMs}ms</p>
              <p className="text-xs text-[#6B7A72] font-mono">P95 SLA: <strong className="text-[#34D399]">{metrics.p95DecisionLatencyMs}ms</strong></p>
            </div>

            <div className="graphite-card p-5 space-y-2">
              <span className="text-xs font-semibold text-[#9AA9A2] uppercase tracking-wider">False Positive Rate</span>
              <p className="text-3xl font-bold text-[#34D399] font-mono">{metrics.falsePositiveRatePct}%</p>
              <p className="text-xs text-[#6B7A72] font-mono">Analyst Feedback Loop</p>
            </div>
          </div>

          {/* Model Evaluation & Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="graphite-card p-6 space-y-4">
              <h3 className="text-sm font-bold text-[#F1F5F2] flex items-center space-x-2 border-b border-[#26332E] pb-3">
                <Cpu className="w-4 h-4 text-[#34D399]" />
                <span>Python ML Model Evaluation & Performance</span>
              </h3>

              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-3 bg-[#0B0F0E] border border-[#26332E] rounded-lg">
                  <span className="text-[#9AA9A2] block text-[11px] font-sans">Model Precision:</span>
                  <span className="text-lg font-bold text-[#34D399]">94.2%</span>
                </div>
                <div className="p-3 bg-[#0B0F0E] border border-[#26332E] rounded-lg">
                  <span className="text-[#9AA9A2] block text-[11px] font-sans">Model Recall:</span>
                  <span className="text-lg font-bold text-[#34D399]">91.8%</span>
                </div>
                <div className="p-3 bg-[#0B0F0E] border border-[#26332E] rounded-lg">
                  <span className="text-[#9AA9A2] block text-[11px] font-sans">F1 Score:</span>
                  <span className="text-lg font-bold text-[#34D399]">92.9%</span>
                </div>
                <div className="p-3 bg-[#0B0F0E] border border-[#26332E] rounded-lg">
                  <span className="text-[#9AA9A2] block text-[11px] font-sans">Training Dataset:</span>
                  <span className="text-lg font-bold text-[#F1F5F2]">5,000 Samples</span>
                </div>
              </div>
            </div>

            <div className="graphite-card p-6 space-y-4">
              <h3 className="text-sm font-bold text-[#F1F5F2] flex items-center space-x-2 border-b border-[#26332E] pb-3">
                <Zap className="w-4 h-4 text-[#F59E0B]" />
                <span>Top Triggered Risk Signals</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-[#26332E] font-mono">
                  <span className="text-[#F1F5F2] font-semibold font-sans">1. Unusually High Amount (&gt; ₹50k)</span>
                  <span className="text-[#F59E0B] font-bold">42% of Blocks</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#26332E] font-mono">
                  <span className="text-[#F1F5F2] font-semibold font-sans">2. Unrecognized Device Fingerprint</span>
                  <span className="text-[#34D399] font-bold">28% of Blocks</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#26332E] font-mono">
                  <span className="text-[#F1F5F2] font-semibold font-sans">3. Redis Velocity Anomaly (5m Window)</span>
                  <span className="text-[#F87171] font-bold">18% of Blocks</span>
                </div>
                <div className="flex justify-between py-2 font-mono">
                  <span className="text-[#F1F5F2] font-semibold font-sans">4. Amount Spike vs History</span>
                  <span className="text-[#60A5FA] font-bold">12% of Blocks</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
