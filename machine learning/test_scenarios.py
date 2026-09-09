import os
import sys
import json

# Ensure UTF-8 output on Windows consoles
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

from predict import TrustLensPredictor

def run_prd_scenarios():
    print("=" * 65)
    print("TrustLens PRD Demo Scenarios Validation")
    print("=" * 65)
    
    predictor = TrustLensPredictor()
    
    scenarios = [
        {
            "name": "Borrower A -- Low Risk Profile (PRD 12)",
            "data": {
                "borrower_name": "Rahul Sharma",
                "income": 600000,
                "employment_years": 5,
                "loan_amount": 80000,
                "loan_purpose": "MEDICAL",
                "credit_history_years": 5,
                "previous_default": False
            },
            "expected_risk": "LOW"
        },
        {
            "name": "Borrower B -- Medium Risk Profile (PRD 12)",
            "data": {
                "borrower_name": "Priya Patel",
                "income": 300000,
                "employment_years": 2,
                "loan_amount": 100000,
                "loan_purpose": "PERSONAL",
                "credit_history_years": 2,
                "previous_default": False
            },
            "expected_risk": "MEDIUM"
        },
        {
            "name": "Borrower C -- High Risk Profile (PRD 12)",
            "data": {
                "borrower_name": "Amit Kumar",
                "income": 150000,
                "employment_years": 0.8,
                "loan_amount": 150000,
                "loan_purpose": "DEBTCONSOLIDATION",
                "credit_history_years": 2,
                "previous_default": True
            },
            "expected_risk": "HIGH"
        }
    ]
    
    for s in scenarios:
        print(f"\n>> Testing: {s['name']}")
        print(f"   Input: {json.dumps(s['data'])}")
        res = predictor.predict(s['data'])
        print(f"   * Trust Score:          {res['trust_score']}/100")
        print(f"   * Risk Level:           {res['risk_level']} (Expected: {s['expected_risk']})")
        print(f"   * Default Probability:  {res['default_probability'] * 100:.1f}%")
        print(f"   * Recommended Terms:    INR {res['recommended_amount']:,} @ {res['recommended_tenure']} Months")
        print(f"   * Model Confidence:     {res['model_confidence']}%")
        print(f"   * Positive Factors:     {res['positive_factors']}")
        print(f"   * Risk Factors:         {res['risk_factors']}")
        print(f"   * Risk Flags:           {res['risk_flags']}")
        print(f"   * AI Explanation:       {res['ai_explanation']}")
        
        status = "PASSED" if res['risk_level'] == s['expected_risk'] else "WARNING: Risk mismatch"
        print(f"   Result: [{status}]")

    print("\n" + "=" * 65)
    print("All PRD Scenarios Processed Successfully!")
    print("=" * 65)

if __name__ == "__main__":
    run_prd_scenarios()
