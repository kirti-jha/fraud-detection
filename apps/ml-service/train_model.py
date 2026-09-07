import os
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix

def generate_synthetic_transactions(n_samples=5000):
    np.random.seed(42)
    
    # Feature 1: Transaction Amount
    amounts = np.random.exponential(scale=5000, size=n_samples) + 100
    
    # Feature 2: Is New Device (0 or 1)
    is_new_device = np.random.choice([0, 1], size=n_samples, p=[0.85, 0.15])
    
    # Feature 3: Is New Location (0 or 1)
    is_new_location = np.random.choice([0, 1], size=n_samples, p=[0.80, 0.20])
    
    # Feature 4: 5-Minute Velocity Count
    velocity_5m = np.random.poisson(lam=1.5, size=n_samples)
    
    # Feature 5: Amount Ratio vs User Avg
    amount_ratio = np.random.lognormal(mean=0.2, sigma=0.5, size=n_samples)
    
    # Feature 6: Time of day (hour 0-23)
    hour = np.random.randint(0, 24, size=n_samples)
    
    # Ground Truth Fraud Rule
    # High amount + new device OR high velocity + late night = Fraud
    fraud_prob = (
        0.02 
        + 0.45 * (amounts > 40000) * (is_new_device == 1)
        + 0.35 * (velocity_5m > 4)
        + 0.25 * (amount_ratio > 4)
        + 0.15 * (hour < 5) * (is_new_device == 1)
    )
    
    is_fraud = (np.random.rand(n_samples) < np.clip(fraud_prob, 0, 0.95)).astype(int)
    
    df = pd.DataFrame({
        'amount': amounts,
        'is_new_device': is_new_device,
        'is_new_location': is_new_location,
        'velocity_5m': velocity_5m,
        'amount_ratio': amount_ratio,
        'hour': hour,
        'is_fraud': is_fraud
    })
    
    return df

def train_and_save_model():
    print("Generating synthetic financial dataset for FraudShield ML training...")
    df = generate_synthetic_transactions(n_samples=5000)
    
    X = df[['amount', 'is_new_device', 'is_new_location', 'velocity_5m', 'amount_ratio', 'hour']]
    y = df['is_fraud']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print(f"Training dataset size: {len(X_train)} samples | Test size: {len(X_test)} samples")
    
    model = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)
    model.fit(X_train, y_train)
    
    y_pred = model.predict(X_test)
    y_pred_proba = model.predict_proba(X_test)[:, 1]
    
    print("\n=== FraudShield ML Model Evaluation Metrics ===")
    print(classification_report(y_test, y_pred))
    print("Confusion Matrix:")
    print(confusion_matrix(y_test, y_pred))
    
    model_path = os.path.join(os.path.dirname(__file__), 'model.joblib')
    joblib.dump(model, model_path)
    print(f"\n✓ Serialized ML model successfully saved to: {model_path}")

if __name__ == '__main__':
    train_and_save_model()
