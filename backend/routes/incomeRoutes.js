const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const { addIncome, getAllIncome, updateIncome, downloadIncomeExcel, deleteIncome, getIncomeOverview } = require('../controllers/incomeController');
const incomeRouter = express.Router();

incomeRouter.post("/add",authMiddleware,addIncome);
incomeRouter.get("/get",authMiddleware,getAllIncome);

incomeRouter.put("/update/:id",authMiddleware,updateIncome);
incomeRouter.get("/downloadexcel",authMiddleware,downloadIncomeExcel);

incomeRouter.delete("/delete/:id",authMiddleware,deleteIncome);
incomeRouter.get("/overview",authMiddleware,getIncomeOverview);

module.exports = incomeRouter;