const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    // NEW: This absolutely must be here to lock the data to a specific user!
    userId: { type: String, required: true },
    
    cropId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Crop', 
        required: true 
    },
    category: { 
        type: String, 
        enum: ['Seeds', 'Irrigation', 'Labour', 'Fertilizers', 'Pesticides', 'Equipment', 'Labor', 'Fertilizer', 'Other'], 
        required: true 
    },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Expense', ExpenseSchema);