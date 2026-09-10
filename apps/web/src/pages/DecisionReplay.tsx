import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchApi } from '../api/client';
import { RiskBadge } from '../components/RiskBadge';
import { IDecisionReplay, ITransaction } from '@fraudshield/shared-types';
import { RotateCcw, Clock, Code } from 'lucide-react';

export const DecisionReplay: React.FC = () => {
  const { transactionId } = useParams<{ transactionId: string }>();
  const [replay, setReplay] = useState<IDecisionReplay | null>(null);
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [selectedTxnId, setSelectedTxnId] = useState<string>(transactionId || '');
  const [loading, setLoading] = useState(true);

  const loadLedgerList = async () => {
    const res = await fetchApi('/transactions?limit=15');
    if (res.success && res.data) {
      setTransactions(res.data);
      if (!transactionId && res.data.length > 0) {
        setSelectedTxnId(res.data[0].id);
      }
    }
  };

  const loadReplayData = async (targetId: string) => {
    if (!targetId) return;
    setLoading(true);
    const res = await fetchApi(`/replay/${targetId}`);
    if (res.success && res.data) {
      setReplay(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadLedgerList();
  }, []);

  useEffect(() => {
    if (selectedTxnId) {
      loadReplayData(selectedTxnId);
    }
  }, [selectedTxnId]);

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center space-x-3">
            <RotateCcw className="w-6 h-6 text-emerald-600" />
            <span>Decision Replay Engine</span>
          </h1>
          <p className="text-slate-500 text-xs font-mono mt-1">Reconstruct and replay exact sub-millisecond risk decision execution traces</p>
        </div>

        {/* Transaction Selector */}
        {transactions.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 font-mono">
            <span className="text-xs text-slate-500">Select Txn:</span>
            <select
              value={selectedTxnId}
              onChange={(e) => setSelectedTxnId(e.target.value)}
              className="bg-white border border-slate-200 text-emerald-600 text-xs rounded-lg px-3 py-2 focus:outline-none w-full sm:w-auto"
            >
              {transactions.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.transactionRef} (₹{Number(t.amount).toLocaleString()} - {t.decision})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {loading ? (
        <p className="text-xs text-slate-500 py-12 text-center font-mono">Reconstructing decision execution trace...</p>
      ) : !replay ? (
        <p className="text-xs text-slate-500 py-12 text-center font-mono">No decision replay data available</p>
      ) : (
        <div className="space-y-6">
          {/* Summary Banner */}
          <div className="graphite-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-3">
                <h2 className="text-2xl font-bold text-slate-800 font-mono">{replay.transactionRef}</h2>
                <RiskBadge score={replay.overallScore} />
                <RiskBadge decision={replay.decision} />
              </div>
              <p className="text-xs text-slate-500 mt-1 font-mono">
                Evaluated: {new Date(replay.evaluatedAt).toLocaleString()}
              </p>
            </div>

            <div className="flex items-center space-x-6 text-xs font-mono">
              <div>
                <span className="text-slate-500 block font-sans text-[11px]">Total Decision SLA:</span>
                <span className="text-xl font-bold text-emerald-600">{replay.latencyBreakdown.totalMs}ms</span>
              </div>
              <div>
                <span className="text-slate-500 block font-sans text-[11px]">Signals Triggered:</span>
                <span className="text-xl font-bold text-amber-600">{replay.signals.length}</span>
              </div>
            </div>
          </div>

          {/* Replay Steps Timeline */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800">Execution Timeline & Payload Breakdown</h3>

            <div className="space-y-4">
              {replay.steps.map((step: any) => (
                <div key={step.stepNumber} className="graphite-card p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div className="flex items-center space-x-3">
                      <span className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-600 font-mono font-bold text-xs flex items-center justify-center">
                        0{step.stepNumber}
                      </span>
                      <h4 className="text-sm font-bold text-slate-800">{step.stepName}</h4>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        step.status === 'TRIGGERED' ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-300'
                      }`}>
                        {step.status}
                      </span>
                    </div>

                    <span className="text-xs font-mono font-semibold text-slate-500 flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{step.latencyMs}ms</span>
                    </span>
                  </div>

                  <p className="text-xs text-slate-800 font-medium">{step.summary}</p>

                  {/* Payloads Inspector */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs space-y-1">
                      <span className="text-[10px] font-mono uppercase text-slate-500 flex items-center space-x-1">
                        <Code className="w-3 h-3 text-emerald-600" />
                        <span>Step Input Payload</span>
                      </span>
                      <pre className="text-[11px] text-emerald-600 font-mono overflow-x-auto">
                        {JSON.stringify(step.inputPayload, null, 2)}
                      </pre>
                    </div>

                    <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs space-y-1">
                      <span className="text-[10px] font-mono uppercase text-slate-500 flex items-center space-x-1">
                        <Code className="w-3 h-3 text-emerald-600" />
                        <span>Step Output Result</span>
                      </span>
                      <pre className="text-[11px] text-emerald-600 font-mono overflow-x-auto">
                        {JSON.stringify(step.outputPayload, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


