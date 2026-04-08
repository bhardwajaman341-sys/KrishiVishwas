const express = require('express');
const router = express.Router();
const { addExpense, getExpensesByCrop } = require('../controllers/expenseController');

router.post('/add', addExpense);
router.get('/:cropId', getExpensesByCrop);

module.exports = router;