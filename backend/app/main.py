"""
TrustLens - FastAPI Backend Server
Provides REST endpoints for credit risk prediction, Trust Score calculation,
AI explanation, demo scenario presets, and static file serving for UI dashboard.
"""

import os
import sys
from typing import Optional, Dict, Any, List
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel, Field

# Ensure machine learning package is in python path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ML_DIR = os.path.join(BASE_DIR, "machine learning")
if ML_DIR not in sys.path:
    sys.path.insert(0, ML_DIR)

from predict import TrustLensPredictor
from backend.app.explainer import AIExplainer

app = FastAPI(
    title="TrustLens API",
    description="AI-Driven Personal Lending Risk & Trust Profiling System",
    version="1.0.0"
)

# Enable CORS for local development and UI frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize predictor and explainer instances
predictor = TrustLensPredictor(artifacts_dir=os.path.join(ML_DIR, "artifacts"))
explainer = AIExplainer()


# Pydantic Request Models (PRD §8)
class BorrowerRequest(BaseModel):
    borrower_name: str = Field(default="Rahul Sharma", example="Rahul Sharma")
    income: float = Field(..., example=600000, description="Annual income in INR")
    employment_years: float = Field(..., example=4.0, description="Years in current employment")
    loan_amount: float = Field(..., example=100000, description="Requested loan amount in INR")
    loan_purpose: str = Field(default="MEDICAL", example="MEDICAL", description="Loan purpose")
    credit_history_years: float = Field(..., example=5.0, description="Length of credit history in years")
    previous_default: bool = Field(default=False, example=False, description="Has recorded prior default")
    person_age: Optional[int] = Field(default=None, example=28)
    person_home_ownership: Optional[str] = Field(default=None, example="RENT")


# Endpoints
@app.get("/api/health")
def health_check():
    """Health check endpoint."""
    return {
        "status": "online",
        "service": "TrustLens Risk & Trust Intelligence Engine",
        "version": "1.0.0"
    }


@app.get("/api/presets")
def get_presets():
    """Returns PRD §12 canonical demo scenarios for 1-click UI loading."""
    return {
        "borrower_a": {
            "title": "Borrower A — Low Risk",
            "borrower_name": "Rahul Sharma",
            "income": 600000,
            "employment_years": 5,
            "loan_amount": 80000,
            "loan_purpose": "MEDICAL",
            "credit_history_years": 5,
            "previous_default": False,
            "person_age": 28,
            "person_home_ownership": "RENT"
        },
        "borrower_b": {
            "title": "Borrower B — Medium Risk",
            "borrower_name": "Priya Patel",
            "income": 300000,
            "employment_years": 2,
            "loan_amount": 100000,
            "loan_purpose": "PERSONAL",
            "credit_history_years": 2,
            "previous_default": False,
            "person_age": 25,
            "person_home_ownership": "RENT"
        },
        "borrower_c": {
            "title": "Borrower C — High Risk",
            "borrower_name": "Amit Kumar",
            "income": 150000,
            "employment_years": 0.8,
            "loan_amount": 150000,
            "loan_purpose": "DEBTCONSOLIDATION",
            "credit_history_years": 2,
            "previous_default": True,
            "person_age": 24,
            "person_home_ownership": "RENT"
        }
    }


@app.post("/api/predict")
def predict_risk(request: BorrowerRequest):
    """
    Core Prediction Endpoint (PRD §8)
    Analyzes borrower data, calculates Trust Score, extracts factors, and generates recommendations.
    """
    try:
        borrower_data = request.model_dump()
        result = predictor.predict(borrower_data)
        
        # Generate grounded AI Explanation using Gemini or fallback
        ai_exp = explainer.generate_explanation(
            trust_score=result["trust_score"],
            risk_level=result["risk_level"],
            default_probability=result["default_probability"],
            positive_factors=result["positive_factors"],
            risk_factors=result["risk_factors"],
            recommended_amount=result["recommended_amount"],
            recommended_tenure=result["recommended_tenure"]
        )
        
        result["ai_explanation"] = ai_exp
        result["borrower_name"] = request.borrower_name
        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")


# Serve Frontend Web App
FRONTEND_DIR = os.path.join(BASE_DIR, "frontend")
if os.path.exists(FRONTEND_DIR):
    app.mount("/static", StaticFiles(directory=FRONTEND_DIR), name="static")

    @app.get("/")
    def read_root():
        index_path = os.path.join(FRONTEND_DIR, "index.html")
        if os.path.exists(index_path):
            return FileResponse(index_path)
        return {"message": "TrustLens API is running. Add frontend/index.html to view UI."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
