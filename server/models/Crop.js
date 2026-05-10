const mongoose = require('mongoose');

const CropSchema = new mongoose.Schema({
    userId: { 
        type: String, 
        required: true 
    },
    name: { 
        type: String, 
        required: true 
    },
    area: { 
        type: Number, 
        required: true 
    }, // Size in acres
    plantingDate: { 
        type: Date, 
        default: Date.now 
    },
    status: { 
        type: String, 
        enum: ['Growing', 'Harvested'], 
        default: 'Growing' 
    },
    expectedYield: { 
        type: Number, 
        default: 0 
    }, 
}, { strict: false }); // <--- CRITICAL: This must be the second argument inside the Schema brackets

// Important: This exports the model so the Controller can find it
module.exports = mongoose.model('Crop', CropSchema);