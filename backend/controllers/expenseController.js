const expenseModel = require('../models/expenseModel');
const getDateRange = require("../utils/dateFilter");
const XLSX = require('xlsx');

// add an expense similar to income
exports.addExpense = async(req,res) => {
    const userId = req.user._id;

    try {
        const {description,amount,category,date} = req.body || {};

        if(!description || !amount || !category || !date){
            return res.status(400).json({
                success:false,
                message:"All fields are required."
            });
        }

        const newExpense = new expenseModel({
            description:description,
            amount:amount,
            category:category,
            date:new Date(date),
            userId:userId
        });
        await newExpense.save();
        res.status(200).json({
            success:true,
            message:"Expense added successfully."
        });


    } catch (error) {
        console.error(error);
        res.status(500).json({
            success:false,
            message:"Internal Server Error."
        });
    }
}

// get all expenses
exports.getAllExpenses = async(req,res) => {
    const userId = req.user._id;
    try {
        const expense = await expenseModel.find({userId}).sort({ date: -1 });
        res.json({
            expense
        });


    } catch (error) {
        console.error(error);
        res.status(500).json({
            success:false,
            message:"Internal Server Error."
        });
    }
}

// to update an expense

exports.updateExpense = async(req,res) => {
    const userId = req.user._id;
    const {id} = req.params;
    const{description,amount} = req.body;
    try {
        const updatedExpense = await expenseModel.findOneAndUpdate(
            {_id:id,userId:userId},
            {description:description,amount:amount},
            {new:true}
        );
        if(!updatedExpense){
            return res.status(404).json({
                success:false,
                message:"Expense not found."
            });
        }
        return res.status(201).json({
            success:true,
            message:"Expense updated successfully!",
            data:updatedExpense
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success:false,
            message:"Internal server error."
        })
    }
}

exports.deleteExpense = async(req,res) => {
    const {id} = req.params;
    try {
        const deletedExpense = await expenseModel.findOneAndDelete({ _id:id,  userId:req.user._id});
        if(!deletedExpense){
            return res.status(404).json({
                success:false,
                message:"No expense found with the given id."
            });
        }

        return res.json({
            success:true,
            message:"Expense deleted successfully."
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success:false,
            message:"Internal Server Error."
        });
    }
}

exports.downloadExpenseExcel = async(req,res) => {
    const userId = req.user._id;
    try {
        const expense = await expenseModel.find({userId}).sort({date:-1});
        const plainData = expense.map((exp) => ({
            description:exp.description,
            amount:exp.amount,
            category:exp.category,
            date:new Date(exp.date).toLocaleDateString()
        }));

        const worksheet = XLSX.utils.json_to_sheet(plainData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook,worksheet,"expenses");
        XLSX.writeFile(workbook,"expense_details.xlsx");
        res.download("expense_details.xlsx");
        
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success:false,
            message:"Internal Server Error."
        });
    }
}

exports.getExpenseOverview = async function getExpenseOverview(req, res) {

    try {

        const userId = req.user._id;

        const { range = "monthly" } = req.query;

        const { start, end } = getDateRange(range);

        const expenses = await expenseModel.find({
            userId,
            date: { $gte: start, $lte: end },
        }).sort({ date: -1 });

        const totalExpense = expenses.reduce(
            (acc, cur) => acc + cur.amount,
            0
        );

        const averageExpense =
            expenses.length > 0
                ? totalExpense / expenses.length
                : 0;

        const numberOfTransactions = expenses.length;

        const recentTransactions = expenses.slice(0, 9);

        res.json({
            success: true,
            data: {
                totalExpense,
                averageExpense,
                numberOfTransactions,
                recentTransactions,
                range
            }
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }
}