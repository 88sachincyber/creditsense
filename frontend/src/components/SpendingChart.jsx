import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#aa46be"];

const getMonthBucket = (dateValue) => {
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return { key: "unknown", label: "Unknown" };

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");

  return {
    key: `${year}-${month}`,
    label: parsed.toLocaleString("en-IN", {
    month: "short",
    year: "2-digit",
    }),
  };
};

function SpendingChart({ transactions }) {

  const categoryData = {};
  const monthlyData = {};

  transactions.forEach((t) => {
    if (t.type !== "expense") return;

    const amount = Number(t.amount);
    if (!Number.isFinite(amount) || amount <= 0) return;

    const category = String(t.category || "other").toLowerCase();
    const monthBucket = getMonthBucket(t.date);

    categoryData[category] = (categoryData[category] || 0) + amount;
    if (!monthlyData[monthBucket.key]) {
      monthlyData[monthBucket.key] = {
        month: monthBucket.label,
        expense: 0,
      };
    }

    monthlyData[monthBucket.key].expense += amount;
  });

  const data = Object.keys(categoryData).map((key) => ({
    name: key,
    value: Number(categoryData[key].toFixed(2)),
  }));

  const trendData = Object.keys(monthlyData)
    .sort((a, b) => {
      if (a === "unknown") return 1;
      if (b === "unknown") return -1;
      return a.localeCompare(b);
    })
    .map((key) => ({
      month: monthlyData[key].month,
      expense: Number(monthlyData[key].expense.toFixed(2)),
    }));

  if (data.length === 0) {
    return <p>No expense transactions available for analytics yet.</p>;
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
      <div style={{ border: "1px solid #ddd", padding: "16px" }}>
        <h3 style={{ marginTop: 0 }}>Spending Analytics</h3>
        <div style={{ width: "100%", height: 280 }}>
          <ResponsiveContainer>
            <BarChart data={trendData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`₹ ${value}`, "Expense"]} />
              <Legend />
              <Bar dataKey="expense" fill="#0088FE" name="Monthly Expense" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ border: "1px solid #ddd", padding: "16px" }}>
        <h3 style={{ marginTop: 0 }}>Spending Distribution</h3>
        <div style={{ width: "100%", height: 280 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`₹ ${value}`, "Amount"]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default SpendingChart;