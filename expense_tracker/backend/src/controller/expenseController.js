import Expense from '../models/Expense.js';

export async function getAllExpenses(req, res) {
    try{
        const expenses = await Expense.find().sort({createdAt: -1});
        res.status(200).json(expenses);
    } catch(error){
        res.status(500).json({
            message: "internal server error getAllExpenses",
            error: error.message
        })
    }
}

export async function getTypeExpenses(req,res){
    try {
        const {type} = req.params;
        const filteredExpenses= await Expense.find({type: type});
        res.status(200).json(filteredExpenses);
    } catch(error) {
        res.status(500).json({
            message: "internal server error getTypeExpenses",
            error: error.message
        })
    }
}

export async function getExpenseById(req, res){
    try {
        const {id} = req.params;
        const requiredExpense = await Expense.findById(id);
        if (!requiredExpense){ 
            return res.status(404).json({
                message: "expense not found"
            })
        }
        else {
            res.status(200).json(requiredExpense);
        }
        }
     catch (error) {
        res.status(500).json({
            message: "internal server error in getting expense by id",
            error: error.message
        })
    }
}

export async function createExpense(req, res) {
    try {
        const {
            amount, type, description
        } = req.body;
        const newExpense = new Expense({ amount, type, description });
        await newExpense.save();
        res.status(201).json(newExpense);
    } catch (error) {
        res.status(500).json({
            message: "internal server error with createExpense",
            error: error.message
        }
        )
    }
}

export async function updateExpense(req, res) {
    try {
        const {id} = req.params;
        const updatedExpense = await Expense.findByIdAndUpdate(id, req.body, {new: true});
        if(!updatedExpense) {
            return res.status(404).json({message: "Expense not found"});
        }
        res.status(200).json(updatedExpense);
    } catch(error) {
        res.status(500).json({
            message:"internal server error with updating expense",
            error: error.message
        })
    }
}


export async function deleteExpense(req, res) {
    try {
        const {id} = req.params;
        const deletedExpense = await Expense.findByIdAndDelete(id);
        if(!deletedExpense) {
            return res.status(404).json({message: "Expense not found"});
        }
        res.status(200).json({message: "Expense deleted successfully"});
    } catch(error) {
        res.status(500).json({
            message: "internal server error with deleting expense",
            error: error.message
        })
    }}