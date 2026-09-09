import React from 'react';
import { FileCheck, Clock, ShieldAlert, ExternalLink } from 'lucide-react';
import './EvidenceCard.css';

/**
 * EvidenceCard Component
 * Displays verified document or informal lending proof items with confidence rating
 */
const EvidenceCard = ({ name, type, status, confidence, date, details }) => {
  const isVerified = status === 'Verified';

  return (
    <div className="card-base evidence-card">
      <div className="evidence-header">
        <div className="evidence-icon-wrapper">
          {isVerified ? (
            <FileCheck className="verified-icon" size={22} />
          ) : (
            <Clock className="pending-icon" size={22} />
          )}
        </div>
        <div className="evidence-title-info">
          <span className="evidence-type">{type}</span>
          <h4 className="evidence-name">{name}</h4>
        </div>
        <div className={`evidence-status-pill ${isVerified ? 'status-verified' : 'status-pending'}`}>
          {status}
        </div>
      </div>

      <p className="evidence-details">{details}</p>

      <div className="evidence-footer">
        <div className="confidence-meter">
          <span className="confidence-label">OCR Match:</span>
          <div className="confidence-bar-bg">
            <div
              className="confidence-bar-fill"
              style={{ width: `${confidence}%` }}
            />
          </div>
          <span className="confidence-val">{confidence}%</span>
        </div>
        <span className="evidence-date">{date}</span>
      </div>
    </div>
  );
};

export default EvidenceCard;
