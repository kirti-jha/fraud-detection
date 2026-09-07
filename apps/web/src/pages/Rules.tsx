import React, { useEffect, useState } from 'react';
import { fetchApi } from '../api/client';
import { IRiskRule } from '@fraudshield/shared-types';
import { Sliders, RefreshCw } from 'lucide-react';

export const Rules: React.FC = () => {
  const [rules, setRules] = useState<IRiskRule[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRules = async () => {
    setLoading(true);
    const res = await fetchApi('/rules');
    if (res.success && res.data) {
      setRules(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadRules();
  }, []);

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-6xl mx-auto font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#26332E] pb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#F1F5F2] tracking-tight flex items-center space-x-3">
            <Sliders className="w-6 h-6 text-[#34D399]" />
            <span>Configurable Risk Rules</span>
          </h1>
          <p className="text-[#9AA9A2] text-xs font-mono mt-1">Deterministic risk scoring rules, threshold parameters, and weight configuration</p>
        </div>

        <button
          onClick={loadRules}
          className="btn-secondary text-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Rules</span>
        </button>
      </div>

      {loading ? (
        <p className="text-xs text-[#6B7A72] py-12 text-center font-mono">Loading active rules from database...</p>
      ) : rules.length === 0 ? (
        <p className="text-xs text-[#6B7A72] py-12 text-center font-mono">No risk rules found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {rules.map((rule) => (
            <div key={rule.id} className="graphite-card p-5 space-y-3">
              <div className="flex items-center justify-between font-mono">
                <span className="text-xs font-bold text-[#34D399] px-2.5 py-0.5 bg-[#10B981]/10 rounded border border-[#10B981]/25">
                  {rule.code}
                </span>
                <span className="text-xs font-bold text-[#F59E0B] bg-[#F59E0B]/10 px-2.5 py-0.5 rounded border border-[#F59E0B]/25">
                  +{rule.weight} Weight
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#F1F5F2]">{rule.name}</h3>
                <p className="text-xs text-[#9AA9A2] mt-1 leading-relaxed">{rule.description}</p>
              </div>

              <div className="pt-2 border-t border-[#26332E] flex items-center justify-between text-xs text-[#9AA9A2]">
                <span className="font-mono">Category: <strong className="text-[#F1F5F2]">{rule.category}</strong></span>
                <span className="flex items-center space-x-1.5 font-mono">
                  <span className={`w-2 h-2 rounded-full ${rule.isActive ? 'bg-[#34D399]' : 'bg-[#6B7A72]'}`}></span>
                  <span className="font-semibold text-[#F1F5F2]">{rule.isActive ? 'ACTIVE' : 'INACTIVE'}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
