import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchApi } from '../api/client';
import { RiskBadge } from '../components/RiskBadge';
import { ITransaction, IRiskEvaluation } from '@fraudshield/shared-types';
import { ArrowLeft, ShieldAlert, Cpu } from 'lucide-react';

export const TransactionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [txn, setTxn] = useState<ITransaction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetail = async () => {
      if (!id) return;
      setLoading(true);
      const res = await fetchApi(`/transactions/${id}`);
      if (res.success && res.data) {
        setTxn(res.data);
      }
      setLoading(false);
    };
    loadDetail();
  }, [id]);

  if (loading) return <div className="p-8 text-[#9AA9A2] text-xs font-mono">Loading transaction telemetry...</div>;
  if (!txn) return <div className="p-8 text-[#F87171] text-xs font-mono">Transaction not found</div>;

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-5xl mx-auto font-sans">
      <Link to="/transactions" className="inline-flex items-center space-x-2 text-xs font-semibold text-[#34D399] hover:underline font-mono">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Ledger</span>
      </Link>

      {/* Header Banner */}
      <div className="graphite-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3 flex-wrap gap-y-2">
            <h1 className="text-2xl font-bold text-[#F1F5F2] font-mono">{txn.transactionRef}</h1>
            <RiskBadge score={txn.riskScore} />
            <RiskBadge decision={txn.decision} />
          </div>
          <p className="text-xs text-[#9AA9A2] mt-1 font-mono">ID: {txn.id}</p>
        </div>

        <div className="text-right">
          <p className="text-3xl font-bold text-[#F1F5F2] font-mono">₹{Number(txn.amount).toLocaleString()}</p>
          <p className="text-xs text-[#9AA9A2] mt-1 font-mono">{txn.currency} / {txn.merchantCategory || 'ECOMMERCE'}</p>
        </div>
      </div>

      {/* Grid Specs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Device & User Info */}
        <div className="graphite-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-[#F1F5F2] flex items-center space-x-2 border-b border-[#26332E] pb-3">
            <Cpu className="w-4 h-4 text-[#34D399]" />
            <span>Device & Telemetry Intelligence</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-[#26332E]">
              <span className="text-[#9AA9A2]">User ID:</span>
              <span className="font-mono text-[#F1F5F2]">{txn.userId}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#26332E]">
              <span className="text-[#9AA9A2]">Device Fingerprint:</span>
              <span className="font-mono text-[#34D399]">{txn.deviceId}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#26332E]">
              <span className="text-[#9AA9A2]">IP Address:</span>
              <span className="font-mono text-[#F1F5F2]">{txn.ipAddress}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#9AA9A2]">Geographic Location:</span>
              <span className="font-mono text-[#F1F5F2]">{txn.location || 'Mumbai, IN'}</span>
            </div>
          </div>
        </div>

        {/* Risk Score Summary */}
        <div className="graphite-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-[#F1F5F2] flex items-center space-x-2 border-b border-[#26332E] pb-3">
            <ShieldAlert className="w-4 h-4 text-[#F59E0B]" />
            <span>Risk Calculation Metrics</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-[#26332E]">
              <span className="text-[#9AA9A2]">Computed Risk Score:</span>
              <span className="font-mono font-bold text-[#F1F5F2]">{txn.riskScore} / 100</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#26332E]">
              <span className="text-[#9AA9A2]">System Decision:</span>
              <RiskBadge decision={txn.decision} />
            </div>
            <div className="flex justify-between py-1 border-b border-[#26332E]">
              <span className="text-[#9AA9A2]">Status:</span>
              <span className="font-mono font-semibold text-[#34D399]">{txn.status}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#9AA9A2]">Evaluated Timestamp:</span>
              <span className="font-mono text-[#9AA9A2]">{new Date(txn.createdAt).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
