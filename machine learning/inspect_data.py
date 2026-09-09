import pandas as pd
import numpy as np

df = pd.read_csv("machine learning/credit_risk_dataset.csv")
print("Shape:", df.shape)
print("\nColumns and missing values:")
print(df.isnull().sum())
print("\nData Types:")
print(df.dtypes)
print("\nCategorical columns unique values:")
for col in df.select_dtypes(include=['object']).columns:
    print(f"{col}: {df[col].unique()}")

print("\nSummary stats of numeric features:")
print(df.describe())

print("\nTarget distribution (loan_status):")
print(df['loan_status'].value_counts(normalize=True))
