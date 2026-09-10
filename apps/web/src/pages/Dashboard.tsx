import React, { useEffect, useState } from 'react';
import { fetchApi } from '../api/client';
import { RiskBadge } from '../components/RiskBadge';
import { ITransaction, IAlert } from '@fraudshield/shared-types';
import { ShieldAlert, CreditCard, Activity, Play, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [alerts, setAlerts] = useState<IAlert[]>([]);
  const [simulating, setSimulating] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const txnRes = await fetchApi('/transactions?limit=10');
    const alertRes = await fetchApi('/alerts?limit=5');

    if (txnRes.success && txnRes.data) setTransactions(txnRes.data);
    if (alertRes.success && alertRes.data) setAlerts(alertRes.data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const simulateTransaction = async (isHighRisk: boolean = false) => {
    setSimulating(true);

    const mockUsers = [
      'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
      'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22'
    ];

    const amount = isHighRisk ? 85000 : Math.floor(Math.random() * 4000) + 500;
    const deviceId = isHighRisk ? `DEV_SUSPICIOUS_${Date.now()}` : 'DEV_REGULAR_001';
    const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];

    await fetchApi('/transactions', {
      method: 'POST',
      body: JSON.stringify({
        userId: randomUser,
        amount,
        currency: 'INR',
        deviceId,
        ipAddress: isHighRisk ? '103.44.12.99' : '127.0.0.1',
        location: isHighRisk ? 'Mumbai' : 'Delhi',
        merchantCategory: 'ECOMMERCE',
      }),
    });

    setSimulating(false);
    await loadData();
  };

  const totalTxns = transactions.length;
  const approvedCount = transactions.filter((t) => t.decision === 'APPROVE').length;
  const reviewCount = transactions.filter((t) => t.decision === 'REVIEW').length;
  const blockedCount = transactions.filter((t) => t.decision === 'BLOCK').length;

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto font-sans">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Real-Time Risk Dashboard</h1>
          <p className="text-slate-500 text-xs font-mono mt-1">Live transaction monitoring and fraud detection metrics</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => simulateTransaction(false)}
            disabled={simulating}
            className="btn-secondary text-xs"
          >
            <Play className="w-3.5 h-3.5 text-emerald-600" />
            <span>Simulate Normal</span>
          </button>

          <button
            onClick={() => simulateTransaction(true)}
            disabled={simulating}
            className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg text-xs font-semibold flex items-center space-x-2 border border-red-200 transition"
          >
            <Play className="w-3.5 h-3.5 text-red-500" />
            <span>Fraud Spike (₹85k)</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="graphite-card p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Evaluated</span>
            <div className="p-2 bg-blue-50 rounded-lg text-blue-500">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-800 font-mono">{totalTxns}</p>
          <p className="text-xs text-slate-500">Transactions in ledger</p>
        </div>

        <div className="graphite-card p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Approved</span>
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold text-emerald-600 font-mono">{approvedCount}</p>
          <p className="text-xs text-slate-500">Risk score ≤ 30</p>
        </div>

        <div className="graphite-card p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Review Queue</span>
            <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold text-amber-600 font-mono">{reviewCount}</p>
          <p className="text-xs text-slate-500">Score 31–70 (Analyst Review)</p>
        </div>

        <div className="graphite-card p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Blocked</span>
            <div className="p-2 bg-red-50 rounded-lg text-red-500">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold text-red-500 font-mono">{blockedCount}</p>
          <p className="text-xs text-slate-500">Score 71–100 (High Risk)</p>
        </div>
      </div>

      {/* Grid: Alert Queue & Transactions Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Suspicious Alerts */}
        <div className="graphite-card p-6 lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Fraud Alert Queue</span>
            </h3>
            <Link to="/alerts" className="text-xs text-emerald-600 hover:underline font-semibold font-mono">View All</Link>
          </div>

          {alerts.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center italic">No open alerts in queue</p>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert) => (
                <Link
                  key={alert.id}
                  to={`/alerts/${alert.id}`}
                  className="block p-3.5 bg-white border border-slate-200 hover:border-slate-300 rounded-lg transition group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-semibold text-emerald-600 group-hover:underline">
                      {alert.alertRef}
                    </span>
                    <RiskBadge severity={alert.severity} />
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 mt-2 font-mono">
                    <span>Score: <strong className="text-slate-800">{alert.riskScore}</strong></span>
                    <span className="uppercase text-[10px] tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-500">
                      {alert.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Live Transaction Stream */}
        <div className="graphite-card p-6 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              <span>Recent Evaluated Transactions</span>
            </h3>
            <Link to="/transactions" className="text-xs text-emerald-600 hover:underline font-semibold font-mono">View Ledger</Link>
          </div>

          {loading ? (
            <p className="text-xs text-slate-500 py-8 text-center font-mono">Loading transactions...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-slate-500 uppercase tracking-wider bg-white font-mono text-[11px]">
                  <tr>
                    <th className="p-3">Txn Ref</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3 hidden sm:table-cell">Device / IP</th>
                    <th className="p-3">Score</th>
                    <th className="p-3">Decision</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {transactions.map((txn) => (
                    <tr key={txn.id} className="hover:bg-slate-100/60 transition">
                      <td className="p-3 font-mono font-semibold text-emerald-600">
                        <Link to={`/transactions/${txn.id}`} className="hover:underline">{txn.transactionRef}</Link>
                      </td>
                      <td className="p-3 font-mono font-bold text-slate-800">
                        ₹{Number(txn.amount).toLocaleString()}
                      </td>
                      <td className="p-3 text-slate-500 font-mono text-[11px] hidden sm:table-cell">
                        {txn.deviceId} ({txn.ipAddress})
                      </td>
                      <td className="p-3">
                        <RiskBadge score={txn.riskScore} />
                      </td>
                      <td className="p-3">
                        <RiskBadge decision={txn.decision} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


