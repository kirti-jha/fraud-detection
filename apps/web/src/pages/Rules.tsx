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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center space-x-3">
            <Sliders className="w-6 h-6 text-emerald-600" />
            <span>Configurable Risk Rules</span>
          </h1>
          <p className="text-slate-500 text-xs font-mono mt-1">Deterministic risk scoring rules, threshold parameters, and weight configuration</p>
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
        <p className="text-xs text-slate-500 py-12 text-center font-mono">Loading active rules from database...</p>
      ) : rules.length === 0 ? (
        <p className="text-xs text-slate-500 py-12 text-center font-mono">No risk rules found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {rules.map((rule) => (
            <div key={rule.id} className="graphite-card p-5 space-y-3">
              <div className="flex items-center justify-between font-mono">
                <span className="text-xs font-bold text-emerald-600 px-2.5 py-0.5 bg-emerald-50 rounded border border-emerald-200">
                  {rule.code}
                </span>
                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-600/25">
                  +{rule.weight} Weight
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-800">{rule.name}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{rule.description}</p>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                <span className="font-mono">Category: <strong className="text-slate-800">{rule.category}</strong></span>
                <span className="flex items-center space-x-1.5 font-mono">
                  <span className={`w-2 h-2 rounded-full ${rule.isActive ? 'bg-emerald-600' : 'bg-slate-400'}`}></span>
                  <span className="font-semibold text-slate-800">{rule.isActive ? 'ACTIVE' : 'INACTIVE'}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


