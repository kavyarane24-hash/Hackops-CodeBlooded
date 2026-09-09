import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BrainCircuit, CheckCircle2, AlertTriangle, ShieldCheck, ArrowLeft, Lightbulb } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import FactorCard from '../components/FactorCard';
import EvidenceCard from '../components/EvidenceCard';
import Button from '../components/Button';
import { mockBorrowerData } from '../data/mockData';
import './Explainability.css';

/**
 * Explainability Page - Deep-dive breakdown of positive/negative AI score factors & verified evidence
 */
const Explainability = () => {
  const navigate = useNavigate();
  
  const storedEval = sessionStorage.getItem('currentEvaluation');
  const liveData = storedEval ? JSON.parse(storedEval) : null;
  const borrower = mockBorrowerData;

  const positiveFactors = borrower.factors.filter(f => f.impact === 'positive');
  const negativeFactors = borrower.factors.filter(f => f.impact === 'negative');

  return (
    <div className="dashboard-layout">
      {/* Sidebar Navigation */}
      <Sidebar borrowerName={borrower.name} />

      {/* Main Workspace */}
      <main className="dashboard-main">
        {/* Header Bar */}
        <div className="dash-header">
          <div>
            <div className="dash-breadcrumb">TrustLens / AI Decision Model</div>
            <h1 className="dash-title">Explainable Trust & Risk Intelligence</h1>
          </div>

          <div className="dash-actions">
            <Button
              variant="outline"
              size="sm"
              icon={ArrowLeft}
              onClick={() => navigate('/dashboard')}
            >
              Back to Overview
            </Button>
          </div>
        </div>

        {/* Explainability Model Intro Banner */}
        <div className="card-base explain-intro-card">
          <div className="explain-icon-box">
            <BrainCircuit size={28} />
          </div>
          <div className="explain-intro-text">
            <h3>SHAP Factor & Feature Weight Matrix</h3>
            <p>
              TrustLens AI breaks down the credit score calculation into verifiable financial & social signals. No opaque black-box scoring.
            </p>
          </div>
        </div>

        {/* Live Generative AI Explanation Banner if Available */}
        {liveData?.ai_explanation && (
          <div className="card-base explain-intro-card" style={{ marginTop: '1rem', borderLeft: '4px solid #0284c7', background: 'linear-gradient(to right, #f0f9ff, #ffffff)' }}>
            <div className="explain-icon-box" style={{ background: '#0284c7', color: '#ffffff' }}>
              <BrainCircuit size={28} />
            </div>
            <div className="explain-intro-text">
              <h3 style={{ color: '#0369a1' }}>Live Generative AI Decision Summary</h3>
              <p style={{ fontStyle: 'italic', marginTop: '0.25rem', color: '#1e293b' }}>
                "{liveData.ai_explanation}"
              </p>
            </div>
          </div>
        )}

        {/* Factors Breakdown Section (Positive vs. Negative Drivers) */}
        <div className="grid-2 factors-section">
          {/* Positive Score Drivers */}
          <div className="factor-column">
            <div className="column-header">
              <CheckCircle2 className="col-icon-positive" size={20} />
              <h3>Positive Trust Drivers ({positiveFactors.length})</h3>
            </div>
            <div className="factor-list">
              {positiveFactors.map((factor) => (
                <FactorCard
                  key={factor.id}
                  title={factor.title}
                  impact={factor.impact}
                  points={factor.points}
                  description={factor.description}
                  category={factor.category}
                />
              ))}
            </div>
          </div>

          {/* Negative / Risk Drivers */}
          <div className="factor-column">
            <div className="column-header">
              <AlertTriangle className="col-icon-negative" size={20} />
              <h3>Risk Mitigators & Drag ({negativeFactors.length})</h3>
            </div>
            <div className="factor-list">
              {negativeFactors.map((factor) => (
                <FactorCard
                  key={factor.id}
                  title={factor.title}
                  impact={factor.impact}
                  points={factor.points}
                  description={factor.description}
                  category={factor.category}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Verified Evidence Documents Section */}
        <div className="evidence-section">
          <div className="section-title-row">
            <ShieldCheck size={22} className="shield-icon" />
            <h2>Verified Informal Evidence & Ledger Audit</h2>
          </div>

          <div className="grid-2 evidence-grid">
            {borrower.evidence.map((item) => (
              <EvidenceCard
                key={item.id}
                name={item.name}
                type={item.type}
                status={item.status}
                confidence={item.confidence}
                date={item.date}
                details={item.details}
              />
            ))}
          </div>
        </div>

        {/* Risk Mitigation Guidance for Lender & Borrower */}
        <div className="card-base advice-card">
          <div className="advice-header">
            <Lightbulb size={24} className="advice-icon" />
            <div>
              <h3>AI Risk Mitigation Advice for Micro-Lenders</h3>
              <span className="advice-sub">Actionable steps to lower default probability further</span>
            </div>
          </div>

          <ul className="advice-list">
            <li>Structure repayment in bi-weekly micro-installments matching daily UPI cash inflow.</li>
            <li>Incentivize prompt repayment with a 1.5% interest rebate upon completion of 6 consecutive timely payments.</li>
            <li>Conduct quarterly Bahi-Khata ledger sync via TrustLens OCR scanner app.</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default Explainability;
