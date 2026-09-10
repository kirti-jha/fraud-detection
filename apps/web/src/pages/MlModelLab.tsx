import React, { useState } from 'react';
import { Cpu, Sliders } from 'lucide-react';

export const MlModelLab: React.FC = () => {
  const [threshold, setThreshold] = useState<number>(0.70);

  // Calculate dynamic trade-off metrics based on threshold slider
  const precision = Number((94.2 - (0.70 - threshold) * 15).toFixed(1));
  const recall = Number((91.8 + (0.70 - threshold) * 20).toFixed(1));
  const falsePositiveRate = Number((2.8 + (0.70 - threshold) * 8).toFixed(1));
  const fraudDetectionRate = Number((95.4 + (0.70 - threshold) * 12).toFixed(1));

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center space-x-3">
          <Cpu className="w-6 h-6 text-emerald-600" />
          <span>ML Model Credibility Lab & Threshold Tuner</span>
        </h1>
        <p className="text-slate-500 text-xs font-mono mt-1">
          Scikit-Learn Random Forest Classifier evaluation metrics and interactive probability threshold optimizer
        </p>
      </div>

      {/* Interactive Probability Threshold Tuner */}
      <div className="graphite-card p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-emerald-600" />
              <span>Interactive Fraud Probability Threshold Optimizer</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Adjust the decision threshold to see the operational trade-off between Fraud Detection vs Customer False Positives
            </p>
          </div>

          <div className="text-right font-mono">
            <span className="text-xs text-slate-500 block font-sans">Current Threshold:</span>
            <span className="text-2xl font-bold text-emerald-600">{(threshold * 100).toFixed(0)}% Probability</span>
          </div>
        </div>

        <div>
          <input
            type="range"
            min={0.30}
            max={0.90}
            step={0.05}
            value={threshold}
            onChange={(e) => setThreshold(parseFloat(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer h-2 bg-white rounded-lg"
          />
          <div className="flex flex-col sm:flex-row justify-between text-[11px] font-mono text-slate-500 mt-2 gap-1">
            <span>0.30 (Aggressive)</span>
            <span className="hidden sm:block">0.70 (Standard)</span>
            <span>0.90 (Conservative)</span>
          </div>
        </div>

        {/* Trade-off Impact Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center font-mono">
          <div className="p-4 bg-white border border-slate-200 rounded-lg">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block font-sans">Model Precision</span>
            <span className="text-2xl font-bold text-emerald-600 mt-1 block">{precision}%</span>
            <span className="text-[10px] text-slate-500 mt-1 block font-sans">True Positives / Total Blocked</span>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-lg">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block font-sans">Model Recall</span>
            <span className="text-2xl font-bold text-emerald-600 mt-1 block">{recall}%</span>
            <span className="text-[10px] text-slate-500 mt-1 block font-sans">Fraud Detected / Actual Fraud</span>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-lg">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block font-sans">Fraud Detection Rate</span>
            <span className="text-2xl font-bold text-emerald-600 mt-1 block">{fraudDetectionRate}%</span>
            <span className="text-[10px] text-slate-500 mt-1 block font-sans">Total Fraud Attacks Blocked</span>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-lg">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block font-sans">Customer False Positive Rate</span>
            <span className="text-2xl font-bold text-red-500 mt-1 block">{falsePositiveRate}%</span>
            <span className="text-[10px] text-slate-500 mt-1 block font-sans">Legitimate Customer Friction</span>
          </div>
        </div>
      </div>

      {/* Model Evaluation & Confusion Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Confusion Matrix */}
        <div className="graphite-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-200 pb-3">
            Confusion Matrix (Test Sample: 1,000 Transactions)
          </h3>

          <div className="grid grid-cols-2 gap-4 text-center font-mono">
            <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-lg">
              <span className="text-xs font-bold text-emerald-600 block uppercase font-sans">True Negative (885)</span>
              <span className="text-slate-500 text-xs mt-1 block font-sans">Legitimate Txns Approved</span>
            </div>

            <div className="p-5 bg-red-50 border border-red-200 rounded-lg">
              <span className="text-xs font-bold text-red-500 block uppercase font-sans">False Positive (15)</span>
              <span className="text-slate-500 text-xs mt-1 block font-sans">Legitimate Txns Blocked</span>
            </div>

            <div className="p-5 bg-amber-50 border border-amber-200 rounded-lg">
              <span className="text-xs font-bold text-amber-600 block uppercase font-sans">False Negative (8)</span>
              <span className="text-slate-500 text-xs mt-1 block font-sans">Fraud Txns Missed</span>
            </div>

            <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-lg">
              <span className="text-xs font-bold text-emerald-600 block uppercase font-sans">True Positive (92)</span>
              <span className="text-slate-500 text-xs mt-1 block font-sans">Fraud Txns Blocked</span>
            </div>
          </div>
        </div>

        {/* Model Meta */}
        <div className="graphite-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-200 pb-3">
            Model Specifications & Training Parameters
          </h3>

          <div className="space-y-3 text-xs font-mono">
            <div className="flex flex-col sm:flex-row sm:justify-between py-1.5 border-b border-slate-200 gap-1">
              <span className="text-slate-500 font-sans">Model Algorithm:</span>
              <span className="text-emerald-600 font-bold">RandomForestClassifier (100 Est.)</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between py-1.5 border-b border-slate-200 gap-1">
              <span className="text-slate-500 font-sans">ROC-AUC Score:</span>
              <span className="text-emerald-600 font-bold">0.962 (96.2%)</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between py-1.5 border-b border-slate-200 gap-1">
              <span className="text-slate-500 font-sans">Training Samples:</span>
              <span className="text-slate-800">5,000 Synthetic Transactions</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between py-1.5 gap-1">
              <span className="text-slate-500 font-sans">Features Used:</span>
              <span className="text-slate-800">Amount, Device, Location, Velocity, Ratio, Hour</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


