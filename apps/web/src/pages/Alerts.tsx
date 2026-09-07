import React, { useEffect, useState } from 'react';
import { fetchApi } from '../api/client';
import { RiskBadge } from '../components/RiskBadge';
import { IAlert } from '@fraudshield/shared-types';
import { Link } from 'react-router-dom';
import { ShieldAlert, RefreshCw, ChevronRight } from 'lucide-react';

export const Alerts: React.FC = () => {
  const [alerts, setAlerts] = useState<IAlert[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  const loadAlerts = async () => {
    setLoading(true);
    let url = '/alerts?limit=50';
    if (statusFilter !== 'ALL') {
      url += `&status=${statusFilter}`;
    }
    const res = await fetchApi(url);
    if (res.success && res.data) {
      setAlerts(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadAlerts();
  }, [statusFilter]);

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#26332E] pb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#F1F5F2] tracking-tight flex items-center space-x-3">
            <ShieldAlert className="w-6 h-6 text-[#F59E0B]" />
            <span>Analyst Investigation Portal</span>
          </h1>
          <p className="text-[#9AA9A2] text-xs font-mono mt-1">Review queue for suspicious transactions requiring human analyst decisions</p>
        </div>

        <button
          onClick={loadAlerts}
          className="btn-secondary text-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="graphite-card p-4 flex items-center justify-between">
        <div className="flex items-center space-x-1 bg-[#0B0F0E] p-1 rounded-lg border border-[#26332E] flex-wrap gap-y-1">
          {['ALL', 'OPEN', 'ASSIGNED', 'UNDER_REVIEW', 'CONFIRMED_FRAUD', 'FALSE_POSITIVE'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                statusFilter === status
                  ? 'bg-[#10B981] text-[#0B0F0E] font-bold'
                  : 'text-[#9AA9A2] hover:text-[#F1F5F2]'
              }`}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Queue */}
      <div className="graphite-card overflow-hidden">
        {loading ? (
          <p className="text-xs text-[#6B7A72] py-12 text-center font-mono">Loading fraud cases...</p>
        ) : alerts.length === 0 ? (
          <p className="text-xs text-[#6B7A72] py-12 text-center font-mono">No alerts in this status queue</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[#9AA9A2] uppercase tracking-wider bg-[#0B0F0E] border-b border-[#26332E] font-mono text-[11px]">
                <tr>
                  <th className="p-3.5">Alert Reference</th>
                  <th className="p-3.5">Txn Reference</th>
                  <th className="p-3.5">Amount</th>
                  <th className="p-3.5">Risk Score</th>
                  <th className="p-3.5">Severity</th>
                  <th className="p-3.5">Case Status</th>
                  <th className="p-3.5">Assigned Analyst</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#26332E]">
                {alerts.map((alert) => (
                  <tr key={alert.id} className="hover:bg-[#1C2522]/60 transition">
                    <td className="p-3.5 font-mono font-bold text-[#34D399]">
                      <Link to={`/alerts/${alert.id}`} className="hover:underline">
                        {alert.alertRef}
                      </Link>
                    </td>
                    <td className="p-3.5 font-mono text-[#F1F5F2]">
                      {alert.transactionRef || alert.transactionId.substring(0, 8)}
                    </td>
                    <td className="p-3.5 font-mono font-bold text-[#F1F5F2]">
                      ₹{Number(alert.amount || 0).toLocaleString()}
                    </td>
                    <td className="p-3.5">
                      <RiskBadge score={alert.riskScore} />
                    </td>
                    <td className="p-3.5">
                      <RiskBadge severity={alert.severity} />
                    </td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-0.5 rounded bg-[#1C2522] text-[11px] font-bold uppercase tracking-wider text-[#9AA9A2] font-mono border border-[#26332E]">
                        {alert.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-[#9AA9A2]">
                      {alert.assignedToName || 'Unassigned'}
                    </td>
                    <td className="p-3.5 text-right">
                      <Link
                        to={`/alerts/${alert.id}`}
                        className="px-3 py-1 bg-[#10B981]/10 hover:bg-[#10B981]/20 text-[#34D399] rounded text-xs font-semibold inline-flex items-center space-x-1 border border-[#10B981]/30 transition"
                      >
                        <span>Investigate</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
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
