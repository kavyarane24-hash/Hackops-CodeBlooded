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
  const borrower = mockBorrowerData;

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

        {/* Quick Underwriting Insights Banner */}
        <div className="card-base decision-banner">
          <div className="decision-info">
            <div className="decision-badge">
              <FileCheck size={20} />
              <span>AI Recommendation: APPROVE LOAN</span>
            </div>
            <h3>Recommended Approval for ₹1,50,000 @ 14.5% p.a.</h3>
            <p>Borrower exhibits top-tier daily transaction velocity with zero supplier defaults across 3 years of trade history.</p>
          </div>
          <Button
            variant="primary"
            size="md"
            icon={ArrowUpRight}
            onClick={() => navigate('/explainability')}
          >
            Review AI Decision Factors
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
