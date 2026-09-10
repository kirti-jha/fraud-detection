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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center space-x-3">
            <ShieldAlert className="w-6 h-6 text-amber-600" />
            <span>Analyst Investigation Portal</span>
          </h1>
          <p className="text-slate-500 text-xs font-mono mt-1">Review queue for suspicious transactions requiring human analyst decisions</p>
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
      <div className="graphite-card p-4">
        <div className="flex flex-wrap gap-1 bg-white p-1 rounded-lg border border-slate-200">
          {['ALL', 'OPEN', 'ASSIGNED', 'UNDER_REVIEW', 'CONFIRMED_FRAUD', 'FALSE_POSITIVE'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                statusFilter === status
                  ? 'bg-emerald-500 text-white font-bold'
                  : 'text-slate-500 hover:text-slate-800'
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
          <p className="text-xs text-slate-500 py-12 text-center font-mono">Loading fraud cases...</p>
        ) : alerts.length === 0 ? (
          <p className="text-xs text-slate-500 py-12 text-center font-mono">No alerts in this status queue</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-500 uppercase tracking-wider bg-white border-b border-slate-200 font-mono text-[11px]">
                  <tr>
                    <th className="p-3.5">Alert Reference</th>
                    <th className="p-3.5 hidden sm:table-cell">Txn Reference</th>
                    <th className="p-3.5 hidden md:table-cell">Amount</th>
                    <th className="p-3.5">Risk Score</th>
                    <th className="p-3.5">Severity</th>
                    <th className="p-3.5">Case Status</th>
                    <th className="p-3.5 hidden lg:table-cell">Assigned Analyst</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {alerts.map((alert) => (
                    <tr key={alert.id} className="hover:bg-slate-100/60 transition">
                      <td className="p-3.5 font-mono font-bold text-emerald-600">
                        <Link to={`/alerts/${alert.id}`} className="hover:underline">
                          {alert.alertRef}
                        </Link>
                      </td>
                      <td className="p-3.5 font-mono text-slate-800 hidden sm:table-cell">
                        {alert.transactionRef || alert.transactionId.substring(0, 8)}
                      </td>
                      <td className="p-3.5 font-mono font-bold text-slate-800 hidden md:table-cell">
                        ₹{Number(alert.amount || 0).toLocaleString()}
                      </td>
                      <td className="p-3.5">
                        <RiskBadge score={alert.riskScore} />
                      </td>
                      <td className="p-3.5">
                        <RiskBadge severity={alert.severity} />
                      </td>
                      <td className="p-3.5">
                        <span className="px-2.5 py-0.5 rounded bg-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono border border-slate-200">
                          {alert.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-500 hidden lg:table-cell">
                        {alert.assignedToName || 'Unassigned'}
                      </td>
                      <td className="p-3.5 text-right">
                        <Link
                          to={`/alerts/${alert.id}`}
                          className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded text-xs font-semibold inline-flex items-center space-x-1 border border-emerald-300 transition"
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


