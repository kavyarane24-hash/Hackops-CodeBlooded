# TrustLens — Product Requirements Document (PRD)

**Product:** TrustLens  
**Problem Statement:** PS1 — AI-Driven Personal Lending Risk & Trust Profiling  
**Version:** 1.0  
**Target:** Hackathon MVP

---

## 1. Product Overview

TrustLens is an AI-powered lending decision-support platform designed for informal lenders.

It analyzes borrower information, evaluates repayment risk, generates a **Trust Score**, identifies positive and negative risk factors, and provides a **personalized lending recommendation with an explanation**.

The system is designed to **support human decision-making rather than replace it**.

### Core Flow

```text
Borrower Information
        ↓
Data Processing
        ↓
Risk Analysis
        ↓
Trust Score
        ↓
Risk Factors
        ↓
Personalized Recommendation
        ↓
Explainable Decision Dashboard
```

---

## 2. Problem Statement

Informal lenders may make lending decisions using incomplete information, personal relationships, intuition, or limited financial history.

This can create risks such as:

- Borrower default
- Fraudulent or inconsistent applications
- Poor repayment decisions
- Inconsistent lending decisions
- Difficulty understanding why a borrower was approved or rejected

TrustLens addresses this by providing a **simple, transparent, and data-driven decision-support system**.

---

## 3. Product Goal

TrustLens should allow a lender to:

1. Enter borrower information.
2. Automatically analyze the borrower's financial profile.
3. Estimate repayment/default risk.
4. Generate a Trust Score.
5. Explain the major factors affecting the score.
6. Recommend a suitable lending amount and tenure.
7. Make the final lending decision with human judgment.

---

## 4. Target User

### Primary User

**Informal Lender**

Examples:

- Small community lenders
- Local lending groups
- Individual lenders
- Small business owners providing loans
- Peer-to-peer or community lending environments

### User Need

> "I want to quickly understand whether this borrower represents a reasonable lending risk and what loan terms I should consider, without relying only on intuition."

---

## 5. MVP Features

### 5.1 Borrower Profile

The lender enters:

| Field | Example |
|---|---|
| Borrower Name | Rahul Sharma |
| Annual Income | ₹6,00,000 |
| Employment Length | 4 years |
| Loan Amount | ₹1,00,000 |
| Loan Purpose | Medical |
| Credit History | 5 years |
| Previous Default | No |

---

### 5.2 Risk Assessment Engine

The system analyzes borrower information using a machine-learning model.

#### Output

```text
Default Probability: 18%

Risk Level: LOW
```

#### Prototype Risk Levels

| Estimated Default Probability | Risk Level |
|---|---|
| 0–30% | Low |
| 30–60% | Medium |
| 60–100% | High |

> These thresholds are prototype-defined and are not intended to represent regulatory or industry standards.

---

### 5.3 Trust Score

TrustLens converts multiple borrower indicators into a simple **0–100 Trust Score**.

Example:

```text
              TRUST SCORE

                  82
                 /100

              LOW RISK
```

#### Example Score Components

```text
Income Stability       20/25
Credit History         18/20
Loan Affordability     17/20
Repayment History      15/20
Employment Stability   12/15
                       -----
                       82/100
```

The weights should be configurable within the prototype.

---

### 5.4 Explainable Risk Factors

The system should answer:

> **"Why did TrustLens give this score?"**

#### Positive Factors

```text
✓ Stable income
✓ 5-year credit history
✓ No previous default
✓ Relatively affordable loan request
```

#### Risk Factors

```text
⚠ Limited repayment history
⚠ High monthly repayment burden
```

The system must **not invent reasons that are unsupported by available borrower data**.

---

### 5.5 Personalized Lending Recommendation

Instead of only showing a risk label, TrustLens provides a suggested lending configuration.

Example:

```text
RECOMMENDATION

Suggested Loan Amount
₹80,000

Suggested Tenure
12 months

Risk Level
LOW

Model Confidence
87%
```

> Recommendations are decision-support suggestions, not guaranteed approvals or financial advice.

---

### 5.6 AI Explanation

