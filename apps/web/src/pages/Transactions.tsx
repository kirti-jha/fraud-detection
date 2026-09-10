import React, { useEffect, useState } from 'react';
import { fetchApi } from '../api/client';
import { RiskBadge } from '../components/RiskBadge';
import { ITransaction } from '@fraudshield/shared-types';
import { Link } from 'react-router-dom';
import { Search, RefreshCw } from 'lucide-react';

export const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const loadTransactions = async () => {
    setLoading(true);
    let url = '/transactions?limit=50';
    if (statusFilter !== 'ALL') {
      url += `&status=${statusFilter}`;
    }
    const res = await fetchApi(url);
    if (res.success && res.data) {
      setTransactions(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadTransactions();
  }, [statusFilter]);

  const filtered = transactions.filter(
    (t) =>
      t.transactionRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.deviceId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Transaction Ledger</h1>
          <p className="text-slate-500 text-xs font-mono mt-1">Immutable financial ledger with real-time risk decision history</p>
        </div>

        <button
          onClick={loadTransactions}
          className="btn-secondary text-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Ledger</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 graphite-card p-4">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-1 bg-white p-1 rounded-lg border border-slate-200 w-full sm:w-auto">
          {['ALL', 'APPROVED', 'REVIEW', 'BLOCKED'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                statusFilter === status
                  ? 'bg-emerald-500 text-white font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72 flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
          <input
            type="text"
            placeholder="Search Txn Ref, User ID, Device..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-premium !pl-9 text-xs"
          />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="graphite-card overflow-hidden">
        {loading ? (
          <p className="text-xs text-slate-500 py-12 text-center font-mono">Loading transactions from database...</p>
        ) : filtered.length === 0 ? (
          <p className="text-xs text-slate-500 py-12 text-center font-mono">No transactions matching criteria</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-500 uppercase tracking-wider bg-white border-b border-slate-200 font-mono text-[11px]">
                <tr>
                  <th className="p-3.5">Transaction Reference</th>
                  <th className="p-3.5">Amount</th>
                  <th className="p-3.5 hidden md:table-cell">User ID</th>
                  <th className="p-3.5 hidden sm:table-cell">Device &amp; IP</th>
                  <th className="p-3.5">Risk Score</th>
                  <th className="p-3.5">Decision</th>
                  <th className="p-3.5 hidden lg:table-cell">Created At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filtered.map((txn) => (
                  <tr key={txn.id} className="hover:bg-slate-100/60 transition">
                    <td className="p-3.5 font-mono font-bold text-emerald-600">
                      <Link to={`/transactions/${txn.id}`} className="hover:underline">
                        {txn.transactionRef}
                      </Link>
                    </td>
                    <td className="p-3.5 font-mono font-bold text-slate-800">
                      ₹{Number(txn.amount).toLocaleString()}
                    </td>
                    <td className="p-3.5 font-mono text-slate-500 text-[11px] hidden md:table-cell">
                      {txn.userId.substring(0, 13)}...
                    </td>
                    <td className="p-3.5 font-mono text-slate-500 text-[11px] hidden sm:table-cell">
                      <div>{txn.deviceId}</div>
                      <div className="text-slate-500">{txn.ipAddress}</div>
                    </td>
                    <td className="p-3.5">
                      <RiskBadge score={txn.riskScore} />
                    </td>
                    <td className="p-3.5">
                      <RiskBadge decision={txn.decision} />
                    </td>
                    <td className="p-3.5 text-slate-500 font-mono text-[11px] hidden lg:table-cell">
                      {new Date(txn.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};


