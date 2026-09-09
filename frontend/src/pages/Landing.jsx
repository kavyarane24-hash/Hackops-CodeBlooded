import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Zap, LineChart, FileText, ArrowRight, CheckCircle2 } from 'lucide-react';
import Button from '../components/Button';
import './Landing.css';

/**
 * Landing Page - Introduces TrustLens AI platform for informal lending intelligence
 */
const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-badge">
            <ShieldCheck size={16} />
            <span>AI-Powered Credit Intelligence for Informal Lending</span>
          </div>

          <h1 className="hero-title">
            Unlock Financial Access for <span className="gradient-text">Unbanked Micro-Borrowers</span>
          </h1>

          <p className="hero-subtitle">
            TrustLens AI analyzes informal cash flows, UPI transactions, physical Bahi-Khata ledgers, and trade supplier vouching to generate transparent, explainable trust scores in seconds.
          </p>

          <div className="hero-cta-group">
            <Button
              variant="primary"
              size="lg"
              icon={ArrowRight}
              onClick={() => navigate('/apply')}
            >
              Start Trust Evaluation
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/dashboard')}
            >
              View Sample Dashboard
            </Button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="metrics-banner grid-3">
            <div className="metric-item">
              <span className="metric-number">92%</span>
              <span className="metric-label">Accuracy on Unbanked Data</span>
            </div>
            <div className="metric-item">
              <span className="metric-number">&lt; 15s</span>
              <span className="metric-label">AI Parse & Scoring Speed</span>
            </div>
            <div className="metric-item">
              <span className="metric-number">100%</span>
              <span className="metric-label">Explainable Risk Factors</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section className="features-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Designed for Informal Micro-Lenders & NBCs</h2>
            <p className="section-desc">Traditional credit scores miss 80% of informal commerce data. TrustLens fills the gap.</p>
          </div>

          <div className="features-grid grid-3">
            <div className="card-base feature-card">
              <div className="feature-icon bg-emerald">
                <FileText size={26} />
              </div>
              <h3 className="feature-title">Multimodal Ledger Ingestion</h3>
              <p className="feature-text">
                Parse UPI transaction PDFs, WhatsApp payment screenshots, handwritten Bahi-Khata books, and shop invoices effortlessly.
              </p>
            </div>

            <div className="card-base feature-card">
              <div className="feature-icon bg-indigo">
                <Zap size={26} />
              </div>
              <h3 className="feature-title">Real-Time Risk Intelligence</h3>
              <p className="feature-text">
                Calculates risk metrics, maximum safe loan limits, and recommended informal interest rates automatically.
              </p>
            </div>

            <div className="card-base feature-card">
              <div className="feature-icon bg-teal">
                <LineChart size={26} />
              </div>
              <h3 className="feature-title">Transparent Explainability</h3>
              <p className="feature-text">
                No black boxes. Clear SHAP factor breakdown highlighting exact reasons for approval or credit score adjustments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="cta-banner-section">
        <div className="cta-box">
          <h2>Ready to Evaluate a Borrower?</h2>
          <p>Input informal data or ledger files to generate an instant AI trust assessment.</p>
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/apply')}
          >
            Create Borrower Profile
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Landing;
