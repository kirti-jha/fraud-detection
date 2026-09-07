import React, { useEffect, useState } from 'react';
import { fetchApi } from '../api/client';
import { IRiskPolicyVersion, IPolicyImpactResult } from '@fraudshield/shared-types';
import { Sliders, RotateCcw, Play } from 'lucide-react';

export const PolicyStudio: React.FC = () => {
  const [policies, setPolicies] = useState<IRiskPolicyVersion[]>([]);
  const [highAmountThreshold, setHighAmountThreshold] = useState<number>(75000);
  const [deviceWeight, setDeviceWeight] = useState<number>(15);
  const [simulating, setSimulating] = useState(false);
  const [impact, setImpact] = useState<IPolicyImpactResult | null>(null);

  const loadPolicies = async () => {
    const res = await fetchApi('/policies');
    if (res.success && res.data) {
      setPolicies(res.data);
    }
  };

  const runSimulation = async () => {
    setSimulating(true);
    const res = await fetchApi('/policies/simulate', {
      method: 'POST',
      body: JSON.stringify({ threshold: highAmountThreshold, deviceWeight }),
    });
    setSimulating(false);
    if (res.success && res.data) {
      setImpact(res.data);
    }
  };

  useEffect(() => {
    loadPolicies();
    runSimulation();
  }, []);

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="border-b border-[#26332E] pb-6">
        <h1 className="text-2xl font-bold text-[#F1F5F2] tracking-tight flex items-center space-x-3">
          <Sliders className="w-6 h-6 text-[#34D399]" />
          <span>Risk Policy Studio & Impact Replay</span>
        </h1>
        <p className="text-[#9AA9A2] text-xs font-mono mt-1">
          Version-controlled risk policies and historical transaction impact simulation
        </p>
      </div>

      {/* What-If Simulation Playground */}
      <div className="graphite-card p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#26332E] pb-4">
          <div>
            <h3 className="text-sm font-bold text-[#F1F5F2] flex items-center space-x-2">
              <RotateCcw className="w-4 h-4 text-[#34D399]" />
              <span>What-If Historical Policy Simulation</span>
            </h3>
            <p className="text-xs text-[#9AA9A2] mt-1">
              Test proposed rule threshold changes against historical transaction ledger to evaluate financial impact before publishing
            </p>
          </div>

          <button
            onClick={runSimulation}
            disabled={simulating}
            className="btn-primary text-xs"
          >
            <Play className={`w-3.5 h-3.5 ${simulating ? 'animate-spin' : ''}`} />
            <span>{simulating ? 'Replaying History...' : 'Simulate Policy Impact'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono">
          <div>
            <label className="block text-xs font-semibold text-[#9AA9A2] uppercase tracking-wider mb-2 font-sans">
              Proposed High Amount Threshold: <strong className="text-[#34D399]">₹{highAmountThreshold.toLocaleString()}</strong>
            </label>
            <input
              type="range"
              min={30000}
              max={150000}
              step={5000}
              value={highAmountThreshold}
              onChange={(e) => setHighAmountThreshold(parseInt(e.target.value, 10))}
              className="w-full accent-[#10B981] cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#9AA9A2] uppercase tracking-wider mb-2 font-sans">
              Proposed New Device Score Weight: <strong className="text-[#34D399]">+{deviceWeight} Score</strong>
            </label>
            <input
              type="range"
              min={5}
              max={35}
              step={5}
              value={deviceWeight}
              onChange={(e) => setDeviceWeight(parseInt(e.target.value, 10))}
              className="w-full accent-[#10B981] cursor-pointer"
            />
          </div>
        </div>

        {/* Impact Results */}
        {impact && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center font-mono">
            <div className="p-4 bg-[#0B0F0E] border border-[#26332E] rounded-lg">
              <span className="text-xs text-[#9AA9A2] font-sans block">Historical Txns Tested</span>
              <span className="text-2xl font-bold text-[#F1F5F2] mt-1 block">{impact.historicalTxnsTested}</span>
            </div>

            <div className="p-4 bg-[#0B0F0E] border border-[#26332E] rounded-lg">
              <span className="text-xs text-[#9AA9A2] font-sans block">Current Policy Blocks</span>
              <span className="text-2xl font-bold text-[#F87171] mt-1 block">{impact.currentBlocks}</span>
            </div>

            <div className="p-4 bg-[#0B0F0E] border border-[#26332E] rounded-lg">
              <span className="text-xs text-[#9AA9A2] font-sans block">Simulated Policy Blocks</span>
              <span className="text-2xl font-bold text-[#F59E0B] mt-1 block">{impact.newBlocks}</span>
            </div>

            <div className="p-4 bg-[#0B0F0E] border border-[#26332E] rounded-lg">
              <span className="text-xs text-[#9AA9A2] font-sans block">False Positive Reduction</span>
              <span className="text-2xl font-bold text-[#34D399] mt-1 block">-{impact.falsePositiveReductionPct}%</span>
            </div>
          </div>
        )}
      </div>

      {/* Published Policy Versions */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-[#F1F5F2]">Published Policy Version Registry</h3>

        <div className="space-y-4">
          {policies.map((p) => (
            <div key={p.id} className="graphite-card p-5 space-y-3">
              <div className="flex items-center justify-between font-mono">
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-bold text-[#34D399] px-2.5 py-0.5 bg-[#10B981]/10 rounded border border-[#10B981]/25">
                    {p.version}
                  </span>
                  <h4 className="text-sm font-bold text-[#F1F5F2] font-sans">{p.name}</h4>
                </div>

                <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${p.isActive ? 'bg-[#10B981]/15 text-[#34D399] border border-[#10B981]/30' : 'bg-[#1C2522] text-[#6B7A72]'}`}>
                  {p.isActive ? 'ACTIVE IN PRODUCTION' : 'DRAFT / ARCHIVED'}
                </span>
              </div>

              <p className="text-xs text-[#9AA9A2]">{p.description}</p>

              <div className="pt-2 border-t border-[#26332E] flex justify-between text-xs text-[#6B7A72] font-mono">
                <span>Published By: <strong className="text-[#F1F5F2]">{p.publishedBy}</strong></span>
                <span>Created: {new Date(p.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
