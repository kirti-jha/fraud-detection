import React, { useState } from 'react';
import { fetchApi } from '../api/client';
import { IBenchmarkReport } from '@fraudshield/shared-types';
import { Cpu, Zap, Activity, Clock, Play, Download } from 'lucide-react';

export const BenchmarkLab: React.FC = () => {
  const [requestsCount, setRequestsCount] = useState<number>(100);
  const [concurrency, setConcurrency] = useState<number>(10);
  const [running, setRunning] = useState(false);
  const [report, setReport] = useState<IBenchmarkReport | null>(null);

  const runBenchmark = async () => {
    setRunning(true);
    setReport(null);

    const res = await fetchApi('/benchmark/run', {
      method: 'POST',
      body: JSON.stringify({ totalRequests: requestsCount, concurrency }),
    });

    setRunning(false);
    if (res.success && res.data) {
      setReport(res.data);
    }
  };

  const exportReport = () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FraudShield_Benchmark_${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center space-x-3">
            <Cpu className="w-6 h-6 text-emerald-600" />
            <span>Benchmark & Concurrency Stress Lab</span>
          </h1>
          <p className="text-slate-500 text-xs font-mono mt-1">Live concurrency stress testing, measured throughput (req/s), and P95/P99 latency SLA analysis</p>
        </div>

        {report && (
          <button
            onClick={exportReport}
            className="btn-secondary text-xs"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Export Report</span>
          </button>
        )}
      </div>

      {/* Controls Card */}
      <div className="graphite-card p-6 space-y-5">
        <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-2 border-b border-slate-200 pb-3">
          <Zap className="w-4 h-4 text-amber-600" />
          <span>Configure Load Generator Parameters</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 font-mono">
              Total Transactions Payload: <strong className="text-emerald-600">{requestsCount}</strong>
            </label>
            <input
              type="range"
              min={20}
              max={300}
              step={20}
              value={requestsCount}
              onChange={(e) => setRequestsCount(parseInt(e.target.value, 10))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 font-mono">
              Concurrency Batch Size: <strong className="text-emerald-600">{concurrency} Threads</strong>
            </label>
            <input
              type="range"
              min={2}
              max={20}
              step={2}
              value={concurrency}
              onChange={(e) => setConcurrency(parseInt(e.target.value, 10))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={runBenchmark}
              disabled={running}
              className="btn-primary w-full py-3 text-xs font-bold"
            >
              <Play className={`w-4 h-4 ${running ? 'animate-spin' : ''}`} />
              <span>{running ? 'Executing Stress Load Test...' : 'Run Benchmark Test'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Benchmark Report Results */}
      {report && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="graphite-card p-5 space-y-2 font-mono">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-sans">Measured Throughput</span>
              <p className="text-3xl font-bold text-emerald-600">{report.reqPerSec} req/s</p>
              <p className="text-xs text-slate-500 font-sans">{report.totalRequests} Requests Executed</p>
            </div>

            <div className="graphite-card p-5 space-y-2 font-mono">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-sans">Average Latency SLA</span>
              <p className="text-3xl font-bold text-slate-800">{report.avgLatencyMs}ms</p>
              <p className="text-xs text-slate-500 font-sans">Mean Execution Time</p>
            </div>

            <div className="graphite-card p-5 space-y-2 font-mono">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-sans">P95 Latency SLA</span>
              <p className="text-3xl font-bold text-emerald-600">{report.p95LatencyMs}ms</p>
              <p className="text-xs text-slate-500 font-sans">95th Percentile SLA</p>
            </div>

            <div className="graphite-card p-5 space-y-2 font-mono">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-sans">P99 Latency SLA</span>
              <p className="text-3xl font-bold text-amber-600">{report.p99LatencyMs}ms</p>
              <p className="text-xs text-slate-500 font-sans">99th Percentile SLA</p>
            </div>
          </div>

          {/* Detailed Breakdown Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="graphite-card p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-2 border-b border-slate-200 pb-3">
                <Activity className="w-4 h-4 text-emerald-600" />
                <span>Decision Outcome Distribution</span>
              </h3>

              <div className="grid grid-cols-3 gap-4 text-center font-mono">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <span className="text-xs text-emerald-600 font-semibold block font-sans">APPROVED</span>
                  <span className="text-2xl font-bold text-slate-800 mt-1 block">{report.approveCount}</span>
                </div>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <span className="text-xs text-amber-600 font-semibold block font-sans">REVIEW</span>
                  <span className="text-2xl font-bold text-slate-800 mt-1 block">{report.reviewCount}</span>
                </div>
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <span className="text-xs text-red-500 font-semibold block font-sans">BLOCKED</span>
                  <span className="text-2xl font-bold text-slate-800 mt-1 block">{report.blockCount}</span>
                </div>
              </div>
            </div>

            <div className="graphite-card p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-2 border-b border-slate-200 pb-3">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>Pipeline Stage Latency Breakdown</span>
              </h3>

              <div className="space-y-3 text-xs font-mono">
                <div className="flex flex-col sm:flex-row sm:justify-between py-1.5 border-b border-slate-200 gap-1">
                  <span className="text-slate-500 font-sans">1. Deterministic Risk Rules:</span>
                  <span className="text-emerald-600 font-bold">{report.latencyBreakdown.rulesMs}ms</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between py-1.5 border-b border-slate-200 gap-1">
                  <span className="text-slate-500 font-sans">2. Redis Sliding Window Velocity:</span>
                  <span className="text-emerald-600 font-bold">{report.latencyBreakdown.redisMs}ms</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between py-1.5 border-b border-slate-200 gap-1">
                  <span className="text-slate-500 font-sans">3. Python ML Model Inference:</span>
                  <span className="text-blue-500 font-bold">{report.latencyBreakdown.mlMs}ms</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between py-1.5 gap-1">
                  <span className="text-slate-500 font-sans">4. PostgreSQL &amp; Payment Rails:</span>
                  <span className="text-emerald-600 font-bold">{report.latencyBreakdown.dbMs}ms</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


