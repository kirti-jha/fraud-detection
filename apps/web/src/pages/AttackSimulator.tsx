import React, { useState } from 'react';
import { fetchApi } from '../api/client';
import { RiskExplanationCard } from '../components/RiskExplanationCard';
import { Play, Activity, Cpu, Zap, CheckCircle2, Flame, RefreshCw } from 'lucide-react';

interface Scenario {
  id: string;
  name: string;
  category: string;
  description: string;
  badgeColor: string;
  payload: {
    userId: string;
    amount: number;
    currency: string;
    deviceId: string;
    ipAddress: string;
    location: string;
    merchantCategory: string;
  };
}

export const AttackSimulator: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [executing, setExecuting] = useState(false);
  const [stepIndex, setStepIndex] = useState<number>(-1);
  const [resultData, setResultData] = useState<any>(null);

  const scenarios: Scenario[] = [
    {
      id: 'normal_customer',
      name: 'Normal Customer Purchase',
      category: 'Low Risk',
      description: '₹1,200 purchase from registered device & known IP address in Delhi.',
      badgeColor: 'badge-approve',
      payload: {
        userId: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
        amount: 1200,
        currency: 'INR',
        deviceId: 'DEV_REGULAR_001',
        ipAddress: '127.0.0.1',
        location: 'Delhi',
        merchantCategory: 'RETAIL',
      },
    },
    {
      id: 'account_takeover',
      name: 'Account Takeover Attack',
      category: 'High Risk',
      description: '₹75,000 transaction originating from unrecognized device & Mumbai IP.',
      badgeColor: 'badge-block',
      payload: {
        userId: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
        amount: 75000,
        currency: 'INR',
        deviceId: `DEV_ATO_${Date.now()}`,
        ipAddress: '103.44.12.99',
        location: 'Mumbai',
        merchantCategory: 'ELECTRONICS',
      },
    },
    {
      id: 'velocity_surge',
      name: 'Velocity Surge (Rapid Fire)',
      category: 'Attack Pattern',
      description: 'Sends high frequency rapid transactions to test Redis sliding window counters.',
      badgeColor: 'badge-review',
      payload: {
        userId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        amount: 15000,
        currency: 'INR',
        deviceId: 'DEV_VELOCITY_TEST',
        ipAddress: '192.168.1.50',
        location: 'Bangalore',
        merchantCategory: 'GAMING',
      },
    },
    {
      id: 'amount_spike',
      name: 'Sudden Amount Spike',
      category: 'Behavioral Anomaly',
      description: 'User average history is ₹2,000, suddenly attempts ₹95,000 transaction.',
      badgeColor: 'badge-amber-600',
      payload: {
        userId: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
        amount: 95000,
        currency: 'INR',
        deviceId: 'DEV_REGULAR_001',
        ipAddress: '127.0.0.1',
        location: 'Delhi',
        merchantCategory: 'JEWELRY',
      },
    },
  ];

  const runSimulation = async (scenario: Scenario) => {
    setSelectedScenario(scenario.id);
    setExecuting(true);
    setResultData(null);
    setStepIndex(0);

    // Step 1: Idempotency Check
    await new Promise((r) => setTimeout(r, 200));
    setStepIndex(1);

    // Step 2: Risk Rules
    await new Promise((r) => setTimeout(r, 250));
    setStepIndex(2);

    // Step 3: Velocity Check
    await new Promise((r) => setTimeout(r, 250));
    setStepIndex(3);

    // Step 4: ML Prediction & API Dispatch
    const res = await fetchApi('/transactions', {
      method: 'POST',
      body: JSON.stringify({
        ...scenario.payload,
        idempotencyKey: `SIM_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      }),
    });

    setStepIndex(4);
    await new Promise((r) => setTimeout(r, 200));
    setStepIndex(5);

    if (res.success && res.data) {
      setResultData(res.data);
    }
    setExecuting(false);
  };

  const stepsList = [
    { title: 'Transaction Received & Idempotency Check', icon: Activity },
    { title: 'Evaluating Deterministic Risk Rules', icon: Zap },
    { title: 'Querying Redis Sliding Window Velocity', icon: RefreshCw },
    { title: 'Python Random Forest ML Model Inference', icon: Cpu },
    { title: 'Ensemble Risk Score & Decision Finalized', icon: CheckCircle2 },
  ];

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center space-x-3">
          <Flame className="w-6 h-6 text-red-500" />
          <span>Fraud Attack Simulation Lab</span>
        </h1>
        <p className="text-slate-500 text-xs font-mono mt-1">
          Select real-world attack vectors and watch FraudShield evaluate risk in real time
        </p>
      </div>

      {/* Attack Scenario Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {scenarios.map((sc) => (
          <div
            key={sc.id}
            className={`graphite-card p-5 space-y-4 cursor-pointer hover:border-slate-300 transition group ${
              selectedScenario === sc.id ? 'border-emerald-500 ring-1 ring-emerald-200' : ''
            }`}
            onClick={() => !executing && runSimulation(sc)}
          >
            <div className="flex items-center justify-between">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${sc.badgeColor}`}>
                {sc.category}
              </span>
              <Play className="w-4 h-4 text-emerald-600 group-hover:scale-125 transition" />
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-800 group-hover:text-emerald-600 transition">{sc.name}</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{sc.description}</p>
            </div>

            <div className="pt-2 border-t border-slate-200 text-[11px] font-mono text-slate-500 flex justify-between">
              <span>Amount: <strong className="text-slate-800">₹{sc.payload.amount.toLocaleString()}</strong></span>
              <span className="text-emerald-600">Run Attack →</span>
            </div>
          </div>
        ))}
      </div>

      {/* Live Pipeline Execution Animation */}
      {stepIndex >= 0 && (
        <div className="graphite-card p-6 space-y-6">
          <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-2 border-b border-slate-200 pb-3">
            <Activity className="w-4 h-4 text-emerald-600" />
            <span>Live Risk Decision Pipeline Execution</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 font-mono">
            {stepsList.map((st, idx) => {
              const Icon = st.icon;
              const isCurrent = stepIndex === idx;
              const isCompleted = stepIndex > idx;

              return (
                <div
                  key={idx}
                  className={`p-3.5 rounded-lg border text-xs space-y-2 transition ${
                    isCompleted
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-600'
                      : isCurrent
                      ? 'bg-emerald-100 border-emerald-500 text-emerald-600 animate-pulse'
                      : 'bg-white border-slate-200 text-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-[10px]">
                    <span>STEP 0{idx + 1}</span>
                    {isCompleted ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <p className="font-semibold font-sans">{st.title}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Risk Explanation Result Card */}
      {resultData && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-800">Live Decision Result</h3>
          <RiskExplanationCard
            transactionRef={resultData.transaction?.transactionRef || 'TXN_SIMULATED'}
            amount={resultData.transaction?.amount || 0}
            riskScore={resultData.transaction?.riskScore || 0}
            decision={resultData.transaction?.decision || 'APPROVE'}
            signals={resultData.evaluation?.signalsBreakdown || resultData.evaluation?.ruleTriggers || []}
            latency={resultData.evaluation?.latencyBreakdown}
          />
        </div>
      )}
    </div>
  );
};


