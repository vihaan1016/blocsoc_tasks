import express from 'express';
import expenseRouter from './routes/expenseRouter.js'
import dotenv from 'dotenv';
import connectDB from './config/db.js';
dotenv.config();
import cors from 'cors';
import path from 'path';

const __dirname = path.resolve();

const PORT = process.env.PORT || 5000;

connectDB();

const app = express();
if (process.env.NODE_ENV !== "production") {
    app.use(
        cors({
            origin: "http://localhost:5173",
            credentials: true,
        })
    );
}
app.use(express.json());
app.use('/api/expenses', expenseRouter);
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});