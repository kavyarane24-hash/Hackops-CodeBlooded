import React from 'react';
import { ShieldCheck, TrendingUp } from 'lucide-react';
import './ScoreCard.css';

/**
 * ScoreCard component to visualize the Trust / Risk Score meter
 */
const ScoreCard = ({ score = 785, maxScore = 900, rating = "High Trust" }) => {
  const percentage = Math.round((score / maxScore) * 100);

  // Determine meter color grade
  const getMeterColor = () => {
    if (percentage >= 70) return 'var(--primary-500)';
    if (percentage >= 45) return '#f59e0b';
    return '#e11d48';
  };

  return (
    <div className="card-base score-card">
      <div className="score-header">
        <div>
          <span className="score-subtitle">AI Calculated Score</span>
          <h3 className="score-title">Trust Intelligence Score</h3>
        </div>
        <div className="score-icon-badge">
          <ShieldCheck size={24} />
        </div>
      </div>

      <div className="score-body">
        {/* Semi-circular Gauge Meter Representation */}
        <div className="score-meter-box">
          <svg className="score-circle-svg" viewBox="0 0 100 50">
            <path
              d="M 10,50 A 40,40 0 0,1 90,50"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <path
              d="M 10,50 A 40,40 0 0,1 90,50"
              fill="none"
              stroke={getMeterColor()}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray="126"
              strokeDashoffset={126 - (126 * percentage) / 100}
              className="gauge-progress"
            />
          </svg>
          <div className="score-value-display">
            <span className="current-score">{score}</span>
            <span className="max-score">/ {maxScore}</span>
          </div>
        </div>

        <div className="score-rating-tag">
          <TrendingUp size={16} />
          <span>{rating} • Top 12% in Informal Segment</span>
        </div>
      </div>
    </div>
  );
};

export default ScoreCard;
