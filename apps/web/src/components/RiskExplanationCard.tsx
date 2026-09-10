import React from 'react';
import { RiskBadge } from './RiskBadge';
import { ISignalBreakdown, ILatencyBreakdown } from '@fraudshield/shared-types';
import { AlertOctagon, CheckCircle2, ShieldAlert, Clock } from 'lucide-react';

interface RiskExplanationCardProps {
  transactionRef: string;
  amount: number;
  riskScore: number;
  decision: string;
  signals: ISignalBreakdown[];
  latency?: ILatencyBreakdown;
}

export const RiskExplanationCard: React.FC<RiskExplanationCardProps> = ({
  transactionRef,
  amount,
  riskScore,
  decision,
  signals,
  latency,
}) => {
  return (
    <div className="graphite-card p-6 border-slate-200 space-y-5">
      {/* Top Banner */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2.5 rounded-lg ${decision === 'BLOCK' ? 'bg-red-50 text-red-500 border border-red-200' : decision === 'REVIEW' ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'}`}>
            {decision === 'BLOCK' ? <AlertOctagon className="w-5 h-5" /> : decision === 'REVIEW' ? <ShieldAlert className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
          </div>
          <div>
            <span className="text-xs font-mono font-semibold text-emerald-600">{transactionRef}</span>
            <h3 className="text-base font-bold text-slate-800">Risk Decision: {decision}</h3>
          </div>
        </div>

        <div className="text-right space-y-1">
          <p className="text-xl font-bold text-slate-800 font-mono">₹{Number(amount).toLocaleString()}</p>
          <RiskBadge score={riskScore} />
        </div>
      </div>

      {/* Contributing Signals Breakdown */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
          <span>Contributing Risk Signals ({signals.length})</span>
          <span className="text-[11px] font-mono text-emerald-600">Score Weight</span>
        </h4>

        {signals.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-2">No explicit risk anomalies detected (Low Risk baseline)</p>
        ) : (
          <div className="space-y-2">
            {signals.map((sig, idx) => (
              <div key={idx} className="p-3 bg-white border border-slate-200 rounded-lg flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2.5">
                  <span className={`w-2 h-2 rounded-full ${sig.type === 'RULE' ? 'bg-red-500' : sig.type === 'VELOCITY' ? 'bg-amber-600' : 'bg-blue-500'}`}></span>
                  <div>
                    <p className="font-semibold text-slate-800">{sig.name}</p>
                    <p className="text-[11px] text-slate-500">{sig.reason}</p>
                  </div>
                </div>

                <span className="font-mono font-bold text-red-500 text-sm">
                  +{sig.weight}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Latency SLA Telemetry */}
      {latency && (
        <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span className="flex items-center space-x-1.5 text-slate-800">
            <Clock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Total Decision SLA: <strong className="text-emerald-600 font-bold">{latency.totalMs}ms</strong></span>
          </span>

          <span className="text-slate-500">
            Rules: {latency.rulesMs}ms | Redis: {latency.redisMs}ms | ML: {latency.mlMs}ms | DB: {latency.dbMs}ms
          </span>
        </div>
      )}
    </div>
  );
};


