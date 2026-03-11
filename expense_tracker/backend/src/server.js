import express from 'express';
import expenseRouter from './routes/expenseRouter.js'
import dotenv from 'dotenv';
import connectDB from './config/db.js';
dotenv.config();
import cors from 'cors';

const PORT = process.env.PORT || 5000;

connectDB();

const app = express();
app.use(cors({ 
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use('/api/expenses', expenseRouter);
app.listen(PORT, ()=> {
    console.log(`server is running on port ${PORT}`);
});