An LLM can convert structured model outputs into simple language.

#### Input to AI

```text
Trust Score: 82
Risk Level: Low
Default Probability: 18%

Positive:
- Stable income
- No previous default
- Good credit history

Risk:
- Moderate repayment burden
```

#### Example Generated Explanation

> "The borrower shows relatively low estimated repayment risk, supported by stable income, a positive credit history, and no recorded previous default. The requested loan should still be evaluated against the borrower's expected repayment burden."

The AI explanation must remain grounded in the structured model output and must not introduce unsupported facts.

---

### 5.7 Lender Dashboard

The main dashboard should contain:

```text
┌─────────────────────────────────────────┐
│              TRUSTLENS                  │
│                                         │
│  Rahul Sharma                           │
│                                         │
│  TRUST SCORE          RISK LEVEL        │
│      82/100             LOW             │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  DEFAULT PROBABILITY                    │
│       18%                               │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  WHY THIS SCORE?                        │
│                                         │
│  ✓ Stable income                        │
│  ✓ Good credit history                  │
│  ✓ No previous default                  │
│  ⚠ Moderate repayment burden            │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  RECOMMENDATION                         │
│                                         │
│  ₹80,000 | 12 Months                    │
│                                         │
│             [ VIEW ANALYSIS ]            │
└─────────────────────────────────────────┘
```

---

### 5.8 Fraud / Anomaly Indicators

For the hackathon MVP, TrustLens should use lightweight **Risk Flags** rather than attempting to build a complete fraud-investigation system.

Example:

```text
RISK FLAGS

⚠ Income-to-loan ratio unusually high
⚠ Previous default recorded
⚠ Inconsistent borrower information
```

This provides a risk-intelligence component while keeping the MVP achievable.

---

## 6. ML Architecture

### Recommended Model

Start with a **Random Forest Classifier**.

### Pipeline

```text
Dataset
   ↓
Data Cleaning
   ↓
Categorical Encoding
   ↓
Train/Test Split
   ↓
Random Forest
   ↓
Probability Prediction
   ↓
Risk Classification
```

### Dataset

Recommended hackathon dataset:

**Credit Risk Dataset**

Useful variables include:

- Income
- Employment length
- Loan amount
- Loan purpose
- Loan grade
- Interest rate
- Loan-to-income ratio
- Previous default
- Credit history

---

## 7. System Architecture

```text
                    ┌──────────────┐
                    │   FRONTEND   │
                    │ React / HTML │
                    └──────┬───────┘
                           │
                           │ API
                           ↓
                    ┌──────────────┐
                    │   BACKEND    │
                    │   FastAPI    │
                    └──────┬───────┘
                           │
              ┌────────────┴────────────┐
              ↓                         ↓
       ┌──────────────┐         ┌──────────────┐
       │ ML Risk Model│         │ AI Explainer │
       │ Random Forest│         │     LLM      │
       └──────┬───────┘         └──────────────┘
              │
              ↓
       ┌──────────────┐
       │ Trust Engine │
       └──────┬───────┘
              │
              ↓
       ┌──────────────┐
       │ Recommendation│
       └──────┬───────┘
              │
              ↓
       ┌──────────────┐
       │   Dashboard  │
       └──────────────┘
```

---

## 8. API Requirements

### Endpoint

```text
POST /predict
```

### Request

```json
{
  "income": 600000,
  "employment_years": 4,
  "loan_amount": 100000,
  "loan_purpose": "medical",
  "credit_history_years": 5,
  "previous_default": false
}
```

### Response

```json
{
  "trust_score": 82,
  "risk_level": "LOW",
  "default_probability": 0.18,
  "risk_factors": [
    "Moderate repayment burden"
  ],
  "positive_factors": [
    "Stable income",
    "No previous default"
  ],
  "recommended_amount": 80000,
  "recommended_tenure": 12
}
```

---

## 9. Non-Functional Requirements

### Simplicity
A lender should understand the result within seconds.

### Explainability
Every major recommendation should have understandable supporting factors.

### Performance
Target normal prediction response time:

**< 3 seconds**

