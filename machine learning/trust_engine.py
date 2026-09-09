"""
TrustLens - Trust Engine & Recommendation Logic
Implements multi-factor Trust Score (0-100), grounded positive/risk factors,
fraud/anomaly flags, and personalized lending recommendations.
"""

from typing import Dict, Any, List, Tuple

class TrustEngine:
    """
    Computes explainable credit risk profiles, multi-dimensional trust score,
    rule-based anomaly flags, and conservative lending recommendations.
    """
    
    @staticmethod
    def calculate_trust_score(
        income: float,
        employment_years: float,
        loan_amount: float,
        credit_history_years: float,
        previous_default: bool,
        default_probability: float
    ) -> Tuple[int, Dict[str, int]]:
        """
        Calculates 0-100 Trust Score based on 5 weighted pillars (PRD §5.3):
        - Income Stability (max 25 pts)
        - Credit History (max 20 pts)
        - Loan Affordability (max 20 pts)
        - Repayment History (max 20 pts)
        - Employment Stability (max 15 pts)
        """
        # 1. Income Stability (Max 25)
        # Scaled based on annual income
        if income >= 800000:
            income_score = 25
        elif income >= 500000:
            income_score = 22
        elif income >= 300000:
            income_score = 18
        elif income >= 150000:
            income_score = 12
        else:
            income_score = 7

        # 2. Credit History (Max 20)
        if credit_history_years >= 8:
            credit_score = 20
        elif credit_history_years >= 5:
            credit_score = 17
        elif credit_history_years >= 3:
            credit_score = 13
        elif credit_history_years >= 1:
            credit_score = 8
        else:
            credit_score = 4

        # 3. Loan Affordability (Max 20)
        # Loan-to-income ratio
        lti_ratio = (loan_amount / income) if income > 0 else 1.0
        if lti_ratio <= 0.15:
            affordability_score = 20
        elif lti_ratio <= 0.25:
            affordability_score = 17
        elif lti_ratio <= 0.35:
            affordability_score = 13
        elif lti_ratio <= 0.50:
            affordability_score = 8
        else:
            affordability_score = 3

        # 4. Repayment History (Max 20)
        if not previous_default:
            repayment_score = 20
        else:
            repayment_score = 4

        # 5. Employment Stability (Max 15)
        if employment_years >= 5:
            employment_score = 15
        elif employment_years >= 3:
            employment_score = 12
        elif employment_years >= 1:
            employment_score = 8
        else:
            employment_score = 4

        # Component sum
        heuristic_score = (
            income_score +
            credit_score +
            affordability_score +
            repayment_score +
            employment_score
        )
        
        # Blend ML model probability into the trust score (70% heuristic pillars, 30% direct ML confidence)
        ml_score_component = (1.0 - default_probability) * 100
        blended_score = int(round(0.70 * heuristic_score + 0.30 * ml_score_component))
        blended_score = max(5, min(98, blended_score))
        
        breakdown = {
            "income_stability": int(income_score),
            "credit_history": int(credit_score),
            "loan_affordability": int(affordability_score),
            "repayment_history": int(repayment_score),
            "employment_stability": int(employment_score)
        }
        
        return blended_score, breakdown

    @staticmethod
    def get_risk_level(default_probability: float, trust_score: int) -> str:
        """Determines risk level based on probability and trust score (PRD §5.2)."""
        if trust_score >= 70 and default_probability < 0.35:
            return "LOW"
        elif trust_score < 45 or (default_probability >= 0.75 and trust_score < 50):
            return "HIGH"
        else:
            return "MEDIUM"

    @staticmethod
    def extract_factors(
        income: float,
        employment_years: float,
        loan_amount: float,
        credit_history_years: float,
        previous_default: bool,
        loan_purpose: str
    ) -> Tuple[List[str], List[str]]:
        """
        Extracts explainable positive factors and risk factors grounded solely
        in user inputs (PRD §5.4).
        """
        positive_factors = []
        risk_factors = []
        
        lti_ratio = (loan_amount / income) if income > 0 else 1.0

        # Positive Factors
        if income >= 450000:
            positive_factors.append(f"Strong annual income base (₹{income:,.0f})")
        elif income >= 250000:
            positive_factors.append(f"Steady annual income (₹{income:,.0f})")
            
        if not previous_default:
            positive_factors.append("Clean repayment history with zero previous defaults")
            
        if credit_history_years >= 4:
            positive_factors.append(f"Established credit track record ({credit_history_years:.0f} years)")
            
        if employment_years >= 3:
            positive_factors.append(f"Consistent employment stability ({employment_years:.0f} years)")
            
        if lti_ratio <= 0.20:
            positive_factors.append(f"Low loan-to-income burden ({lti_ratio * 100:.1f}%)")

        # Risk Factors
        if previous_default:
            risk_factors.append("Prior loan default recorded on credit profile")
            
        if lti_ratio > 0.40:
            risk_factors.append(f"High monthly repayment burden (Loan is {lti_ratio * 100:.1f}% of income)")
        elif lti_ratio > 0.28:
            risk_factors.append(f"Moderate repayment burden ({lti_ratio * 100:.1f}% of annual income)")
            
        if employment_years < 1.5:
            risk_factors.append(f"Short employment tenure ({employment_years:.1f} years)")
            
        if credit_history_years < 3:
            risk_factors.append(f"Limited credit history length ({credit_history_years:.0f} years)")
            
        if income < 200000:
            risk_factors.append("Low annual income bracket increases sensitivity to financial shocks")

        # Fallback if empty to guarantee grounded transparency
        if not positive_factors:
            positive_factors.append("Standard application within verifiable informal parameters")
        if not risk_factors:
            risk_factors.append("No major adverse indicators detected")

        return positive_factors, risk_factors

    @staticmethod
    def detect_risk_flags(
        income: float,
        loan_amount: float,
        employment_years: float,
        previous_default: bool,
        age: int = 28
    ) -> List[str]:
        """
        Lightweight anomaly & risk flags (PRD §5.8).
        """
        flags = []
        lti_ratio = (loan_amount / income) if income > 0 else 1.0
        
        if lti_ratio > 0.50:
            flags.append(f"Income-to-loan ratio unusually high (Requested loan is {lti_ratio * 100:.1f}% of annual income)")
            
        if previous_default:
            flags.append("Previous loan default on record requires human collateral verification")
            
        if employment_years > (age - 16):
            flags.append("Inconsistent employment length relative to borrower profile")
            
        if loan_amount > 1500000:
            flags.append("High capital exposure for informal uncollateralized lending")

        return flags

    @staticmethod
    def generate_recommendation(
        income: float,
        loan_amount: float,
        risk_level: str,
        trust_score: int,
        default_probability: float
    ) -> Dict[str, Any]:
        """
        Generates personalized suggested loan amount and tenure (PRD §5.5).
        """
        monthly_income = income / 12.0
        
        if risk_level == "LOW":
            # Can comfortably recommend full amount or up to 90-100%
            rec_amount = round(min(loan_amount, monthly_income * 4.0), -3)
            rec_tenure = 12 if loan_amount <= 100000 else 18
        elif risk_level == "MEDIUM":
            # Recommend conservative 60-80% amount with extended tenure to lower EMI
            rec_amount = round(min(loan_amount * 0.75, monthly_income * 2.5), -3)
            rec_tenure = 12 if rec_amount <= 60000 else 18
        else: # HIGH
            # Conservative micro-credit amount with structured short tenure
            rec_amount = round(min(loan_amount * 0.40, monthly_income * 1.2), -3)
            rec_tenure = 6 if rec_amount <= 30000 else 12

        # Round amount to neat thousands
        rec_amount = max(10000, int(rec_amount))
        
        # Calculate model confidence
        # Distance from uncertain 50% boundary
        model_confidence = int(round((abs(default_probability - 0.50) * 2.0 * 30) + 70))
        model_confidence = max(70, min(96, model_confidence))

        return {
            "recommended_amount": rec_amount,
            "recommended_tenure": rec_tenure,
            "model_confidence": model_confidence
        }
