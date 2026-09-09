import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { IndianRupee, Percent, ArrowUpRight, FileCheck, BrainCircuit, Download } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import ScoreCard from '../components/ScoreCard';
import RiskBadge from '../components/RiskBadge';
import Button from '../components/Button';
import { mockBorrowerData } from '../data/mockData';
import './Dashboard.css';

/**
 * Dashboard Page - Comprehensive Risk & Credit Intelligence Overview
 */
const Dashboard = () => {
  const navigate = useNavigate();
  const [decisionSubmitted, setDecisionSubmitted] = useState(null);

  // Check for live prediction from API in sessionStorage
  const savedPrediction = React.useMemo(() => {
    try {
      const data = sessionStorage.getItem('trustlens_prediction');
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }, []);

  const borrowerName = savedPrediction?.borrower_name || mockBorrowerData.name;
  const trustScore = savedPrediction?.trust_score ?? mockBorrowerData.trustScore;
  const riskLevel = savedPrediction?.risk_level ?? mockBorrowerData.riskLevel;
  const defaultProb = savedPrediction?.default_probability != null 
    ? Math.round(savedPrediction.default_probability * 100) 
    : mockBorrowerData.riskScorePercent;
  const maxLoan = savedPrediction?.recommended_amount ?? mockBorrowerData.recommendedMaxLoan;
  const aiExplanation = savedPrediction?.ai_explanation || "Borrower exhibits strong cashflow velocity with zero historical defaults.";

  const handleDecision = async (action) => {
    try {
      const payload = {
        borrower_name: borrowerName,
        decision_action: action,
        application_id: savedPrediction?.application_id || 1,
        approved_amount: action === 'DECLINED' ? 0 : maxLoan,
        lender_notes: `Lender submitted ${action} decision via TrustLens Dashboard UI.`
      };
      const res = await fetch('/api/decisions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setDecisionSubmitted(action);
      }
    } catch (err) {
      console.error('Failed to submit decision:', err);
      setDecisionSubmitted(action);
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar Navigation */}
      <Sidebar borrowerName={borrowerName} />

      {/* Main Dashboard Workspace */}
      <main className="dashboard-main">
        {/* Header Bar */}
        <div className="dash-header">
          <div>
            <div className="dash-breadcrumb">TrustLens / Credit Intelligence Overview</div>
            <h1 className="dash-title">Risk Profile & Underwriting Summary — {borrowerName}</h1>
          </div>

          <div className="dash-actions">
            <Button
              variant="outline"
              size="sm"
              icon={BrainCircuit}
              onClick={() => navigate('/explainability')}
            >
              View Explainability
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={Download}
              onClick={() => alert("Downloading PDF Risk Assessment Report...")}
            >
              Export Report
            </Button>
          </div>
        </div>

        {/* Top Metric Cards Row */}
        <div className="grid-4 metric-cards-row">
          <ScoreCard
            score={trustScore}
            maxScore={100}
            rating={trustScore >= 80 ? "High Trust" : trustScore >= 60 ? "Moderate Trust" : "Elevated Risk"}
          />

          <div className="card-base metric-card">
            <span className="metric-card-subtitle">Risk Classification</span>
            <div className="metric-badge-container">
              <RiskBadge level={riskLevel} size="lg" />
            </div>
            <p className="metric-card-subtext">
              Estimated Default Risk: <strong style={{ color: riskLevel === 'LOW' ? '#059669' : '#dc2626' }}>{defaultProb}%</strong>
            </p>
          </div>

          <div className="card-base metric-card">
            <span className="metric-card-subtitle">Max Recommended Loan</span>
            <div className="metric-amount-row">
              <IndianRupee size={22} className="rupee-icon" />
              <span className="metric-amount-val">{(maxLoan).toLocaleString('en-IN')}</span>
            </div>
            <p className="metric-card-subtext">
              Recommended Tenure: {savedPrediction?.recommended_tenure || 12} Months
            </p>
          </div>

          <div className="card-base metric-card">
            <span className="metric-card-subtitle">Suggested Informal Rate</span>
            <div className="metric-amount-row">
              <span className="metric-amount-val">{riskLevel === 'LOW' ? '12.5' : riskLevel === 'MEDIUM' ? '16.0' : '22.0'}%</span>
              <Percent size={20} className="percent-icon" />
            </div>
            <p className="metric-card-subtext">
              Standard Informal Market: 24% - 36% p.a.
            </p>
          </div>
        </div>

        {/* Visual Analytics Row (Recharts) */}
        <div className="grid-2 chart-grid-row">
          {/* Chart 1: Cash Flow & Repayment Capacity Trend */}
          <div className="card-base chart-card">
            <div className="chart-header">
              <div>
                <h3 className="chart-title">Monthly Cash Flow & Net Savings Trend</h3>
                <span className="chart-subtitle">Parsed from 6 Months PhonePe & Bahi-Khata Ledgers</span>
              </div>
            </div>

            <div className="chart-container-box">
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={mockBorrowerData.monthlyCashflow} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorInflow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                  <Tooltip formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, '']} />
                  <Area type="monotone" dataKey="inflow" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorInflow)" name="Monthly Revenue (Inflow)" />
                  <Area type="monotone" dataKey="netSavings" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSavings)" name="Net Available Surplus" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Multi-Dimension Trust Radar Chart */}
          <div className="card-base chart-card">
            <div className="chart-header">
              <div>
                <h3 className="chart-title">Trust Dimension Breakdown</h3>
                <span className="chart-subtitle">5 Core Informal Credit Pillars</span>
              </div>
            </div>

            <div className="chart-container-box">
              <ResponsiveContainer width="100%" height={260}>
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={
                  savedPrediction?.score_breakdown ? [
                    { subject: 'Income Stability', score: savedPrediction.score_breakdown.income_stability * 4, fullMark: 100 },
                    { subject: 'Credit History', score: savedPrediction.score_breakdown.credit_history * 5, fullMark: 100 },
                    { subject: 'Affordability', score: savedPrediction.score_breakdown.loan_affordability * 5, fullMark: 100 },
                    { subject: 'Repayment', score: savedPrediction.score_breakdown.repayment_history * 5, fullMark: 100 },
                    { subject: 'Employment', score: savedPrediction.score_breakdown.employment_stability * 6.6, fullMark: 100 }
                  ] : mockBorrowerData.trustDimensions
                }>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="Borrower Score" dataKey="score" stroke="#059669" fill="#10b981" fillOpacity={0.4} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Quick Underwriting Insights & Human Lender Decision Action Banner */}
        <div className="card-base decision-banner" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="decision-info">
            <div className="decision-badge">
              <FileCheck size={20} />
              <span>AI Recommendation: {riskLevel === 'HIGH' ? 'DECLINE OR REQUIRE COLLATERAL' : 'APPROVE LOAN'}</span>
            </div>
            <h3>Recommended Max Loan: ₹{(maxLoan).toLocaleString('en-IN')}</h3>
            <p style={{ marginTop: '0.5rem', lineHeight: '1.5' }}>{aiExplanation}</p>
          </div>

          {decisionSubmitted ? (
            <div style={{ padding: '0.75rem 1rem', borderRadius: '8px', background: '#dcfce7', color: '#166534', fontWeight: 'bold' }}>
              ✓ Decision Recorded: {decisionSubmitted}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Button variant="primary" size="md" icon={ArrowUpRight} onClick={() => handleDecision('APPROVED')}>
                Approve Loan
              </Button>
              <Button variant="outline" size="md" onClick={() => handleDecision('COUNTER_OFFERED')}>
                Counter Offer
              </Button>
              <Button variant="outline" size="md" style={{ borderColor: '#fca5a5', color: '#b91c1c' }} onClick={() => handleDecision('DECLINED')}>
                Decline
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
