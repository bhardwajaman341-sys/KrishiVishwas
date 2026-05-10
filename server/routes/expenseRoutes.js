const express = require('express');
const router = express.Router();
const { getAuth } = require('@clerk/express'); 
const expenseController = require('../controllers/expenseController'); // Import the whole controller

// OUR CUSTOM BOUNCER (Kept exactly as you had it)
const protectRoute = (req, res, next) => {
    const auth = getAuth(req);
    
    if (!auth || !auth.userId) {
        return res.status(401).json({ message: "Unauthorized - Please log in" });
    }
    
    req.auth = auth;
    next();
};

// PERSONAL EXPENSE ROUTES (Secure)
router.post('/add', protectRoute, expenseController.addExpense);
router.get('/:cropId', protectRoute, expenseController.getExpensesByCrop);

// FIXED: Uses consistent protectRoute and correct controller reference
router.delete('/single/:id', protectRoute, expenseController.deleteExpense);

module.exports = router;