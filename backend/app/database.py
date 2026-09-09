"""
TrustLens - SQLite Database Layer
Handles persistent storage for borrower evaluations, Trust Scores, audit logs,
and human lender decision tracking (PRD §5.7).
"""

import os
import json
import sqlite3
from typing import Dict, Any, List, Optional

DB_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(DB_DIR, "trustlens.db")

def get_connection():
    """Returns a connection to the SQLite database with row factory enabled."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initializes the database schema if tables do not exist."""
    with get_connection() as conn:
        cursor = conn.cursor()
        
        # 1. Applications Table (Evaluations history)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS applications (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                borrower_name TEXT NOT NULL,
                income REAL NOT NULL,
                employment_years REAL NOT NULL,
                loan_amount REAL NOT NULL,
                loan_purpose TEXT NOT NULL,
                credit_history_years REAL NOT NULL,
                previous_default INTEGER NOT NULL,
                trust_score INTEGER NOT NULL,
                risk_level TEXT NOT NULL,
                default_probability REAL NOT NULL,
                recommended_amount REAL NOT NULL,
                recommended_tenure INTEGER NOT NULL,
                positive_factors TEXT NOT NULL,
                risk_factors TEXT NOT NULL,
                risk_flags TEXT NOT NULL,
                ai_explanation TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # 2. Lender Decisions Table (Human decision audit trail)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS decisions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                application_id INTEGER,
                borrower_name TEXT NOT NULL,
                decision_action TEXT NOT NULL,
                approved_amount REAL,
                approved_tenure INTEGER,
                lender_notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (application_id) REFERENCES applications (id)
            );
        """)
        
        conn.commit()
    print(f"[Database] SQLite database initialized at: {DB_PATH}")

def save_application(borrower: Dict[str, Any], result: Dict[str, Any]) -> int:
    """Saves a borrower evaluation request and result into the database."""
    init_db()
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO applications (
                borrower_name, income, employment_years, loan_amount, loan_purpose,
                credit_history_years, previous_default, trust_score, risk_level,
                default_probability, recommended_amount, recommended_tenure,
                positive_factors, risk_factors, risk_flags, ai_explanation
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            borrower.get("borrower_name", "Rahul Sharma"),
            float(borrower.get("income", 0)),
            float(borrower.get("employment_years", 0)),
            float(borrower.get("loan_amount", 0)),
            str(borrower.get("loan_purpose", "PERSONAL")),
            float(borrower.get("credit_history_years", 0)),
            1 if borrower.get("previous_default") else 0,
            int(result.get("trust_score", 0)),
            str(result.get("risk_level", "UNKNOWN")),
            float(result.get("default_probability", 0.0)),
            float(result.get("recommended_amount", 0)),
            int(result.get("recommended_tenure", 12)),
            json.dumps(result.get("positive_factors", [])),
            json.dumps(result.get("risk_factors", [])),
            json.dumps(result.get("risk_flags", [])),
            str(result.get("ai_explanation", ""))
        ))
        conn.commit()
        return cursor.lastrowid

def get_applications_history(limit: int = 50) -> List[Dict[str, Any]]:
    """Retrieves recent evaluated borrower applications."""
    init_db()
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT * FROM applications ORDER BY id DESC LIMIT ?
        """, (limit,))
        rows = cursor.fetchall()
        
        history = []
        for r in rows:
            history.append({
                "id": r["id"],
                "borrower_name": r["borrower_name"],
                "income": r["income"],
                "employment_years": r["employment_years"],
                "loan_amount": r["loan_amount"],
                "loan_purpose": r["loan_purpose"],
                "credit_history_years": r["credit_history_years"],
                "previous_default": bool(r["previous_default"]),
                "trust_score": r["trust_score"],
                "risk_level": r["risk_level"],
                "default_probability": r["default_probability"],
                "recommended_amount": r["recommended_amount"],
                "recommended_tenure": r["recommended_tenure"],
                "positive_factors": json.loads(r["positive_factors"]),
                "risk_factors": json.loads(r["risk_factors"]),
                "risk_flags": json.loads(r["risk_flags"]),
                "ai_explanation": r["ai_explanation"],
                "created_at": r["created_at"]
            })
        return history

def save_lender_decision(
    borrower_name: str,
    decision_action: str,
    application_id: Optional[int] = None,
    approved_amount: Optional[float] = None,
    approved_tenure: Optional[int] = None,
    lender_notes: Optional[str] = None
) -> int:
    """Saves a human lender decision record into the database."""
    init_db()
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO decisions (
                application_id, borrower_name, decision_action,
                approved_amount, approved_tenure, lender_notes
            ) VALUES (?, ?, ?, ?, ?, ?)
        """, (
            application_id,
            borrower_name,
            decision_action.upper(),
            approved_amount,
            approved_tenure,
            lender_notes or ""
        ))
        conn.commit()
        return cursor.lastrowid

def get_analytics_summary() -> Dict[str, Any]:
    """Generates portfolio-level summary statistics."""
    init_db()
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*), AVG(trust_score), AVG(loan_amount) FROM applications")
        total_count, avg_score, avg_loan = cursor.fetchone()
        
        cursor.execute("SELECT risk_level, COUNT(*) FROM applications GROUP BY risk_level")
        risk_counts = {r[0]: r[1] for r in cursor.fetchall()}
        
        cursor.execute("SELECT decision_action, COUNT(*) FROM decisions GROUP BY decision_action")
        decision_counts = {r[0]: r[1] for r in cursor.fetchall()}
        
        return {
            "total_applications": total_count or 0,
            "average_trust_score": round(avg_score, 1) if avg_score else 0,
            "average_loan_amount": round(avg_loan, 2) if avg_loan else 0,
            "risk_distribution": risk_counts,
            "decision_distribution": decision_counts
        }
