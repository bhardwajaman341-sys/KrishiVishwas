const Expense = require('../models/Expense');

// Add a new expense
exports.addExpense = async (req, res) => {
    try {
        const expense = new Expense(req.body);
        await expense.save();
        res.status(201).json(expense);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get expenses for a specific crop
exports.getExpensesByCrop = async (req, res) => {
    try {
        const expenses = await Expense.find({ cropId: req.params.cropId });
        const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
        res.status(200).json({ expenses, total });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};