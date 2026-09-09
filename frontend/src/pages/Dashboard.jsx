import React from 'react';
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

  // Load live evaluation from backend API if available, else fallback to mock data
  const storedEval = sessionStorage.getItem('currentEvaluation');
  const liveData = storedEval ? JSON.parse(storedEval) : null;

  const borrower = {
    ...mockBorrowerData,
    name: liveData?.borrower_name || mockBorrowerData.name,
    trustScore: liveData ? liveData.trust_score : mockBorrowerData.trustScore,
    maxTrustScore: liveData ? 100 : mockBorrowerData.maxTrustScore,
    riskLevel: liveData ? (liveData.risk_level === 'LOW' ? 'Low Risk' : liveData.risk_level === 'MEDIUM' ? 'Medium Risk' : 'High Risk') : mockBorrowerData.riskLevel,
    riskScorePercent: liveData ? Math.round(liveData.default_probability * 100) : mockBorrowerData.riskScorePercent,
    recommendedMaxLoan: liveData ? liveData.recommended_amount : mockBorrowerData.recommendedMaxLoan,
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar Navigation */}
      <Sidebar borrowerName={borrower.name} />

      {/* Main Dashboard Workspace */}
      <main className="dashboard-main">
        {/* Header Bar */}
        <div className="dash-header">
          <div>
            <div className="dash-breadcrumb">TrustLens / Credit Intelligence Overview</div>
            <h1 className="dash-title">Risk Profile & Underwriting Summary</h1>
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
            score={borrower.trustScore}
            maxScore={borrower.maxTrustScore}
            rating="High Trust"
          />

          <div className="card-base metric-card">
            <span className="metric-card-subtitle">Risk Classification</span>
            <div className="metric-badge-container">
              <RiskBadge level={borrower.riskLevel} size="lg" />
            </div>
            <p className="metric-card-subtext">
              Estimated Default Risk: <strong style={{ color: '#059669' }}>{borrower.riskScorePercent}%</strong>
            </p>
          </div>

          <div className="card-base metric-card">
            <span className="metric-card-subtitle">Max Recommended Loan</span>
            <div className="metric-amount-row">
              <IndianRupee size={22} className="rupee-icon" />
              <span className="metric-amount-val">{(borrower.recommendedMaxLoan).toLocaleString('en-IN')}</span>
            </div>
            <p className="metric-card-subtext">
              Requested: ₹{(borrower.requestedAmount).toLocaleString('en-IN')} (Safe headroom)
            </p>
          </div>

          <div className="card-base metric-card">
            <span className="metric-card-subtitle">Suggested Informal Rate</span>
            <div className="metric-amount-row">
              <span className="metric-amount-val">{borrower.suggestedInterestRate}%</span>
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
                <AreaChart data={borrower.monthlyCashflow} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={borrower.trustDimensions}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="Borrower Score" dataKey="score" stroke="#059669" fill="#10b981" fillOpacity={0.4} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Quick Underwriting Insights Banner & Human Decision Actions */}
        <div className="card-base decision-banner" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '1rem' }}>
          <div className="flex items-center justify-between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="decision-info">
              <div className="decision-badge">
                <FileCheck size={20} />
                <span>AI Recommendation: {borrower.riskLevel === 'High Risk' ? 'CAUTION / LOWER AMOUNT' : 'APPROVE LOAN'}</span>
              </div>
              <h3>Recommended Allocation: ₹{(borrower.recommendedMaxLoan).toLocaleString('en-IN')} @ {borrower.suggestedInterestRate}% p.a.</h3>
              <p>{liveData?.ai_explanation || "Borrower exhibits verified cashflow velocity with clean default record."}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              icon={ArrowUpRight}
              onClick={() => navigate('/explainability')}
            >
              Review AI Factors
            </Button>
          </div>

          {/* Human Lender Decision Buttons */}
          <div style={{ paddingTop: '1rem', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase', tracking: '0.05em' }}>Human Lender Decision:</span>
            <Button
              variant="primary"
              size="sm"
              onClick={async () => {
                try {
                  await fetch('/api/decisions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      borrower_name: borrower.name,
                      decision_action: 'APPROVED',
                      approved_amount: borrower.recommendedMaxLoan,
                      approved_tenure: 12,
                      lender_notes: 'Approved based on AI Risk Assessment.'
                    })
                  });
                  alert(`Logged decision: APPROVED for ${borrower.name}`);
                } catch (e) {
                  alert('Recorded APPROVED decision locally.');
                }
              }}
            >
              Approve Loan
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                try {
                  await fetch('/api/decisions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      borrower_name: borrower.name,
                      decision_action: 'COUNTER_OFFERED',
                      approved_amount: borrower.recommendedMaxLoan * 0.8,
                      approved_tenure: 12,
                      lender_notes: 'Counter offered lower loan amount.'
                    })
                  });
                  alert(`Logged decision: COUNTER OFFERED for ${borrower.name}`);
                } catch (e) {
                  alert('Recorded COUNTER OFFER decision locally.');
                }
              }}
            >
              Counter Offer
            </Button>
            <Button
              variant="danger"
              size="sm"
              style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none' }}
              onClick={async () => {
                try {
                  await fetch('/api/decisions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      borrower_name: borrower.name,
                      decision_action: 'DECLINED',
                      lender_notes: 'Declined due to risk evaluation.'
                    })
                  });
                  alert(`Logged decision: DECLINED for ${borrower.name}`);
                } catch (e) {
                  alert('Recorded DECLINED decision locally.');
                }
              }}
            >
              Decline Loan
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
