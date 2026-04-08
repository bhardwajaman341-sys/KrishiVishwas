const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    cropId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Crop', 
        required: true 
    },
    category: { 
        type: String, 
        // UPDATED: Now includes all the options from your Dashboard dropdown
        enum: ['Seeds', 'Irrigation', 'Labour', 'Fertilizers', 'Pesticides', 'Equipment', 'Labor', 'Fertilizer', 'Other'], 
        required: true 
    },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Expense', ExpenseSchema);