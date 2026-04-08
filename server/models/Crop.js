const mongoose = require('mongoose');

const CropSchema = new mongoose.Schema({
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
    }
});

// Important: This exports the model so the Controller can find it
module.exports = mongoose.model('Crop', CropSchema);