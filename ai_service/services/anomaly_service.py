import pandas as pd
from sklearn.ensemble import IsolationForest


def detect_anomalies(transactions):

    df = pd.DataFrame(transactions)

    if df.empty:
        return []

    # Use transaction amounts for anomaly detection
    X = df[["amount"]]

    model = IsolationForest(contamination=0.1, random_state=42)

    df["anomaly"] = model.fit_predict(X)

    anomalies = df[df["anomaly"] == -1]

    alerts = []

    for _, row in anomalies.iterrows():
        alerts.append(
            f"Unusual transaction detected: {row['description']} amount {row['amount']}"
        )

    return alerts