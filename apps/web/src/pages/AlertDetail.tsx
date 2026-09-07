import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchApi } from '../api/client';
import { RiskBadge } from '../components/RiskBadge';
import { IAlert, AlertStatus } from '@fraudshield/shared-types';
import { ArrowLeft, CheckCircle, XCircle, MessageSquare, Send, AlertTriangle } from 'lucide-react';

export const AlertDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [alert, setAlert] = useState<IAlert | null>(null);
  const [newNote, setNewNote] = useState('');
  const [submittingNote, setSubmittingNote] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadAlertDetail = async () => {
    if (!id) return;
    setLoading(true);
    const res = await fetchApi(`/alerts/${id}`);
    if (res.success && res.data) {
      setAlert(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadAlertDetail();
  }, [id]);

  const handleStatusChange = async (newStatus: AlertStatus) => {
    if (!id) return;
    const res = await fetchApi(`/alerts/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus }),
    });

    if (res.success) {
      await loadAlertDetail();
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !newNote.trim()) return;

    setSubmittingNote(true);
    const res = await fetchApi(`/alerts/${id}/notes`, {
      method: 'POST',
      body: JSON.stringify({ note: newNote }),
    });

    setSubmittingNote(false);
    if (res.success) {
      setNewNote('');
      await loadAlertDetail();
    }
  };

  if (loading) return <div className="p-8 text-[#9AA9A2] text-xs font-mono">Loading fraud case telemetry...</div>;
  if (!alert) return <div className="p-8 text-[#F87171] text-xs font-mono">Alert case not found</div>;

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-6xl mx-auto font-sans">
      <Link to="/alerts" className="inline-flex items-center space-x-2 text-xs font-semibold text-[#34D399] hover:underline font-mono">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Alert Queue</span>
      </Link>

      {/* Case Header */}
      <div className="graphite-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3 flex-wrap gap-y-2">
            <h1 className="text-2xl font-bold text-[#F1F5F2] font-mono">{alert.alertRef}</h1>
            <RiskBadge severity={alert.severity} />
            <RiskBadge score={alert.riskScore} />
          </div>
          <p className="text-xs text-[#9AA9A2] mt-1 font-mono">
            Case Created: <span>{new Date(alert.createdAt).toLocaleString()}</span>
          </p>
        </div>

        {/* Workflow State Action Buttons */}
        <div className="flex items-center space-x-2 flex-wrap gap-y-2">
          <button
            onClick={() => handleStatusChange('CONFIRMED_FRAUD')}
            className="px-3 py-2 bg-[#F87171]/15 hover:bg-[#F87171]/25 text-[#F87171] rounded text-xs font-bold border border-[#F87171]/30 flex items-center space-x-1.5 transition"
          >
            <XCircle className="w-4 h-4 text-[#F87171]" />
            <span>Mark Confirmed Fraud</span>
          </button>

          <button
            onClick={() => handleStatusChange('FALSE_POSITIVE')}
            className="px-3 py-2 bg-[#10B981]/15 hover:bg-[#10B981]/25 text-[#34D399] rounded text-xs font-bold border border-[#10B981]/30 flex items-center space-x-1.5 transition"
          >
            <CheckCircle className="w-4 h-4 text-[#34D399]" />
            <span>Mark False Positive</span>
          </button>

          <button
            onClick={() => handleStatusChange('CLOSED')}
            className="btn-secondary text-xs"
          >
            <span>Close Case</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Risk Analysis & Rule Triggers */}
        <div className="lg:col-span-2 space-y-6">
          {/* Risk Factors Breakdown */}
          <div className="graphite-card p-6 space-y-4">
            <h3 className="text-sm font-bold text-[#F1F5F2] flex items-center space-x-2 border-b border-[#26332E] pb-3">
              <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
              <span>Triggered Risk Rules & Signals</span>
            </h3>

            {alert.evaluation?.ruleTriggers && alert.evaluation.ruleTriggers.length > 0 ? (
              <div className="space-y-3">
                {alert.evaluation.ruleTriggers.map((trigger: any, index: number) => (
                  <div key={index} className="p-3.5 bg-[#0B0F0E] border border-[#26332E] rounded-lg space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#34D399] font-mono">{trigger.ruleCode}</span>
                      <span className="text-[11px] font-bold text-[#F87171] font-mono">+{trigger.weight} Risk Score</span>
                    </div>
                    <p className="text-xs text-[#F1F5F2] font-medium">{trigger.ruleName}</p>
                    <p className="text-xs text-[#9AA9A2]">{trigger.reason}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#6B7A72] py-4 text-center italic">No explicit deterministic rules triggered (Evaluation Score: {alert.riskScore})</p>
            )}
          </div>

          {/* Transaction Metadata */}
          {alert.transaction && (
            <div className="graphite-card p-6 space-y-4">
              <h3 className="text-sm font-bold text-[#F1F5F2] border-b border-[#26332E] pb-3">
                Associated Transaction Telemetry
              </h3>

              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <span className="text-[#9AA9A2] block text-[11px] font-sans">Transaction Ref:</span>
                  <span className="text-[#34D399] font-bold">{alert.transaction.transactionRef}</span>
                </div>
                <div>
                  <span className="text-[#9AA9A2] block text-[11px] font-sans">Amount:</span>
                  <span className="text-[#F1F5F2] font-bold text-sm">₹{Number(alert.transaction.amount).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[#9AA9A2] block text-[11px] font-sans">User ID:</span>
                  <span className="text-[#F1F5F2]">{alert.transaction.userId}</span>
                </div>
                <div>
                  <span className="text-[#9AA9A2] block text-[11px] font-sans">Device ID:</span>
                  <span className="text-[#F1F5F2]">{alert.transaction.deviceId}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Analyst Investigation Notes */}
        <div className="graphite-card p-6 space-y-4 flex flex-col h-full">
          <h3 className="text-sm font-bold text-[#F1F5F2] flex items-center space-x-2 border-b border-[#26332E] pb-3">
            <MessageSquare className="w-4 h-4 text-[#34D399]" />
            <span>Analyst Notes</span>
          </h3>

          <div className="flex-1 space-y-3 overflow-y-auto max-h-[350px] pr-1">
            {alert.notes && alert.notes.length > 0 ? (
              alert.notes.map((note: any) => (
                <div key={note.id} className="p-3 bg-[#0B0F0E] border border-[#26332E] rounded-lg text-xs space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-[#9AA9A2] font-mono">
                    <span className="font-semibold text-[#34D399]">{note.analystName}</span>
                    <span>{new Date(note.createdAt).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-[#F1F5F2] leading-relaxed font-sans">{note.note}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-[#6B7A72] py-6 text-center italic font-mono">No notes added yet</p>
            )}
          </div>

          <form onSubmit={handleAddNote} className="pt-3 border-t border-[#26332E] flex space-x-2">
            <input
              type="text"
              placeholder="Add investigation observation..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="input-premium text-xs flex-1"
            />
            <button
              type="submit"
              disabled={submittingNote || !newNote.trim()}
              className="btn-primary p-2 flex items-center justify-center disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
