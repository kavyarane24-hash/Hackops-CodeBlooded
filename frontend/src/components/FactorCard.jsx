import React from 'react';
import { ArrowUpRight, ArrowDownRight, Tag } from 'lucide-react';
import './FactorCard.css';

/**
 * FactorCard Component
 * Displays positive or negative drivers influencing the borrower's trust score
 */
const FactorCard = ({ title, impact = 'positive', points, description, category }) => {
  const isPositive = impact === 'positive';

  return (
    <div className={`factor-card ${isPositive ? 'factor-positive' : 'factor-negative'}`}>
      <div className="factor-header">
        <div className="factor-title-area">
          <span className="factor-category">
            <Tag size={12} />
            {category}
          </span>
          <h4 className="factor-title">{title}</h4>
        </div>
        <div className={`factor-points-pill ${isPositive ? 'pill-positive' : 'pill-negative'}`}>
          {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          <span>{points}</span>
        </div>
      </div>
      <p className="factor-desc">{description}</p>
    </div>
  );
};

export default FactorCard;
