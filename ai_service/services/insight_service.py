def generate_insights(features, score):

    insights = []

    income_stability = features["income_stability"]
    savings_ratio = features["savings_ratio"]
    debt_ratio = features["debt_ratio"]

    # Savings insight
    if savings_ratio < 0.2:
        insights.append(
            "Your savings ratio is low. Consider saving at least 20% of your income."
        )
    elif savings_ratio > 0.5:
        insights.append(
            "Great job! Your savings ratio is strong and shows good financial discipline."
        )

    # Debt insight
    if debt_ratio > 0.6:
        insights.append(
            "Your debt ratio is high. Reducing outstanding debt can improve your creditworthiness."
        )
    elif debt_ratio < 0.3:
        insights.append(
            "Your debt ratio is healthy, indicating good financial balance."
        )

    # Income stability insight
    if income_stability <= 1:
        insights.append(
            "Income stability is low. Consistent income sources can improve your financial score."
        )
    elif income_stability >= 3:
        insights.append(
            "Your income stability is strong, which positively affects your financial health."
        )

    # Overall score insight
    if score >= 750:
        insights.append(
            "Your financial health score is excellent. You are likely eligible for favorable loan terms."
        )
    elif score >= 600:
        insights.append(
            "Your financial health score is moderate. Improving savings and reducing debt can increase it."
        )
    else:
        insights.append(
            "Your financial health score is low. Focus on increasing savings and stabilizing income."
        )

    return insights