### Transparency
Clearly distinguish between:

- Model prediction
- Trust Score
- AI-generated explanation
- Final human decision

### Responsible AI
The system should avoid presenting predictions as guaranteed outcomes.

---

## 10. Out of Scope for MVP

The following are intentionally excluded from the hackathon MVP:

- Banking integration
- Real credit-bureau integration
- Payment gateway
- Real loan disbursement
- Complex deep-learning models
- Full-scale fraud investigation
- Production authentication
- Mobile application
- Large-scale production database infrastructure

These can be presented as future enhancements.

---

## 11. Team Responsibilities

### Member 1 — ML

```text
Dataset
   ↓
Preprocessing
   ↓
ML Model
   ↓
Default Probability
   ↓
Trust Score
   ↓
Risk Factors
```

**Deliverable:** Trained model and prediction logic.

---

### Member 2 — Backend

```text
Frontend Request
       ↓
     API
       ↓
 ML Model
       ↓
Trust Engine
       ↓
AI Explanation
       ↓
 JSON Response
```

**Deliverable:** Working `/predict` API.

---

### Member 3 — Frontend

Build:

```text
Landing Page
     ↓
Borrower Form
     ↓
Loading Screen
     ↓
Risk Dashboard
     ↓
Explanation
     ↓
Recommendation
```

**Deliverable:** Working UI connected to the backend.

---

### Product / Integration Lead

Responsibilities:

- Keep ML, backend, and frontend aligned.
- Define and validate user flows.
- Prepare demo scenarios.
- Check that model outputs are correctly displayed.
- Prepare the presentation and final demo.
- Ensure claims made during judging are supported by the prototype.

---

## 12. Demo Scenarios

Prepare at least three sample borrowers.

### Borrower A — Low Risk

```text
High income
Stable employment
Small loan
No previous default
```

Expected outcome:

```text
Low Risk
High Trust Score
Positive Recommendation
```

### Borrower B — Medium Risk

```text
Moderate income
Moderate loan
Limited credit history
```

Expected outcome:

```text
Medium Risk
Moderate Trust Score
Cautious Recommendation
```

### Borrower C — High Risk

```text
Low income
Large loan
Previous default
High repayment burden
```

Expected outcome:

```text
High Risk
Lower Trust Score
More Conservative Recommendation
```

---

## 13. User Journey

```text
1. Lender opens TrustLens
            ↓
2. Enters borrower information
            ↓
3. Clicks "Analyze"
            ↓
4. System processes the borrower
            ↓
5. ML model estimates risk
            ↓
6. Trust Engine calculates Trust Score
            ↓
7. System identifies key risk factors
            ↓
8. Recommendation engine generates suggested terms
            ↓
9. AI generates an explanation
            ↓
10. Lender reviews dashboard
            ↓
11. Lender makes final decision
```

---

## 14. Success Criteria

The MVP is successful if a judge can:

1. Enter borrower information.
2. Click **Analyze**.
3. Receive a Trust Score.
4. See Low/Medium/High risk.
5. Understand why the score was generated.
6. See a personalized recommendation.
7. Understand that the final decision remains with the lender.

---

## 15. Future Scope

Potential future improvements include:

- Alternative financial data
- Transaction history
- Community/network trust signals
- Advanced fraud detection
- Historical repayment tracking
- Portfolio-level lender analytics
- Loan monitoring
- Explainable AI reports
- Mobile application
- Continuous risk monitoring
- Feedback-based model improvement

---

## 16. One-Line Product Pitch

> **"TrustLens turns borrower information into an explainable Trust Score and personalized lending recommendation, helping informal lenders make faster, safer, and more informed decisions."**

---

## 17. Hackathon MVP Priority

The primary goal is to make one complete and reliable flow work:

```text
INPUT
  ↓
AI / ML ANALYSIS
  ↓
TRUST SCORE
  ↓
RISK LEVEL
  ↓
RECOMMENDATION
  ↓
EXPLANATION
  ↓
DASHBOARD
```

**Prioritize a polished end-to-end prototype over adding a large number of disconnected features.**
