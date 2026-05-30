const incomeModel = require("../models/incomeModel");
const XLSX = require('xlsx');
const getDateRange = require("../utils/dateFilter");

// adding income
exports.addIncome = async (req, res) => {
    const userId = req.user?._id;

    try {
        const body = req.body ?? {};
        console.log('addIncome body:', body);
        const { description, amount, category, date } = body;

        if (!description || !amount || !category || !date) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required.'
            });
        }

        const newIncome = new incomeModel({
            description,
            amount,
            category,
            date: new Date(date),
            userId
        });
        await newIncome.save();
        res.status(200).json({
            success: true,
            message: 'Income added successfully.'
        });

    } catch (error) {
        console.error('Income add failed:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error.'
        });
    }
}

// get all income

exports.getAllIncome = async(req,res) => {
    const userId = req.user._id;
    try {
        const income = await incomeModel.find({userId}).sort({ date: -1 });
        res.json({
            income
        });


    } catch (error) {
        console.error(error);
        res.status(500).json({
            success:false,
            meassage:"Internal Server Error."
        });
    }
}

// to update an income

exports.updateIncome = async(req,res) => {
    const {id} = req.params;
    const userId = req.user._id;
    const {description,amount} = req.body;

    try {
        const updatedIncome = await incomeModel.findOneAndUpdate(
            {_id:id,userId:userId},
            {description,amount},
            {new:true}
        );

        if(!updatedIncome){
            return res.status(404).json({
                success:false,
                message:"Income not found."
            });
        }

        return res.json({
            success:true,
            message:"Income updated successfully!",
            data: updatedIncome
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success:false,
            meassage:"Internal Server Error."
        });
    }
}


// deleting an income
exports.deleteIncome = async(req,res) => {
    const {id} = req.params;
    try {
        const deletedIncome = await incomeModel.findByIdAndDelete({_id:id});
        if(!deletedIncome){
            return res.status(404).json({
                success:false,
                message:"No income found with the given id."
            });
        }

        return res.json({
            success:true,
            message:"Income deleted successfully."
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success:false,
            meassage:"Internal Server Error."
        });
    }
}


// to download the data in an excel sheet

exports.downloadIncomeExcel = async(req,res) => {
    const userId = req.user._id;
    try {
        const income = await incomeModel.find({userId}).sort({date:-1});
        const plainData = income.map((inc) => ({
            description:inc.description,
            amount:inc.amount,
            category:inc.category,
            date:new Date(inc.date).toLocaleDateString()
        }));

        const worksheet = XLSX.utils.json_to_sheet(plainData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook,worksheet,"incomeModel");
        XLSX.writeFile(workbook,"income_details.xlsx");
        res.download("income_details.xlsx");
        
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success:false,
            meassage:"Internal Server Error."
        });
    }
}

exports.getIncomeOverview = async function getIncomeOverview(req, res) {

    try {

        const userId = req.user._id;

        const { range = "monthly" } = req.query;

        const { start, end } = getDateRange(range);

        const incomes = await incomeModel.find({
            userId,
            date: { $gte: start, $lte: end },
        }).sort({ date: -1 });

        const totalIncome = incomes.reduce(
            (acc, cur) => acc + cur.amount,
            0
        );

        const averageIncome =
            incomes.length > 0
                ? totalIncome / incomes.length
                : 0;

        const numberOfTransactions = incomes.length;

        const recentTransactions = incomes.slice(0, 9);

        res.json({
            success: true,
            data: {
                totalIncome,
                averageIncome,
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