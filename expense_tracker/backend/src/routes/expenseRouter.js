import express from 'express';
import {getAllExpenses,getExpenseById, createExpense, updateExpense, deleteExpense, getTypeExpenses} from '../controller/expenseController.js';
import connectDB from '../config/db.js';   
const router = express.Router();
connectDB();
router.get('/', getAllExpenses);
router.get('/:id', getExpenseById);
router.get('/type/:type', getTypeExpenses);
router.post('/', createExpense);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);


export default router;