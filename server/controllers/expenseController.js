const Expense = require('../models/Expense');

// Add a new expense
exports.addExpense = async (req, res) => {
    try {
        const expense = new Expense({
            ...req.body,
            userId: req.auth.userId
        });
        await expense.save();
        res.status(201).json(expense);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get expenses for a specific crop
exports.getExpensesByCrop = async (req, res) => {
    try {
        const expenses = await Expense.find({ 
            cropId: req.params.cropId,
            userId: req.auth.userId 
        });
        
        const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
        res.status(200).json({ expenses, total });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE A SINGLE LOG ENTRY (Secure Version)
exports.deleteExpense = async (req, res) => {
    try {
        const { id } = req.params;
        // SECURITY: We ensure the expense belongs to the logged-in user before deleting
        const deleted = await Expense.findOneAndDelete({ 
            _id: id, 
            userId: req.auth.userId 
        });
        
        if (!deleted) {
            return res.status(404).json({ message: "Log entry not found or unauthorized" });
        }
        
        res.status(200).json({ message: "Expense entry removed successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};