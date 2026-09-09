import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Zap, LineChart, FileText, ArrowRight, Sparkles, Activity } from 'lucide-react';
import Button from '../components/Button';
import MagicRings from '../components/MagicRings';
import { useTheme } from '../context/ThemeContext';
import './Landing.css';

/**
 * Landing Page - Introduces TrustLens AI platform for informal lending intelligence
 */
const Landing = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const isDark = theme === 'dark';

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-grid">
            {/* Left Content Column */}
            <div className="hero-content">
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
            </div>

            {/* Right Interactive Animation Visual (React Bits MagicRings) */}
            <div className="hero-visual-card">
              <div className="rings-wrapper">
                <MagicRings
                  color={isDark ? '#10b981' : '#059669'}
                  colorTwo={isDark ? '#6366f1' : '#4f46e5'}
                  ringCount={6}
                  speed={1}
                  attenuation={isDark ? 10 : 9}
                  lineThickness={isDark ? 2 : 2.5}
                  baseRadius={0.32}
                  radiusStep={0.08}
                  scaleRate={0.12}
                  opacity={isDark ? 0.95 : 0.85}
                  blur={0}
                  noiseAmount={0.05}
                  rotation={0}
                  ringGap={1.5}
                  fadeIn={0.7}
                  fadeOut={0.5}
                  followMouse={true}
                  mouseInfluence={0.25}
                  hoverScale={1.2}
                  parallax={0.05}
                  clickBurst={true}
                  alphaMode={isDark ? 'luminance' : 'coverage'}
                />
              </div>

              {/* Decorative Floating Overlay Badges */}
              <div className="rings-badge top-left">
                <Activity size={14} className="icon-pulse" />
                <span>Neural Trust Signal</span>
              </div>

              <div className="rings-badge bottom-right">
                <Sparkles size={14} />
                <span>Click & Hover Interactive</span>
              </div>
            </div>
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
