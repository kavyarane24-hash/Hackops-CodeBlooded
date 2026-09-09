import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Briefcase, Calendar, DollarSign, Wallet, CreditCard,
  Target, History, CheckCircle, AlertCircle, FileText, ArrowRight, ShieldCheck
} from 'lucide-react';
import Input from '../components/Input';
import FileUpload from '../components/FileUpload';
import Button from '../components/Button';
import './BorrowerForm.css';

/**
 * BorrowerForm Component
 * Collects Personal, Financial, Repayment, and Document details using controlled inputs.
 * Validates form fields and logs the consolidated JavaScript data object to the browser console.
 */
const BorrowerForm = () => {
  const navigate = useNavigate();

  // Single JavaScript Object storing all form state
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    employmentType: 'Salaried',
    monthlyIncome: '',
    monthlyExpenses: '',
    existingMonthlyDebt: '',
    requestedLoanAmount: '',
    loanPurpose: '',
    previousLoans: '0',
    onTimePayments: '0',
    latePayments: '0',
    bankStatement: null,
    incomeProof: null
  });

  // Track validation errors for each field
  const [errors, setErrors] = useState({});
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Universal handler for text, number, and select controlled inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    // Clear field error on edit
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Handlers for document file uploads
  const handleFileChange = (field, file) => {
    setFormData((prev) => ({
      ...prev,
      [field]: file
    }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  // Validate form fields
  const validate = () => {
    const newErrors = {};

    // Personal validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }

    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else if (parseInt(formData.age, 10) < 18) {
      newErrors.age = 'Borrower must be at least 18 years old';
    } else if (parseInt(formData.age, 10) > 100) {
      newErrors.age = 'Please enter a valid age';
    }

    if (!formData.employmentType) {
      newErrors.employmentType = 'Employment type is required';
    }

    // Financial validation
    if (!formData.monthlyIncome) {
      newErrors.monthlyIncome = 'Monthly income is required';
    } else if (parseFloat(formData.monthlyIncome) <= 0) {
      newErrors.monthlyIncome = 'Income must be greater than 0';
    }

    if (!formData.monthlyExpenses && formData.monthlyExpenses !== '0') {
      newErrors.monthlyExpenses = 'Monthly expenses are required';
    } else if (parseFloat(formData.monthlyExpenses) < 0) {
      newErrors.monthlyExpenses = 'Expenses cannot be negative';
    }

    if (!formData.existingMonthlyDebt && formData.existingMonthlyDebt !== '0') {
      newErrors.existingMonthlyDebt = 'Existing debt field is required';
    } else if (parseFloat(formData.existingMonthlyDebt) < 0) {
      newErrors.existingMonthlyDebt = 'Debt cannot be negative';
    }

    if (!formData.requestedLoanAmount) {
      newErrors.requestedLoanAmount = 'Requested loan amount is required';
    } else if (parseFloat(formData.requestedLoanAmount) <= 0) {
      newErrors.requestedLoanAmount = 'Loan amount must be greater than 0';
    }

    if (!formData.loanPurpose.trim()) {
      newErrors.loanPurpose = 'Loan purpose is required';
    }

    // Repayment validation
    if (formData.previousLoans < 0) {
      newErrors.previousLoans = 'Cannot be negative';
    }
    if (formData.onTimePayments < 0) {
      newErrors.onTimePayments = 'Cannot be negative';
    }
    if (formData.latePayments < 0) {
      newErrors.latePayments = 'Cannot be negative';
    }

    // Document validation
    if (!formData.bankStatement) {
      newErrors.bankStatement = 'Please upload bank statement document';
    }

    if (!formData.incomeProof) {
      newErrors.incomeProof = 'Please upload income proof document';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      console.log('====================================');
      console.log('TrustLens AI Borrower Form Data Submitted:');
      console.log(formData);
      console.log('====================================');

      setSubmittedSuccess(true);

      // Call backend REST API for live prediction
      try {
        const apiPayload = {
          borrower_name: formData.fullName || "Ramesh Kumar",
          income: parseFloat(formData.monthlyIncome || 50000) * 12,
          employment_years: parseFloat(formData.employmentType === 'Salaried' ? 4 : 2),
          loan_amount: parseFloat(formData.requestedLoanAmount || 150000),
          loan_purpose: formData.loanPurpose || "PERSONAL",
          credit_history_years: parseFloat(formData.previousLoans || 3),
          previous_default: parseInt(formData.latePayments || 0) > 0,
          person_age: parseInt(formData.age || 28)
        };

        const response = await fetch('http://localhost:8000/api/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(apiPayload)
        });

        if (response.ok) {
          const evalResult = await response.json();
          sessionStorage.setItem('currentEvaluation', JSON.stringify(evalResult));
        }
      } catch (err) {
        console.warn("Backend API unavailable, using fallback:", err);
      }

      // Smoothly navigate to AI Analysis Loading animation page
      setTimeout(() => {
        navigate('/loading');
      }, 1000);
    } else {
      console.warn('Form validation failed:', errors);
    }
  };

  const employmentOptions = [
    { label: 'Salaried', value: 'Salaried' },
    { label: 'Self-Employed / Business Owner', value: 'Self-Employed' },
    { label: 'Informal Worker / Micro-Entrepreneur', value: 'Informal Worker' },
    { label: 'Daily Wager / Gig Worker', value: 'Gig Worker' },
    { label: 'Other', value: 'Other' }
  ];

  return (
    <div className="borrower-form-page">
      <div className="form-container">
        {/* Header Title Banner */}
        <div className="form-header">
          <div className="form-badge">
            <ShieldCheck size={16} />
            <span>Informal Lending Intake • Controlled State</span>
          </div>
          <h1 className="form-title">Borrower Risk Profile Application</h1>
          <p className="form-subtitle">
            Please fill in the borrower's personal, financial, repayment, and document details for TrustLens AI scoring.
          </p>
        </div>

        {/* Success Alert Banner */}
        {submittedSuccess && (
          <div className="success-banner card-base">
            <CheckCircle size={24} className="banner-icon" />
            <div>
              <h4>Form Submitted Successfully!</h4>
              <p>Printed single form object to browser console. Redirecting to AI Analysis...</p>
            </div>
          </div>
        )}

        {/* Main Controlled Form */}
        <form className="card-base main-form" onSubmit={handleSubmit} noValidate>
          
          {/* SECTION 1: Personal Details */}
          <div className="form-section">
            <h3 className="section-heading">
              <User size={20} /> 1. Personal Details
            </h3>

            <div className="grid-3">
              <Input
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g. Ramesh Kumar"
                required
                error={errors.fullName}
                icon={User}
              />

              <Input
                label="Age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                placeholder="e.g. 34"
                required
                error={errors.age}
                icon={Calendar}
              />

              <Input
                label="Employment Type"
                name="employmentType"
                type="select"
                options={employmentOptions}
                value={formData.employmentType}
                onChange={handleChange}
                required
                error={errors.employmentType}
                icon={Briefcase}
              />
            </div>
          </div>

          {/* SECTION 2: Financial Details */}
          <div className="form-section">
            <h3 className="section-heading">
              <DollarSign size={20} /> 2. Financial Details
            </h3>

            <div className="grid-3">
              <Input
                label="Monthly Income (₹)"
                name="monthlyIncome"
                type="number"
                value={formData.monthlyIncome}
                onChange={handleChange}
                placeholder="e.g. 45000"
                required
                error={errors.monthlyIncome}
                icon={DollarSign}
              />

              <Input
                label="Monthly Expenses (₹)"
                name="monthlyExpenses"
                type="number"
                value={formData.monthlyExpenses}
                onChange={handleChange}
                placeholder="e.g. 20000"
                required
                error={errors.monthlyExpenses}
                icon={Wallet}
              />

              <Input
                label="Existing Monthly Debt (₹)"
                name="existingMonthlyDebt"
                type="number"
                value={formData.existingMonthlyDebt}
                onChange={handleChange}
                placeholder="e.g. 5000"
                required
                error={errors.existingMonthlyDebt}
                icon={CreditCard}
              />
            </div>

            <div className="grid-2">
              <Input
                label="Requested Loan Amount (₹)"
                name="requestedLoanAmount"
                type="number"
                value={formData.requestedLoanAmount}
                onChange={handleChange}
                placeholder="e.g. 150000"
                required
                error={errors.requestedLoanAmount}
                icon={DollarSign}
              />

              <Input
                label="Loan Purpose"
                name="loanPurpose"
                value={formData.loanPurpose}
                onChange={handleChange}
                placeholder="e.g. Inventory expansion for shop"
                required
                error={errors.loanPurpose}
                icon={Target}
              />
            </div>
          </div>

          {/* SECTION 3: Repayment History */}
          <div className="form-section">
            <h3 className="section-heading">
              <History size={20} /> 3. Repayment History
            </h3>

            <div className="grid-3">
              <Input
                label="Previous Loans Count"
                name="previousLoans"
                type="number"
                value={formData.previousLoans}
                onChange={handleChange}
                placeholder="0"
                error={errors.previousLoans}
                helperText="Total loans taken previously"
                icon={History}
              />

              <Input
                label="On-Time Payments"
                name="onTimePayments"
                type="number"
                value={formData.onTimePayments}
                onChange={handleChange}
                placeholder="0"
                error={errors.onTimePayments}
                helperText="Count of punctual repayments"
                icon={CheckCircle}
              />

              <Input
                label="Late Payments"
                name="latePayments"
                type="number"
                value={formData.latePayments}
                onChange={handleChange}
                placeholder="0"
                error={errors.latePayments}
                helperText="Count of delayed repayments"
                icon={AlertCircle}
              />
            </div>
          </div>

          {/* SECTION 4: Documents Upload */}
          <div className="form-section">
            <h3 className="section-heading">
              <FileText size={20} /> 4. Document Verification
            </h3>

            <div className="grid-2">
              <div className="doc-upload-box">
                <FileUpload
                  label="Bank Statement PDF / Ledger"
                  description="Upload last 6 months bank statement or UPI transactions"
                  accept=".pdf,.csv,.png,.jpg"
                  onFileSelect={(file) => handleFileChange('bankStatement', file)}
                />
                {errors.bankStatement && (
                  <span className="doc-error-msg">{errors.bankStatement}</span>
                )}
              </div>

              <div className="doc-upload-box">
                <FileUpload
                  label="Income Proof / Salary Slip / Shop Invoice"
                  description="Upload salary slip, tax document, or Bahi-Khata ledger image"
                  accept=".pdf,.csv,.jpg,.png"
                  onFileSelect={(file) => handleFileChange('incomeProof', file)}
                />
                {errors.incomeProof && (
                  <span className="doc-error-msg">{errors.incomeProof}</span>
                )}
              </div>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="form-submit-row">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              icon={ArrowRight}
            >
              Submit Application & Log Data Object
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BorrowerForm;
