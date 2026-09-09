# TrustLens — AI-Driven Personal Lending Risk & Trust Profiling

[![FastAPI](https://img.shields.io/badge/FastAPI-0.141-009688.svg?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.13-3776AB.svg?style=flat&logo=python)](https://www.python.org/)
[![Scikit-Learn](https://img.shields.io/badge/scikit--learn-1.9.0-F7931E.svg?style=flat&logo=scikit-learn)](https://scikit-learn.org/)
[![Google Gemini API](https://img.shields.io/badge/Gemini_API-2.5_Flash-8E44AD.svg?style=flat&logo=google)](https://aistudio.google.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg?style=flat&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF.svg?style=flat&logo=vite)](https://vitejs.dev/)

> **Problem Statement (PS1):** AI-Driven Personal Lending Risk & Trust Profiling for Informal Lenders  
> **Target:** Hackathon MVP Prototype  
> **One-Line Pitch:** *"TrustLens turns informal borrower information into an explainable 0–100 Trust Score and personalized lending recommendation, helping informal lenders make faster, safer, and more informed decisions."*

---

## 📌 Problem Statement

Informal lenders (small community lenders, local business micro-lenders, peer-to-peer environments) often make lending decisions based on incomplete information, intuition, or personal relationships.

This creates critical risks:
- High borrower default rates
- Fraudulent or inconsistent applications
- Poorly structured repayment terms exceeding borrower capacity
- Lack of explainability regarding why a loan was approved or rejected

**TrustLens** solves this by providing a **transparent, data-driven, and explainable decision-support system** designed to support human judgment rather than replace it.

---

## 🏛️ System Architecture & Data Flow

```text
┌────────────────────────────────────────────────────────┐
│                   REACT FRONTEND (Vite)                │
│  - Borrower Intake Form                                │
│  - 1-Click Demo Presets (Borrowers A, B, C)            │
│  - Interactive Trust Score & Risk Level Dashboard      │
│  - Explainable Risk & Positive Factors Checklist       │
│  - Grounded AI Explanation Box (Gemini LLM)            │
└───────────────────────────┬────────────────────────────┘
                            │ HTTP REST API
                            ▼
┌────────────────────────────────────────────────────────┐
│                    FASTAPI BACKEND                     │
│               (http://localhost:8000)                  │
│                                                        │
│  ┌──────────────────────┐     ┌─────────────────────┐  │
│  │ 1. Random Forest ML  │     │ 3. Gemini LLM       │  │
│  │    (91.9% Accuracy)  │     │    AI Explainer     │  │
│  └──────────┬───────────┘     └──────────▲──────────┘  │
│             │ Default Prob (%)           │             │
│             ▼                            │             │
│  ┌──────────────────────┐                │             │
│  │ 2. 5-Pillar Trust    ├────────────────┘             │
│  │    Engine Rules      │                              │
│  └──────────┬───────────┘                              │
│             │                                          │
│             ▼                                          │
│  ┌──────────────────────┐                              │
│  │ 4. SQLite DB Layer   │ (trustlens.db)               │
│  │    History & Audit   │                              │
│  └──────────────────────┘                              │
└────────────────────────────────────────────────────────┘
```

---

## 🌟 Key Features

1. **Machine Learning Default Risk Assessment:**
   - Trained on 32,500+ credit risk records using a Random Forest Classifier (**91.93% Accuracy, 0.9343 ROC-AUC**).
   - Evaluates key financial drivers: Loan-to-income ratio, annual income, credit history length, prior default status, and loan purpose.

2. **Multi-Pillar 0–100 Trust Score:**
   - Combines ML default probability with a 5-component weighted score:
     - 💵 **Income Stability:** Max 25 pts
     - 📜 **Credit Track Record:** Max 20 pts
     - ⚖️ **Loan Affordability:** Max 20 pts
     - 🛡️ **Repayment History:** Max 20 pts
     - 💼 **Employment Stability:** Max 15 pts

3. **Explainable Risk & Positive Factors:**
   - Automatically extracts data-grounded positive factors (`✓`) and risk factors (`⚠`) without introducing unsupported facts.

4. **Risk & Anomaly Flags Detection:**
   - Triggers warning banners for unusual income-to-loan ratios (>50%), recorded defaults, or profile inconsistencies.

5. **Personalized Lending Recommendations:**
   - Computes safe **Suggested Loan Amount (₹)**, **Suggested Tenure (Months)**, and **Model Confidence Score (%)**.

6. **Grounded Generative AI Explainer:**
   - Integrates `google-genai` (Gemini 2.5 Flash) to generate 2–3 sentence natural language summaries for lenders, with an automatic grounded fallback.

7. **SQLite Audit Trail & Human Decision Logging:**
   - Stores all application evaluations and logs human lender decisions (**Approved**, **Counter Offered**, **Declined**).

---

## 🧪 PRD Demo Scenarios (PRD §12)

The system includes pre-configured 1-click test personas for hackathon evaluation:

| Scenario | Income | Loan Amount | Emp. Tenure | Default? | Expected Outcome | Trust Score |
|---|---|---|---|---|---|---|
| **Borrower A (Low Risk)** | ₹6,00,000 | ₹80,000 | 5 Yrs | No | Low Risk / Approved | ~89 / 100 |
| **Borrower B (Medium Risk)** | ₹3,00,000 | ₹1,00,000 | 2 Yrs | No | Medium Risk / Cautious | ~50 / 100 |
| **Borrower C (High Risk)** | ₹1,50,000 | ₹1,50,000 | 0.8 Yrs | Yes | High Risk / Flagged | ~26 / 100 |

---

## 🛠️ Tech Stack

- **Machine Learning:** Python 3.13, Scikit-Learn, Pandas, NumPy, Joblib, SciPy.
- **Backend Framework:** FastAPI, Uvicorn, Pydantic v2, Python-Multipart, SQLite3.
- **AI & LLM Integration:** `google-genai` (Google Gemini 2.5 Flash API), `python-dotenv`.
- **Frontend App:** React 18, Vite 5, Tailwind CSS, Recharts, Lucide Icons, React Router v6.

---

## 🚀 Quickstart Guide

### Prerequisites
- Python 3.10+
- Node.js 18+ and `npm`

### 1. Clone the Repository
```bash
git clone https://github.com/kavyarane24-hash/Hackops-CodeBlooded.git
cd Hackops-CodeBlooded
```

### 2. Install Python Dependencies & Start FastAPI Backend
```bash
# Install Python packages
pip install -r requirements.txt

# Start the Backend Server (runs on http://localhost:8000)
python run_server.py
```

### 3. Optional: Configure Gemini API Key
Create a `.env` file in the root directory:
```env
GEMINI_API_KEY=your_google_gemini_api_key_here
```
*(If no API key is provided, TrustLens automatically uses its grounded deterministic explainer).*

### 4. Start React Frontend
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
*(Frontend runs on http://localhost:5173)*

---

## 📡 REST API Reference

### Primary Prediction Endpoint: `POST /predict` (or `/api/predict`)

**Request (PRD §8):**
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

**Response (PRD §8):**
```json
{
  "trust_score": 85,
  "risk_level": "LOW",
  "default_probability": 0.23,
  "positive_factors": [
    "Strong annual income base (₹600,000)",
    "Clean repayment history with zero previous defaults",
    "Established credit track record (5 years)"
  ],
  "risk_factors": [
    "No major adverse indicators detected"
  ],
  "recommended_amount": 100000,
  "recommended_tenure": 12,
  "score_breakdown": {
    "income_stability": 22,
    "credit_history": 17,
    "loan_affordability": 17,
    "repayment_history": 20,
    "employment_stability": 12
  },
  "risk_flags": [],
  "model_confidence": 86,
  "ai_explanation": "The borrower exhibits a low repayment risk profile with a strong Trust Score of 85/100...",
  "application_id": 1,
  "latency_seconds": 0.07
}
```

### Additional Endpoints:
- **`GET /api/presets`**: Delivers canonical PRD demo scenarios.
- **`GET /api/history`**: Retrieves past evaluated applications from SQLite DB.
- **`POST /api/decisions`**: Records human lender decision audit log.
- **`GET /api/analytics`**: Retrieves portfolio summary metrics.
- **`GET /api/health`**: Engine health check.

---

## 📁 Repository Structure

```text
Hackops-CodeBlooded/
├── README.md                             # Project documentation
├── prd.md                                # Product Requirements Document (PRD v1.0)
├── requirements.txt                      # Locked Python dependencies
├── run_server.py                          # Application entry point server runner
├── .env.example                          # Environment configuration template
│
├── machine learning/                     # ML & Trust Intelligence Subsystem
│   ├── credit_risk_dataset.csv           # 32,500+ record dataset
│   ├── train.py                          # Model training pipeline (Random Forest)
│   ├── trust_engine.py                   # 5-Pillar Trust Score & Rule Engine
│   ├── predict.py                        # Core predictor interface
│   ├── test_scenarios.py                 # PRD Scenario test suite
│   ├── ml.ipynb                          # Exploratory Data Analysis notebook
│   └── artifacts/                        # Serialized ML pipeline & metadata
│       ├── risk_model_pipeline.joblib
│       └── model_metadata.json
│
├── backend/                              # FastAPI Backend Subsystem
│   └── app/
│       ├── main.py                       # REST API endpoints & route handlers
│       ├── explainer.py                  # Gemini 2.5 Flash LLM AI Explainer
│       └── database.py                   # SQLite database layer (trustlens.db)
│
└── frontend/                             # React + Vite Frontend Subsystem
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── pages/                        # Landing, BorrowerForm, Dashboard, Explainability
        ├── components/                   # ScoreCard, RiskBadge, FactorCard, Sidebar, Navbar
        └── data/mockData.js
```

---

## ⚖️ Responsible AI & Disclaimer

Recommendations provided by TrustLens are decision-support suggestions generated by statistical models and rules, not guaranteed financial outcomes. Final lending decisions remain strictly under human judgment.

---

## 👥 Authors & License

Built for **Hackops CodeBlooded — AI-Driven Personal Lending Risk & Trust Profiling**.
Distributed under the MIT License.
