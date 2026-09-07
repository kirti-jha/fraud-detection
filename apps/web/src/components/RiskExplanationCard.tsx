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
    <div className="graphite-card p-6 border-[#26332E] space-y-5">
      {/* Top Banner */}
      <div className="flex items-center justify-between border-b border-[#26332E] pb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2.5 rounded-lg ${decision === 'BLOCK' ? 'bg-[#F87171]/10 text-[#F87171] border border-[#F87171]/30' : decision === 'REVIEW' ? 'bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30' : 'bg-[#34D399]/10 text-[#34D399] border border-[#34D399]/30'}`}>
            {decision === 'BLOCK' ? <AlertOctagon className="w-5 h-5" /> : decision === 'REVIEW' ? <ShieldAlert className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
          </div>
          <div>
            <span className="text-xs font-mono font-semibold text-[#34D399]">{transactionRef}</span>
            <h3 className="text-base font-bold text-[#F1F5F2]">Risk Decision: {decision}</h3>
          </div>
        </div>

        <div className="text-right space-y-1">
          <p className="text-xl font-bold text-[#F1F5F2] font-mono">₹{Number(amount).toLocaleString()}</p>
          <RiskBadge score={riskScore} />
        </div>
      </div>

      {/* Contributing Signals Breakdown */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#9AA9A2] flex items-center justify-between">
          <span>Contributing Risk Signals ({signals.length})</span>
          <span className="text-[11px] font-mono text-[#34D399]">Score Weight</span>
        </h4>

        {signals.length === 0 ? (
          <p className="text-xs text-[#6B7A72] italic py-2">No explicit risk anomalies detected (Low Risk baseline)</p>
        ) : (
          <div className="space-y-2">
            {signals.map((sig, idx) => (
              <div key={idx} className="p-3 bg-[#0B0F0E] border border-[#26332E] rounded-lg flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2.5">
                  <span className={`w-2 h-2 rounded-full ${sig.type === 'RULE' ? 'bg-[#F87171]' : sig.type === 'VELOCITY' ? 'bg-[#F59E0B]' : 'bg-[#60A5FA]'}`}></span>
                  <div>
                    <p className="font-semibold text-[#F1F5F2]">{sig.name}</p>
                    <p className="text-[11px] text-[#9AA9A2]">{sig.reason}</p>
                  </div>
                </div>

                <span className="font-mono font-bold text-[#F87171] text-sm">
                  +{sig.weight}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Latency SLA Telemetry */}
      {latency && (
        <div className="pt-3 border-t border-[#26332E] flex items-center justify-between text-[11px] text-[#9AA9A2] font-mono">
          <span className="flex items-center space-x-1.5 text-[#F1F5F2]">
            <Clock className="w-3.5 h-3.5 text-[#34D399]" />
            <span>Total Decision SLA: <strong className="text-[#34D399] font-bold">{latency.totalMs}ms</strong></span>
          </span>

          <span className="text-[#6B7A72]">
            Rules: {latency.rulesMs}ms | Redis: {latency.redisMs}ms | ML: {latency.mlMs}ms | DB: {latency.dbMs}ms
          </span>
        </div>
      )}
    </div>
  );
};
