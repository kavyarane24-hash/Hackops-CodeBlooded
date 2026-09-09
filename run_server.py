"""
TrustLens - Application Server Runner
Starts Uvicorn server hosting FastAPI REST Backend & Lender Dashboard UI.
"""

import sys
import os
import uvicorn

# Ensure project root is in sys.path
PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

if __name__ == "__main__":
    print("============================================================")
    print("Launching TrustLens AI Decision Support Server")
    print("============================================================")
    print("- Web Dashboard UI: http://localhost:8000")
    print("- API Documentation: http://localhost:8000/docs")
    print("- Prediction Endpoint: POST http://localhost:8000/api/predict")
    print("============================================================")
    
    uvicorn.run(
        "backend.app.main:app",
        host="127.0.0.1",
        port=8000,
        reload=True
    )
