const mongoose = require('mongoose');

const CropReferenceSchema = new mongoose.Schema({
    cropName: { type: String, required: true, unique: true },
    description: String,
    bestSeason: String,
    fertilizers: [String], 
    commonDiseases: [{
        name: String,
        symptoms: String,
        pesticide: String
    }],
    idealPh: String,
    waterRequirement: String
});

module.exports = mongoose.model('CropReference', CropReferenceSchema);