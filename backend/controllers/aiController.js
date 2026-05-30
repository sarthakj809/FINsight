const { GoogleGenerativeAI } = require("@google/generative-ai");

const incomeModel = require("../models/incomeModel");

const expenseModel = require("../models/expenseModel");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.getAIInsights = async (req, res) => {

    try {

        const userId = req.user.id;

        const incomes = await incomeModel.find({ userId });

        const expenses = await expenseModel.find({ userId });

        const totalIncome = incomes.reduce(
            (sum, item) => sum + Number(item.amount || 0),
            0
        );

        const totalExpense = expenses.reduce(
            (sum, item) => sum + Number(item.amount || 0),
            0
        );

        const savings = totalIncome - totalExpense;

        const categoryTotals = {};

        expenses.forEach((exp) => {

            categoryTotals[exp.category] =
                (categoryTotals[exp.category] || 0)
                + exp.amount;

        });

        const topCategory =
            Object.entries(categoryTotals)
                .sort((a, b) => b[1] - a[1])[0];

const prompt = `
You are an AI financial advisor.

Analyze the user's finance data and return the response in proper markdown format.

Use:
# for main headings
## for section headings
- for bullet points

Keep tone modern, smart, concise, and professional.

Include:

# Financial Health Summary

# Spending Analysis

# Savings Advice

# Budget Tips

# Financial Score

Finance Data:

Total Income: ${totalIncome}

Total Expense: ${totalExpense}

Savings: ${savings}

Top Spending Category:
${topCategory ? `${topCategory[0]} : ${topCategory[1]}` : "None"}

Expense Categories:
${JSON.stringify(categoryTotals)}
`;

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
        });

        const result = await model.generateContent(prompt);

        const text = result.response.text();

        return res.json({
            success: true,
            insights: text,
            stats: {
                totalIncome,
                totalExpense,
                savings,
                topCategory,
            },
        });

    } catch (error) {

        console.error("AI ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "AI insights failed",
            error: error.message,
        });

    }

};