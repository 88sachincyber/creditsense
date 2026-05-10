import pandas as pd


def extract_features(transactions):

    df = pd.DataFrame(transactions)

    if df.empty:
        return {
            "income_stability": 0,
            "savings_ratio": 0,
            "debt_ratio": 0
        }

    income = df[df["type"] == "income"]["amount"].sum()
    expenses = df[df["type"] == "expense"]["amount"].sum()

    savings = income - expenses

    savings_ratio = savings / income if income > 0 else 0

    income_transactions = df[df["type"] == "income"]

    income_stability = len(income_transactions)

    debt_ratio = expenses / income if income > 0 else 0

    return {
        "income_stability": float(income_stability),
        "savings_ratio": float(savings_ratio),
        "debt_ratio": float(debt_ratio)
    }