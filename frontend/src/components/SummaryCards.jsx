function SummaryCards({ totals }) {

  return (

    <div style={{display:"flex", gap:"20px"}}>

      <div>
        <h3>Total Income</h3>
        <p>₹{totals.income}</p>
      </div>

      <div>
        <h3>Total Expense</h3>
        <p>₹{totals.expense}</p>
      </div>

      <div>
        <h3>Savings</h3>
        <p>₹{totals.savings}</p>
      </div>

    </div>

  );
}

export default SummaryCards;