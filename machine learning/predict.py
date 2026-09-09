"""
TrustLens - Core Risk Predictor Interface
Preprocesses single borrower input, invokes ML pipeline, computes Trust Score,
and constructs structured JSON output matching PRD §8 specification.
"""

import os
import json
import joblib
import pandas as pd
from typing import Dict, Any, Union

# Handle imports whether run standalone or as package
try:
    from trust_engine import TrustEngine
except ImportError:
    from .trust_engine import TrustEngine

class TrustLensPredictor:
    """
    Unified predictor combining Random Forest Risk Model and Trust Engine.
    """
    def __init__(self, artifacts_dir: str = None):
        if artifacts_dir is None:
            base_dir = os.path.dirname(os.path.abspath(__file__))
            artifacts_dir = os.path.join(base_dir, "artifacts")
            
        self.pipeline_path = os.path.join(artifacts_dir, "risk_model_pipeline.joblib")
        self.metadata_path = os.path.join(artifacts_dir, "model_metadata.json")
        
        if not os.path.exists(self.pipeline_path):
            raise FileNotFoundError(
                f"Trained model not found at {self.pipeline_path}. Please run train.py first."
            )
            
        self.pipeline = joblib.load(self.pipeline_path)
        with open(self.metadata_path, 'r', encoding='utf-8') as f:
            self.metadata = json.load(f)
            
        self.defaults = self.metadata.get("inference_defaults", {})

    def predict(self, borrower: Dict[str, Any]) -> Dict[str, Any]:
        """
        Takes raw borrower profile and produces complete decision-support payload.
        
        Input fields (PRD §8):
        - income (float)
        - employment_years (float)
        - loan_amount (float)
        - loan_purpose (str, e.g., 'PERSONAL', 'EDUCATION', 'MEDICAL', 'VENTURE', 'HOMEIMPROVEMENT', 'DEBTCONSOLIDATION')
        - credit_history_years (float)
        - previous_default (bool)
        - person_age (optional int)
        - person_home_ownership (optional str)
        """
        income = float(borrower.get("income", 0))
        emp_years = float(borrower.get("employment_years", 0))
        loan_amt = float(borrower.get("loan_amount", 0))
        loan_purpose = str(borrower.get("loan_purpose", "PERSONAL")).upper().strip()
        cred_hist = float(borrower.get("credit_history_years", 0))
        
        # Handle previous default as bool or str 'Y'/'N'
        prev_def_raw = borrower.get("previous_default", False)
        if isinstance(prev_def_raw, str):
            prev_def_bool = prev_def_raw.upper().strip() in ['Y', 'YES', 'TRUE', '1']
        else:
            prev_def_bool = bool(prev_def_raw)
            
        prev_def_str = 'Y' if prev_def_bool else 'N'
        
        # Optional fields with intelligent fallbacks
        age = int(borrower.get("person_age", max(21, int(emp_years + 20))))
        home_ownership = str(borrower.get("person_home_ownership", self.defaults.get("default_home_ownership", "RENT"))).upper()
        int_rate = float(borrower.get("loan_int_rate", self.defaults.get("default_int_rate", 11.0)))
        loan_grade = str(borrower.get("loan_grade", "B")).upper()
        
        # Derived feature
        loan_percent_income = (loan_amt / income) if income > 0 else 1.0

        # Construct single-row DataFrame for ML pipeline
        feature_dict = {
            'person_age': [age],
            'person_income': [income],
            'person_home_ownership': [home_ownership],
            'person_emp_length': [emp_years],
            'loan_intent': [loan_purpose],
            'loan_grade': [loan_grade],
            'loan_amnt': [loan_amt],
            'loan_int_rate': [int_rate],
            'loan_percent_income': [loan_percent_income],
            'cb_person_default_on_file': [prev_def_str],
            'cb_person_cred_hist_length': [cred_hist]
        }
        input_df = pd.DataFrame(feature_dict)

        # Predict default probability from Random Forest Pipeline
        probabilities = self.pipeline.predict_proba(input_df)[0]
        default_prob = float(probabilities[1])  # Class 1 = Default probability

        # Compute Trust Score & Score Breakdown
        trust_score, score_breakdown = TrustEngine.calculate_trust_score(
            income=income,
            employment_years=emp_years,
            loan_amount=loan_amt,
            credit_history_years=cred_hist,
            previous_default=prev_def_bool,
            default_probability=default_prob
        )

        # Risk Level
        risk_level = TrustEngine.get_risk_level(default_prob, trust_score)

        # Grounded Positive and Negative Factors
        pos_factors, risk_factors = TrustEngine.extract_factors(
            income=income,
            employment_years=emp_years,
            loan_amount=loan_amt,
            credit_history_years=cred_hist,
            previous_default=prev_def_bool,
            loan_purpose=loan_purpose
        )

        # Risk Flags
        risk_flags = TrustEngine.detect_risk_flags(
            income=income,
            loan_amount=loan_amt,
            employment_years=emp_years,
            previous_default=prev_def_bool,
            age=age
        )

        # Recommendation
        recommendation = TrustEngine.generate_recommendation(
            income=income,
            loan_amount=loan_amt,
            risk_level=risk_level,
            trust_score=trust_score,
            default_probability=default_prob
        )

        # Grounded Template AI Explanation (Can be overridden by LLM in backend)
        summary_intro = (
            f"The borrower shows a {risk_level.lower()} estimated repayment risk with a Trust Score of {trust_score}/100."
        )
        supporting_details = f" Key strengths include {pos_factors[0].lower() if pos_factors else 'standard metrics'}."
        if risk_factors and "No major" not in risk_factors[0]:
            supporting_details += f" Factors to monitor: {risk_factors[0].lower()}."
            
        ai_explanation = f"{summary_intro}{supporting_details} Suggested terms: ₹{recommendation['recommended_amount']:,} over {recommendation['recommended_tenure']} months."

        return {
            "trust_score": trust_score,
            "risk_level": risk_level,
            "default_probability": round(default_prob, 3),
            "score_breakdown": score_breakdown,
            "positive_factors": pos_factors,
            "risk_factors": risk_factors,
            "risk_flags": risk_flags,
            "recommended_amount": recommendation["recommended_amount"],
            "recommended_tenure": recommendation["recommended_tenure"],
            "model_confidence": recommendation["model_confidence"],
            "ai_explanation": ai_explanation
        }

if __name__ == "__main__":
    predictor = TrustLensPredictor()
    
    # Test with PRD Borrower A (Low Risk)
    sample_a = {
        "income": 600000,
        "employment_years": 4,
        "loan_amount": 100000,
        "loan_purpose": "MEDICAL",
        "credit_history_years": 5,
        "previous_default": False
    }
    
    result = predictor.predict(sample_a)
    print("Test Sample Prediction Output:")
    print(json.dumps(result, indent=2))
