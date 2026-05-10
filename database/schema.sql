CREATE TABLE users (
id SERIAL PRIMARY KEY,
name VARCHAR(100),
email VARCHAR(100) UNIQUE,
password TEXT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transactions (
id SERIAL PRIMARY KEY,
user_id INTEGER REFERENCES users(id),
date DATE,
description TEXT,
amount NUMERIC,
category VARCHAR(100),
type VARCHAR(20)
);

CREATE TABLE financial_scores (
id SERIAL PRIMARY KEY,
user_id INTEGER REFERENCES users(id),
score INTEGER,
risk_level VARCHAR(50),
income_stability FLOAT,
savings_ratio FLOAT,
debt_ratio FLOAT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);