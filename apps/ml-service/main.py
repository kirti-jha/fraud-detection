import os
from datetime import datetime
from typing import Optional
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import numpy as np

app = FastAPI(
    title="FraudShield Machine Learning Prediction Service",
    description="Serves real-time transaction fraud probability scores using trained Random Forest models.",
    version="1.0.0"
)

# Load model if trained, else fallback gracefully
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'model.joblib')
model = None

if os.path.exists(MODEL_PATH):
    try:
        model = joblib.load(MODEL_PATH)
        print(f"✓ Loaded trained ML model from {MODEL_PATH}")
    except Exception as e:
        print(f"Failed to load model: {e}")

class TransactionPredictionInput(BaseModel):
    transaction_id: str
    amount: float
    is_new_device: int = 0
    is_new_location: int = 0
    velocity_5m: int = 1
    amount_ratio: float = 1.0
    hour: Optional[int] = None

@app.get("/health")
def health():
    return {
        "status": "HEALTHY",
        "service": "FraudShield ML Engine",
        "model_loaded": model is not None,
        "version": "v1.0.0-rf"
    }

@app.post("/predict")
def predict_fraud_risk(payload: TransactionPredictionInput):
    hour = payload.hour if payload.hour is not None else datetime.now().hour
    
    # Feature vector matching trained model schema
    features = np.array([[
        payload.amount,
        payload.is_new_device,
        payload.is_new_location,
        payload.velocity_5m,
        payload.amount_ratio,
        hour
    ]])

    if model is not None:
        try:
            proba = float(model.predict_proba(features)[0][1])
        except Exception as err:
            proba = fallback_heuristic(payload)
    else:
        proba = fallback_heuristic(payload)

    fraud_probability = round(float(np.clip(proba, 0.01, 0.99)), 4)

    return {
        "transaction_id": payload.transaction_id,
        "fraud_probability": fraud_probability,
        "risk_score_component": int(fraud_probability * 100),
        "risk_level": "HIGH" if fraud_probability > 0.7 else "MEDIUM" if fraud_probability > 0.3 else "LOW",
        "model_version": "v1.0.0-rf" if model is not None else "v1.0.0-fallback"
    }

def fallback_heuristic(p: TransactionPredictionInput) -> float:
    base = 0.05
    if p.amount > 50000:
        base += 0.35
    if p.is_new_device == 1:
        base += 0.20
    if p.velocity_5m > 5:
        base += 0.30
    return min(base, 0.95)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
