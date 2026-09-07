import React from 'react';

interface RiskBadgeProps {
  score?: number;
  decision?: string;
  severity?: string;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ score, decision, severity }) => {
  if (score !== undefined) {
    let colorClass = 'badge-approve';
    let label = 'LOW';

    if (score >= 71) {
      colorClass = 'badge-block';
      label = 'HIGH';
    } else if (score >= 31) {
      colorClass = 'badge-review';
      label = 'MEDIUM';
    }

    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono tracking-wide ${colorClass}`}>
        {score} / 100 ({label})
      </span>
    );
  }

  if (decision) {
    let colorClass = 'badge-approve';
    if (decision === 'BLOCK') colorClass = 'badge-block';
    if (decision === 'REVIEW') colorClass = 'badge-review';

    return (
      <span className={`px-2.5 py-0.5 rounded text-xs font-bold tracking-wider ${colorClass}`}>
        {decision}
      </span>
    );
  }

  if (severity) {
    let colorClass = 'badge-approve';
    if (severity === 'CRITICAL' || severity === 'HIGH') colorClass = 'badge-block';
    else if (severity === 'MEDIUM') colorClass = 'badge-review';

    return (
      <span className={`px-2.5 py-0.5 rounded text-[11px] font-extrabold uppercase tracking-wider ${colorClass}`}>
        {severity}
      </span>
    );
  }

  return null;
};
