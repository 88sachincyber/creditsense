import pandas as pd
import numpy as np

rows = 10000

data = {
    "income_stability": np.random.randint(1, 6, rows),
    "savings_ratio": np.random.uniform(0, 0.8, rows),
    "debt_ratio": np.random.uniform(0, 1, rows),
}

df = pd.DataFrame(data)

# Create realistic score formula
df["score"] = (
    df["income_stability"] * 60
    + df["savings_ratio"] * 400
    + (1 - df["debt_ratio"]) * 300
)

df["score"] = df["score"].clip(300, 900)

df.to_csv("../dataset/synthetic_finance_data.csv", index=False)

print("Dataset generated successfully")