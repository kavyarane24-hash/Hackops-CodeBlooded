"""
TrustLens - Machine Learning Model Training Pipeline
Trains a Random Forest Risk Classification Model on credit_risk_dataset.csv
Exports pipeline artifacts and metadata for backend integration.
"""

import os
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.metrics import (
    classification_report,
    roc_auc_score,
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix
)

def load_and_clean_data(csv_path: str) -> pd.DataFrame:
    """Load dataset and apply data cleaning rules."""
    df = pd.read_csv(csv_path)
    
    # 1. Remove impossible outliers in age and employment length
    df = df[df['person_age'] <= 100].copy()
    df = df[df['person_emp_length'] <= 60].copy()
    
    # 2. Ensure loan_percent_income is consistent
    df['loan_percent_income'] = df['loan_amnt'] / df['person_income']
    
    # 3. Standardize string categories (uppercase, trimmed)
    for col in ['person_home_ownership', 'loan_intent', 'loan_grade', 'cb_person_default_on_file']:
        df[col] = df[col].astype(str).str.strip().str.upper()
        
    return df

def build_preprocessing_pipeline():
    """Build column transformer for numeric and categorical features."""
    numeric_features = [
        'person_age',
        'person_income',
        'person_emp_length',
        'loan_amnt',
        'loan_int_rate',
        'loan_percent_income',
        'cb_person_cred_hist_length'
    ]
    
    categorical_features = [
        'person_home_ownership',
        'loan_intent',
        'loan_grade',
        'cb_person_default_on_file'
    ]
    
    numeric_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler())
    ])
    
    categorical_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='most_frequent')),
        ('onehot', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
    ])
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numeric_transformer, numeric_features),
            ('cat', categorical_transformer, categorical_features)
        ]
    )
    
    return preprocessor, numeric_features, categorical_features

def train():
    print("=" * 60)
    print("TrustLens Risk Model Training Pipeline")
    print("=" * 60)
    
    base_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.join(base_dir, "credit_risk_dataset.csv")
    artifacts_dir = os.path.join(base_dir, "artifacts")
    os.makedirs(artifacts_dir, exist_ok=True)
    
    print(f"Loading data from: {csv_path}")
    df = load_and_clean_data(csv_path)
    print(f"Cleaned dataset shape: {df.shape}")
    
    target_col = 'loan_status'
    X = df.drop(columns=[target_col])
    y = df[target_col]
    
    # Store medians and modes for inference imputation when optional fields aren't supplied
    inference_defaults = {
        'default_age': int(df['person_age'].median()),
        'default_home_ownership': str(df['person_home_ownership'].mode()[0]),
        'default_int_rate': round(float(df['loan_int_rate'].median()), 2),
        'default_loan_grade': str(df['loan_grade'].mode()[0]),
        'valid_loan_intents': sorted(df['loan_intent'].unique().tolist()),
        'valid_home_ownerships': sorted(df['person_home_ownership'].unique().tolist()),
        'valid_loan_grades': sorted(df['loan_grade'].unique().tolist())
    }
    
    # Train-Test Split (Stratified)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )
    print(f"Training set: {X_train.shape[0]} samples, Test set: {X_test.shape[0]} samples")
    
    # Build Preprocessor & Model Pipeline
    preprocessor, num_cols, cat_cols = build_preprocessing_pipeline()
    
    rf_model = RandomForestClassifier(
        n_estimators=100,
        max_depth=12,
        min_samples_split=6,
        min_samples_leaf=2,
        class_weight='balanced',
        random_state=42,
        n_jobs=1
    )
    
    pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('classifier', rf_model)
    ])
    
    print("\nTraining Random Forest Classifier...")
    pipeline.fit(X_train, y_train)
    
    # Evaluate
    y_pred = pipeline.predict(X_test)
    y_proba = pipeline.predict_proba(X_test)[:, 1]
    
    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred)
    rec = recall_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    roc_auc = roc_auc_score(y_test, y_proba)
    cm = confusion_matrix(y_test, y_pred).tolist()
    
    print("\n" + "=" * 40)
    print("Model Evaluation Metrics on Test Set")
    print("=" * 40)
    print(f"Accuracy:        {acc:.4f}")
    print(f"ROC-AUC Score:   {roc_auc:.4f}")
    print(f"Precision:       {prec:.4f}")
    print(f"Recall:          {rec:.4f}")
    print(f"F1-Score:        {f1:.4f}")
    print("\nConfusion Matrix:")
    print(np.array(cm))
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, target_names=["Non-Default (0)", "Default (1)"]))
    
    # Extract Feature Importances
    onehot_categories = pipeline.named_steps['preprocessor'].named_transformers_['cat'].named_steps['onehot'].get_feature_names_out(cat_cols)
    all_feature_names = num_cols + list(onehot_categories)
    importances = pipeline.named_steps['classifier'].feature_importances_
    
    feat_imp_df = pd.DataFrame({
        'feature': all_feature_names,
        'importance': importances
    }).sort_values(by='importance', ascending=False)
    
    print("\nTop 10 Most Important Features:")
    print(feat_imp_df.head(10).to_string(index=False))
    
    # Save Pipeline and Metadata
    model_path = os.path.join(artifacts_dir, "risk_model_pipeline.joblib")
    joblib.dump(pipeline, model_path)
    print(f"\nSaved model pipeline to: {model_path}")
    
    metadata = {
        "model_name": "TrustLens Random Forest Risk Model",
        "version": "1.0.0",
        "numeric_features": num_cols,
        "categorical_features": cat_cols,
        "all_feature_names": all_feature_names,
        "inference_defaults": inference_defaults,
        "metrics": {
            "accuracy": round(float(acc), 4),
            "roc_auc": round(float(roc_auc), 4),
            "precision": round(float(prec), 4),
            "recall": round(float(rec), 4),
            "f1_score": round(float(f1), 4),
            "confusion_matrix": cm
        },
        "top_features": feat_imp_df.head(10).to_dict(orient='records')
    }
    
    metadata_path = os.path.join(artifacts_dir, "model_metadata.json")
    with open(metadata_path, 'w', encoding='utf-8') as f:
        json.dump(metadata, f, indent=2)
    print(f"Saved metadata to: {metadata_path}")
    print("Training finished successfully!\n")

if __name__ == "__main__":
    train()
