const express = require('express');
const router = express.Router();
const { getAuth } = require('@clerk/express'); // <-- Import here too
const { addExpense, getExpensesByCrop } = require('../controllers/expenseController');

// OUR CUSTOM BOUNCER
const protectRoute = (req, res, next) => {
    const auth = getAuth(req);
    
    if (!auth || !auth.userId) {
        return res.status(401).json({ message: "Unauthorized - Please log in" });
    }
    
    req.auth = auth;
    next();
};

// PERSONAL EXPENSE ROUTES (Secure)
router.post('/add', protectRoute, addExpense);
router.get('/:cropId', protectRoute, getExpensesByCrop);

module.exports = router;