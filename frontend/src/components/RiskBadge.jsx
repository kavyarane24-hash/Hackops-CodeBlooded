import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';
import './RiskBadge.css';

/**
 * RiskBadge Component
 * Displays visual risk status pill: 'Low Risk', 'Medium Risk', or 'High Risk'
 */
const RiskBadge = ({ level = "Low Risk", size = "md" }) => {
  const normalizedLevel = level.toLowerCase();

  let riskClass = "risk-low";
  let Icon = CheckCircle2;

  if (normalizedLevel.includes("medium") || normalizedLevel.includes("moderate")) {
    riskClass = "risk-medium";
    Icon = AlertTriangle;
  } else if (normalizedLevel.includes("high")) {
    riskClass = "risk-high";
    Icon = AlertCircle;
  }

  return (
    <div className={`risk-badge ${riskClass} risk-badge-${size}`}>
      <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
      <span>{level}</span>
    </div>
  );
};

export default RiskBadge;
