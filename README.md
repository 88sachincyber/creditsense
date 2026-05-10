# CreditSense — AI-Driven Financial Well-Being Assessment Platform

CreditSense is an intelligent fintech platform built to evaluate a user’s financial well-being through **behavioral financial analysis** rather than relying only on traditional credit history. Instead of focusing solely on past loans, credit card usage, or conventional credit scores, CreditSense studies real transaction behavior — income flow, spending patterns, savings discipline, debt ratio, and financial consistency — to generate a meaningful **Financial Health Score**.

The platform combines **full-stack engineering**, **microservices architecture**, and **machine learning** to convert raw transaction data into actionable financial insights.

---

## Problem Statement

Traditional credit scoring systems are often built around borrowing history. This creates a gap: many financially responsible people who have never taken loans or used credit products remain outside formal credit evaluation systems.

CreditSense addresses this by shifting the evaluation from **borrowing behavior** to **financial behavior**.

The system answers questions like:

* How stable is a user's income?
* Does the user save consistently?
* Are spending habits healthy?
* Is debt manageable relative to income?
* Are there unusual spending spikes or risky transactions?
* What factors are improving or hurting financial health?

By analyzing these patterns, CreditSense generates a **360° Financial Health Score** that is transparent, explainable, and behavior-driven.

---

## Key Features

### AI-Powered Financial Health Score

Generates a smart financial score using behavioral metrics rather than conventional credit history.

### Bank Statement Upload & Parsing

Supports structured financial statement upload through **PDF / CSV parsing**.

### Automated Transaction Categorization

Organizes transaction records into meaningful spending categories for deeper analysis.

### Explainable AI Insights

Uses **SHAP (SHapley Additive Explanations)** to explain *why* a score was generated.

### Anomaly Detection

Detects unusual financial behavior using **Isolation Forest**, such as sudden spending spikes or suspicious transaction activity.

### Interactive Dashboard

Provides users with:

* Financial Health Score
* Risk level analysis
* Spending insights
* Savings trends
* Transaction history
* Behavioral analysis
* Anomaly alerts

### Secure Authentication

Protected user accounts with secure backend authentication flow.

### Microservices Architecture

Decoupled AI engine and backend service for better scalability and maintainability.

---

## System Architecture

```text
Frontend (React + Tailwind)
        ↓
Backend API (Node.js + Express)
        ↓
Database (PostgreSQL)
        ↓
AI Microservice (FastAPI + Scikit-learn)
        ↓
Prediction + Explainability + Anomaly Detection
```

---

## Tech Stack

### Frontend

* React.js
* Tailwind CSS
* Axios
* Recharts / Visualization libraries
* Vite

### Backend

* Node.js
* Express.js
* JWT Authentication
* Multer (file upload)
* PDF / CSV parsing utilities

### Database

* PostgreSQL

### AI / Machine Learning

* Python
* FastAPI
* Scikit-learn
* Random Forest
* SHAP
* Isolation Forest
* Pandas
* NumPy

### Dev Tools

* Git
* GitHub
* Postman
* VS Code

---

## Machine Learning Pipeline

CreditSense uses a multi-stage AI pipeline:

### Feature Engineering

Extracts:

* Income Stability
* Savings Ratio
* Spending Pattern
* Debt-to-Income Ratio
* Transaction Consistency
* Expense Trends

### Random Forest Prediction

Generates Financial Health Score.

### SHAP Explainability

Breaks down score contribution by feature.

Example:

* Income Stability → Positive impact
* High Debt Ratio → Negative impact
* Healthy Savings Pattern → Positive impact

### Isolation Forest

Flags anomalies such as:

* Sudden large expenses
* Irregular withdrawals
* Abnormal transaction spikes

---

## Project Structure

```bash
creditsense/
│
├── frontend/          # React frontend
├── backend/           # Node.js backend APIs
├── ai_service/        # FastAPI ML microservice
├── database/          # SQL schema / DB scripts
├── docs/              # Research paper / project docs
└── README.md
```

---

## How It Works

1. User registers / logs in
2. Uploads financial statement (PDF / CSV)
3. Backend parses transactions
4. Data stored in PostgreSQL
5. Feature engineering performed
6. AI service predicts Financial Health Score
7. SHAP generates explainable insights
8. Isolation Forest detects anomalies
9. Dashboard displays complete financial analysis

---

## Use Cases

CreditSense can be used for:

* Alternative credit scoring
* Financial wellness monitoring
* Smart lending decisions
* Personal finance coaching
* Spending anomaly detection
* Financial inclusion for credit-invisible users
* Fintech risk analysis

---

## Future Scope

Potential future enhancements:

* Open Banking API integration
* Real-time transaction sync
* Mobile application
* Personalized AI financial advisor
* Fraud detection layer
* Predictive budgeting
* Multilingual support
* Cloud-scale deployment

---

## Research Contribution

This project combines:

* Behavioral Finance
* Machine Learning
* Explainable AI
* Anomaly Detection
* Financial Analytics

into a unified financial intelligence platform that moves beyond traditional credit scoring models.

---

## Author

**Sachin Yadav**

