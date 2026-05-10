import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import scoreRoutes from "./routes/scoreRoutes.js";
import pool from "./config/db.js";
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/scores", scoreRoutes);
app.get("/db-test", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Database connection error" });
    };
});

app.get("/",(req,res)=>{
    res.send("Backend Running")
});

const PORT = 5000;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})