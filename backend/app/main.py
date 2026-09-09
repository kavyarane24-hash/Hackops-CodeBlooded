"""
TrustLens - Backend API Engine
Strictly implements Product Requirements Document (PRD v1.0) specifications:
- Endpoint: POST /predict & POST /api/predict (PRD §8)
- End-to-End Pipeline: Request -> ML Model -> Trust Engine -> AI Explainer -> Response (PRD §11)
- Latency Target: < 3 seconds (PRD §9)
"""

import os
import sys
import time
from typing import Optional, Dict, Any, List
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel, Field

# Ensure machine learning directory is in Python path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ML_DIR = os.path.join(BASE_DIR, "machine learning")
if ML_DIR not in sys.path:
    sys.path.insert(0, ML_DIR)

from predict import TrustLensPredictor
from backend.app.explainer import AIExplainer

app = FastAPI(
    title="TrustLens API — AI-Driven Personal Lending Risk & Trust Profiling",
    description="Decision-support engine for informal lenders as specified in PRD v1.0 (PS1)",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for frontend integration (PRD §7)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize trained ML predictor and AI explainer instances
predictor = TrustLensPredictor(artifacts_dir=os.path.join(ML_DIR, "artifacts"))
explainer = AIExplainer()


# PRD §8 Request Model
class BorrowerPredictRequest(BaseModel):
    income: float = Field(..., example=600000, description="Borrower annual income in INR (PRD §5.1)")
    employment_years: float = Field(..., example=4.0, description="Employment length in years (PRD §5.1)")
    loan_amount: float = Field(..., example=100000, description="Requested loan amount in INR (PRD §5.1)")
    loan_purpose: str = Field(default="medical", example="medical", description="Loan purpose (PRD §5.1)")
    credit_history_years: float = Field(..., example=5.0, description="Credit history length in years (PRD §5.1)")
    previous_default: bool = Field(default=False, example=False, description="Previous default on file (PRD §5.1)")
    
    # Optional extensions for UI customization
    borrower_name: Optional[str] = Field(default="Rahul Sharma", example="Rahul Sharma")
    person_age: Optional[int] = Field(default=None, example=28)
    person_home_ownership: Optional[str] = Field(default=None, example="RENT")


# Health Check Endpoint
@app.get("/health")
@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "service": "TrustLens Risk & Trust Intelligence Engine",
        "version": "1.0.0",
        "prd_version": "1.0"
    }


# Demo Scenario Presets Endpoint (PRD §12)
@app.get("/presets")
@app.get("/api/presets")
def get_demo_presets():
    """Returns PRD §12 canonical demo scenarios for 1-click evaluation."""
    return {
        "borrower_a": {
            "title": "Borrower A — Low Risk (PRD §12)",
            "borrower_name": "Rahul Sharma",
            "income": 600000,
            "employment_years": 5,
            "loan_amount": 80000,
            "loan_purpose": "medical",
            "credit_history_years": 5,
            "previous_default": False,
            "person_age": 28,
            "person_home_ownership": "RENT"
        },
        "borrower_b": {
            "title": "Borrower B — Medium Risk (PRD §12)",
            "borrower_name": "Priya Patel",
            "income": 300000,
            "employment_years": 2,
            "loan_amount": 100000,
            "loan_purpose": "personal",
            "credit_history_years": 2,
            "previous_default": False,
            "person_age": 25,
            "person_home_ownership": "RENT"
        },
        "borrower_c": {
            "title": "Borrower C — High Risk (PRD §12)",
            "borrower_name": "Amit Kumar",
            "income": 150000,
            "employment_years": 0.8,
            "loan_amount": 150000,
            "loan_purpose": "debtconsolidation",
            "credit_history_years": 2,
            "previous_default": True,
            "person_age": 24,
            "person_home_ownership": "RENT"
        }
    }


# Handler function logic matching PRD §8 API Specification
def process_prediction(request_data: BorrowerPredictRequest) -> Dict[str, Any]:
    start_time = time.time()
    
    # 1. Prepare raw dict payload
    payload = request_data.model_dump()
    
    # 2. Invoke ML Model & Trust Engine
    result = predictor.predict(payload)
    
    # 3. Invoke Grounded AI Explainer
    ai_exp = explainer.generate_explanation(
        trust_score=result["trust_score"],
        risk_level=result["risk_level"],
        default_probability=result["default_probability"],
        positive_factors=result["positive_factors"],
        risk_factors=result["risk_factors"],
        recommended_amount=result["recommended_amount"],
        recommended_tenure=result["recommended_tenure"]
    )
    
    elapsed = round(time.time() - start_time, 3)
    
    # Construct exact PRD §8 JSON Response Payload
    return {
        "trust_score": result["trust_score"],
        "risk_level": result["risk_level"],
        "default_probability": result["default_probability"],
        "risk_factors": result["risk_factors"],
        "positive_factors": result["positive_factors"],
        "recommended_amount": result["recommended_amount"],
        "recommended_tenure": result["recommended_tenure"],
        
        # Additional decision-support metadata for dashboard
        "score_breakdown": result["score_breakdown"],
        "risk_flags": result["risk_flags"],
        "model_confidence": result["model_confidence"],
        "ai_explanation": ai_exp,
        "borrower_name": request_data.borrower_name,
        "latency_seconds": elapsed
    }


# Exact PRD §8 Endpoint: POST /predict
@app.post("/predict")
def predict_prd_endpoint(req: BorrowerPredictRequest):
    """PRD §8 Primary Endpoint: POST /predict"""
    try:
        return process_prediction(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction engine error: {str(e)}")


# Alias Endpoint: POST /api/predict
@app.post("/api/predict")
def predict_api_endpoint(req: BorrowerPredictRequest):
    """Alias Endpoint: POST /api/predict"""
    try:
        return process_prediction(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction engine error: {str(e)}")


# Serve Frontend UI Static Assets & Dashboard
FRONTEND_DIR = os.path.join(BASE_DIR, "frontend")
if os.path.exists(FRONTEND_DIR):
    app.mount("/static", StaticFiles(directory=FRONTEND_DIR), name="static")

    @app.get("/")
    def read_root():
        index_path = os.path.join(FRONTEND_DIR, "index.html")
        if os.path.exists(index_path):
            return FileResponse(index_path)
        return {"message": "TrustLens API Engine active. Frontend static files missing."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
