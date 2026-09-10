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

  if (loading) return <div className="p-8 text-slate-500 text-xs font-mono">Loading fraud case telemetry...</div>;
  if (!alert) return <div className="p-8 text-red-500 text-xs font-mono">Alert case not found</div>;

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-6xl mx-auto font-sans">
      <Link to="/alerts" className="inline-flex items-center space-x-2 text-xs font-semibold text-emerald-600 hover:underline font-mono">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Alert Queue</span>
      </Link>

      {/* Case Header */}
      <div className="graphite-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3 flex-wrap gap-y-2">
            <h1 className="text-2xl font-bold text-slate-800 font-mono">{alert.alertRef}</h1>
            <RiskBadge severity={alert.severity} />
            <RiskBadge score={alert.riskScore} />
          </div>
          <p className="text-xs text-slate-500 mt-1 font-mono">
            Case Created: <span>{new Date(alert.createdAt).toLocaleString()}</span>
          </p>
        </div>

        {/* Workflow State Action Buttons */}
        <div className="flex items-center space-x-2 flex-wrap gap-y-2">
          <button
            onClick={() => handleStatusChange('CONFIRMED_FRAUD')}
            className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-500 rounded text-xs font-bold border border-red-200 flex items-center space-x-1.5 transition"
          >
            <XCircle className="w-4 h-4 text-red-500" />
            <span>Mark Confirmed Fraud</span>
          </button>

          <button
            onClick={() => handleStatusChange('FALSE_POSITIVE')}
            className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded text-xs font-bold border border-emerald-300 flex items-center space-x-1.5 transition"
          >
            <CheckCircle className="w-4 h-4 text-emerald-600" />
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
            <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-2 border-b border-slate-200 pb-3">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Triggered Risk Rules & Signals</span>
            </h3>

            {alert.evaluation?.ruleTriggers && alert.evaluation.ruleTriggers.length > 0 ? (
              <div className="space-y-3">
                {alert.evaluation.ruleTriggers.map((trigger: any, index: number) => (
                  <div key={index} className="p-3.5 bg-white border border-slate-200 rounded-lg space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-600 font-mono">{trigger.ruleCode}</span>
                      <span className="text-[11px] font-bold text-red-500 font-mono">+{trigger.weight} Risk Score</span>
                    </div>
                    <p className="text-xs text-slate-800 font-medium">{trigger.ruleName}</p>
                    <p className="text-xs text-slate-500">{trigger.reason}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-4 text-center italic">No explicit deterministic rules triggered (Evaluation Score: {alert.riskScore})</p>
            )}
          </div>

          {/* Transaction Metadata */}
          {alert.transaction && (
            <div className="graphite-card p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-800 border-b border-slate-200 pb-3">
                Associated Transaction Telemetry
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <span className="text-slate-500 block text-[11px] font-sans">Transaction Ref:</span>
                  <span className="text-emerald-600 font-bold">{alert.transaction.transactionRef}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px] font-sans">Amount:</span>
                  <span className="text-slate-800 font-bold text-sm">₹{Number(alert.transaction.amount).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px] font-sans">User ID:</span>
                  <span className="text-slate-800">{alert.transaction.userId}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px] font-sans">Device ID:</span>
                  <span className="text-slate-800">{alert.transaction.deviceId}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Analyst Investigation Notes */}
        <div className="graphite-card p-6 space-y-4 flex flex-col h-full">
          <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-2 border-b border-slate-200 pb-3">
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>Analyst Notes</span>
          </h3>

          <div className="flex-1 space-y-3 overflow-y-auto max-h-[350px] pr-1">
            {alert.notes && alert.notes.length > 0 ? (
              alert.notes.map((note: any) => (
                <div key={note.id} className="p-3 bg-white border border-slate-200 rounded-lg text-xs space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span className="font-semibold text-emerald-600">{note.analystName}</span>
                    <span>{new Date(note.createdAt).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-slate-800 leading-relaxed font-sans">{note.note}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 py-6 text-center italic font-mono">No notes added yet</p>
            )}
          </div>

          <form onSubmit={handleAddNote} className="pt-3 border-t border-slate-200 flex space-x-2">
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


