import React from 'react';
import { ScrollText } from 'lucide-react';

export const AuditLogs: React.FC = () => {
  const auditEntries = [
    {
      id: 'AUD_001',
      action: 'ALERT_STATUS_UPDATE',
      actor: 'Senior Fraud Analyst (analyst@fraudshield.io)',
      entity: 'ALERT (ALT_1725459200_4412)',
      details: 'Status transitioned OPEN -> UNDER_REVIEW',
      timestamp: '2026-09-04T18:25:10Z',
    },
    {
      id: 'AUD_002',
      action: 'USER_LOGIN_SUCCESS',
      actor: 'System Administrator (admin@fraudshield.io)',
      entity: 'USER (a0eebc99-9c0b-4ef8)',
      details: 'JWT session issued from IP 127.0.0.1',
      timestamp: '2026-09-04T18:10:04Z',
    },
    {
      id: 'AUD_003',
      action: 'RULE_TRIGGER_EVALUATED',
      actor: 'System Engine',
      entity: 'TRANSACTION (TXN_1725458100_9912)',
      details: 'Rules HIGH_AMOUNT, NEW_DEVICE triggered total risk score 75 (BLOCK)',
      timestamp: '2026-09-04T18:05:22Z',
    },
  ];

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-6xl mx-auto font-sans">
      <div className="border-b border-[#26332E] pb-6">
        <h1 className="text-2xl font-bold text-[#F1F5F2] tracking-tight flex items-center space-x-3">
          <ScrollText className="w-6 h-6 text-[#34D399]" />
          <span>System Audit Trail</span>
        </h1>
        <p className="text-[#9AA9A2] text-xs font-mono mt-1">Immutable security log of analyst actions and risk engine evaluations</p>
      </div>

      <div className="graphite-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[#9AA9A2] uppercase tracking-wider bg-[#0B0F0E] border-b border-[#26332E] font-mono text-[11px]">
              <tr>
                <th className="p-3.5">Audit ID</th>
                <th className="p-3.5">Action</th>
                <th className="p-3.5">Actor</th>
                <th className="p-3.5">Entity</th>
                <th className="p-3.5">Log Details</th>
                <th className="p-3.5">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#26332E] font-mono">
              {auditEntries.map((log) => (
                <tr key={log.id} className="hover:bg-[#1C2522]/60 transition">
                  <td className="p-3.5 font-bold text-[#34D399]">{log.id}</td>
                  <td className="p-3.5 text-[#34D399] font-semibold">{log.action}</td>
                  <td className="p-3.5 text-[#F1F5F2] font-sans">{log.actor}</td>
                  <td className="p-3.5 text-[#9AA9A2]">{log.entity}</td>
                  <td className="p-3.5 text-[#F1F5F2] font-sans">{log.details}</td>
                  <td className="p-3.5 text-[#6B7A72]">{new Date(log.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
