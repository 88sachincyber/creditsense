import shap
import joblib
import pandas as pd

model = joblib.load("models/credit_model.pkl")

explainer = shap.TreeExplainer(model)

def explain_prediction(features):

    df = pd.DataFrame([features])

    shap_values = explainer.shap_values(df)

    feature_importance = {}

    for i, col in enumerate(df.columns):
        feature_importance[col] = float(shap_values[0][i])

    return feature_importance