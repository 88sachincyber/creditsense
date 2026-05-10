import joblib
from explainability.shap_explainer import explain_prediction
from services.insight_service import generate_insights
from services.anomaly_service import detect_anomalies

model = joblib.load("models/credit_model.pkl")

def predict_credit_score(features, transactions):

    X = [[
        features["income_stability"],
        features["savings_ratio"],
        features["debt_ratio"]
    ]]

    score = int(model.predict(X)[0])

    if score >= 750:
        risk = "Low"
    elif score >= 600:
        risk = "Medium"
    else:
        risk = "High"

    explanation = explain_prediction(features)

    insights = generate_insights(features, score)

    anomalies = detect_anomalies(transactions)

    return {
        "score": score,
        "risk_level": risk,
        "features": features,
        "explanation": explanation,
        "insights": insights,
        "anomalies": anomalies
    }