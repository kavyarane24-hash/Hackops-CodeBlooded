"""
TrustLens - AI Explainer Module
Converts structured model prediction outputs into concise, natural language explanations
using the official google-genai SDK with deterministic fallback.
"""

import os
from typing import Dict, Any, List
from dotenv import load_dotenv

load_dotenv()

class AIExplainer:
    """
    Generates explainable AI summaries using Gemini API or grounded rules.
    """
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
        self.client = None
        
        if self.api_key:
            try:
                from google import genai
                self.client = genai.Client(api_key=self.api_key)
            except Exception as e:
                print(f"[Warning] Failed to initialize Gemini client: {e}")
                self.client = None

    def generate_explanation(
        self,
        trust_score: int,
        risk_level: str,
        default_probability: float,
        positive_factors: List[str],
        risk_factors: List[str],
        recommended_amount: int,
        recommended_tenure: int
    ) -> str:
        """
        Generates grounded natural language explanation.
        """
        # If Gemini client is active, call LLM
        if self.client:
            try:
                prompt = f"""You are TrustLens AI, an expert decision-support analyst for informal credit assessment.
Generate a concise, professional 2-3 sentence summary explaining a borrower's credit evaluation to an informal lender.

BORROWER EVALUATION DATA:
- Trust Score: {trust_score}/100
- Risk Classification: {risk_level}
- Estimated Default Probability: {default_probability * 100:.1f}%
- Key Strengths: {", ".join(positive_factors)}
- Risk Factors to Monitor: {", ".join(risk_factors)}
- Recommended Loan Terms: ₹{recommended_amount:,} for {recommended_tenure} months

STRICT RULES:
1. Ground your response strictly in the provided data above. Do NOT invent outside facts or employment details.
2. Clearly highlight why the Trust Score was awarded and state the recommended loan terms.
3. Keep the tone reassuring, objective, and easy for an informal lender to understand in seconds.
"""
                response = self.client.models.generate_content(
                    model='gemini-2.5-flash',
                    contents=prompt
                )
                if response and response.text:
                    return response.text.strip()
            except Exception as err:
                print(f"[AIExplainer] Gemini API call fallback triggered: {err}")

        # Grounded Deterministic Fallback
        risk_label_lower = risk_level.lower()
        strengths_str = positive_factors[0].lower() if positive_factors else "verifiable financial profile"
        
        if risk_level == "LOW":
            intro = f"The borrower exhibits a low repayment risk profile with a strong Trust Score of {trust_score}/100."
            details = f" Key driver is {strengths_str}."
            recommend = f" We recommend approving the requested loan up to ₹{recommended_amount:,} over {recommended_tenure} months."
        elif risk_level == "MEDIUM":
            intro = f"The borrower presents a moderate risk level with a Trust Score of {trust_score}/100."
            monitor_str = risk_factors[0].lower() if risk_factors else "repayment capacity"
            details = f" While supported by {strengths_str}, the lender should monitor {monitor_str}."
            recommend = f" We suggest a cautious allocation of ₹{recommended_amount:,} over {recommended_tenure} months."
        else: # HIGH
            intro = f"The borrower shows high repayment risk with a Trust Score of {trust_score}/100 (Estimated default probability: {default_probability * 100:.1f}%)."
            monitor_str = risk_factors[0].lower() if risk_factors else "prior defaults and repayment burden"
            details = f" Caution is advised due to {monitor_str}."
            recommend = f" A conservative micro-loan capped at ₹{recommended_amount:,} over {recommended_tenure} months with collateral/guarantor support is advised."

        return f"{intro}{details}{recommend}"
