import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import r2_score

data = pd.read_csv("../dataset/synthetic_finance_data.csv")

X = data[["income_stability", "savings_ratio", "debt_ratio"]]
y = data["score"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

model = RandomForestRegressor(
    n_estimators=200,
    max_depth=10,
    random_state=42
)

model.fit(X_train, y_train)

predictions = model.predict(X_test)

print("Model Accuracy (R²):", r2_score(y_test, predictions))

joblib.dump(model, "../models/credit_model.pkl")

print("Model saved successfully")