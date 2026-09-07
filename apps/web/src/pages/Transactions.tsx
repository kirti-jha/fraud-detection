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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#26332E] pb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#F1F5F2] tracking-tight">Transaction Ledger</h1>
          <p className="text-[#9AA9A2] text-xs font-mono mt-1">Immutable financial ledger with real-time risk decision history</p>
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
        <div className="flex items-center space-x-1 bg-[#0B0F0E] p-1 rounded-lg border border-[#26332E] w-full sm:w-auto">
          {['ALL', 'APPROVED', 'REVIEW', 'BLOCKED'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                statusFilter === status
                  ? 'bg-[#10B981] text-[#0B0F0E] font-bold'
                  : 'text-[#9AA9A2] hover:text-[#F1F5F2]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#6B7A72] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search Txn Ref, User ID, Device..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-premium pl-9 text-xs"
          />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="graphite-card overflow-hidden">
        {loading ? (
          <p className="text-xs text-[#6B7A72] py-12 text-center font-mono">Loading transactions from database...</p>
        ) : filtered.length === 0 ? (
          <p className="text-xs text-[#6B7A72] py-12 text-center font-mono">No transactions matching criteria</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[#9AA9A2] uppercase tracking-wider bg-[#0B0F0E] border-b border-[#26332E] font-mono text-[11px]">
                <tr>
                  <th className="p-3.5">Transaction Reference</th>
                  <th className="p-3.5">Amount</th>
                  <th className="p-3.5">User ID</th>
                  <th className="p-3.5">Device & IP</th>
                  <th className="p-3.5">Risk Score</th>
                  <th className="p-3.5">Decision</th>
                  <th className="p-3.5">Created At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#26332E]">
                {filtered.map((txn) => (
                  <tr key={txn.id} className="hover:bg-[#1C2522]/60 transition">
                    <td className="p-3.5 font-mono font-bold text-[#34D399]">
                      <Link to={`/transactions/${txn.id}`} className="hover:underline">
                        {txn.transactionRef}
                      </Link>
                    </td>
                    <td className="p-3.5 font-mono font-bold text-[#F1F5F2]">
                      ₹{Number(txn.amount).toLocaleString()}
                    </td>
                    <td className="p-3.5 font-mono text-[#9AA9A2] text-[11px]">
                      {txn.userId.substring(0, 13)}...
                    </td>
                    <td className="p-3.5 font-mono text-[#9AA9A2] text-[11px]">
                      <div>{txn.deviceId}</div>
                      <div className="text-[#6B7A72]">{txn.ipAddress}</div>
                    </td>
                    <td className="p-3.5">
                      <RiskBadge score={txn.riskScore} />
                    </td>
                    <td className="p-3.5">
                      <RiskBadge decision={txn.decision} />
                    </td>
                    <td className="p-3.5 text-[#9AA9A2] font-mono text-[11px]">
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
