from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional

from utils.feature_engineering import extract_features
from services.scoring_service import predict_credit_score

app = FastAPI(title="CreditSense AI Scoring Service")


class Transaction(BaseModel):
    amount: Optional[float] = None
    type: Optional[str] = "expense"
    category: Optional[str] = "other"
    date: Optional[str] = None
    description: Optional[str] = None


class TransactionRequest(BaseModel):
    transactions: List[Transaction]


@app.post("/predict")
def predict_score(data: TransactionRequest):
    transactions = []

    for txn in data.transactions:
        item = txn.model_dump() if hasattr(txn, "model_dump") else txn.dict()

        amount = item.get("amount")
        if amount is None:
            continue

        try:
            amount = float(amount)
        except (TypeError, ValueError):
            continue

        if amount <= 0:
            continue

        tx_type = str(item.get("type") or "expense").strip().lower()
        if tx_type not in {"income", "expense"}:
            tx_type = "expense"

        category = str(item.get("category") or "other").strip().lower() or "other"
        description = str(item.get("description") or "transaction")

        transactions.append(
            {
                "amount": amount,
                "type": tx_type,
                "category": category,
                "date": item.get("date"),
                "description": description,
            }
        )

    if not transactions:
        raise HTTPException(status_code=400, detail="No valid transactions in request")

    features = extract_features(transactions)

    result = predict_credit_score(features, transactions)

    return result