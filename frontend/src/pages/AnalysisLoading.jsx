import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cpu, CheckCircle2, Loader2, FileSpreadsheet, ShieldCheck, BrainCircuit } from 'lucide-react';
import './AnalysisLoading.css';

/**
 * AnalysisLoading Page - Animated loading screen simulating AI risk intelligence pipeline
 */
const AnalysisLoading = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { title: "Parsing Informal Data", desc: "Extracting transaction streams from PhonePe UPI ledgers...", icon: FileSpreadsheet },
    { title: "Analyzing Cash Flow Consistency", desc: "Evaluating revenue seasonality & monthly net savings...", icon: Cpu },
    { title: "Verifying Supplier Vouching", desc: "Cross-checking wholesale trade credit reputation...", icon: ShieldCheck },
    { title: "Running SHAP Explainability Model", desc: "Mapping trust score drivers & risk mitigation metrics...", icon: BrainCircuit }
  ];

  useEffect(() => {
    // Progress through steps sequentially
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          // Redirect to Dashboard after completing pipeline simulation
          setTimeout(() => navigate('/dashboard'), 800);
          return prev;
        }
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="analysis-loading-page">
      <div className="loading-card card-base">
        {/* Animated AI Brain Icon Header */}
        <div className="ai-icon-container">
          <div className="ai-pulse-ring" />
          <BrainCircuit size={48} className="ai-main-icon" />
        </div>

        <h2 className="loading-title">Analyzing Borrower Risk Profile</h2>
        <p className="loading-subtitle">
          TrustLens AI is evaluating informal credit indicators for <strong style={{ color: 'var(--primary-600)' }}>Ramesh Kumar</strong>...
        </p>

        {/* Progress Bar */}
        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Step Indicator Checklist */}
        <div className="steps-checklist">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isDone = index < currentStep;
            const isCurrent = index === currentStep;

            return (
              <div
                key={index}
                className={`step-item ${isDone ? 'done' : ''} ${isCurrent ? 'active' : ''}`}
              >
                <div className="step-status-icon">
                  {isDone ? (
                    <CheckCircle2 size={20} className="icon-success" />
                  ) : isCurrent ? (
                    <Loader2 size={20} className="icon-spinning" />
                  ) : (
                    <div className="icon-bullet" />
                  )}
                </div>

                <div className="step-text-content">
                  <div className="step-title-row">
                    <span className="step-name">{step.title}</span>
                    {isCurrent && <span className="processing-tag">Processing...</span>}
                  </div>
                  <span className="step-desc">{step.desc}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AnalysisLoading;
