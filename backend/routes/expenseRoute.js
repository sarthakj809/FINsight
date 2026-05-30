const express = require('express');
const { addExpense, getAllExpenses, updateExpense, deleteExpense, downloadExpenseExcel, getExpenseOverview } = require('../controllers/expenseController');
const { authMiddleware } = require('../middleware/auth');
const expenseRouter = express.Router();

expenseRouter.post("/add",authMiddleware,addExpense);
expenseRouter.get("/get",authMiddleware,getAllExpenses);
expenseRouter.put('/update/:id',authMiddleware,updateExpense);
expenseRouter.delete('/delete/:id',authMiddleware,deleteExpense);
expenseRouter.get('/downloadexcel',authMiddleware,downloadExpenseExcel);
expenseRouter.get('/overview',authMiddleware,getExpenseOverview);

module.exports = expenseRouter;

