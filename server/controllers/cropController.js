const Crop = require('../models/Crop');
const Expense = require('../models/Expense');
const CropReference = require('../models/CropReference');

// --- 1. KNOWLEDGE BANK SEARCH ---
exports.searchCropKnowledge = async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) return res.status(400).json({ message: "Search query is required" });

        const results = await CropReference.find({
            cropName: { $regex: query, $options: 'i' }
        });
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// --- 2. MASTER DATA SEED ---
exports.seedMasterData = async (req, res) => {
    try {
        await CropReference.deleteMany({}); 
        const indianCrops = [
            { cropName: "Wheat", fertilizers: ["Urea", "DAP", "Potash"], bestSeason: "Rabi (Oct-March)" },
            { cropName: "Rice (Paddy)", fertilizers: ["Zinc Sulphate", "Urea", "DAP"], bestSeason: "Kharif (June-Nov)" },
            { cropName: "Cotton", fertilizers: ["NPK 12:32:16"], bestSeason: "Kharif (May-July)" },
            { cropName: "Soybean", fertilizers: ["SSP", "MOP"], bestSeason: "Kharif (June-July)" },
            { cropName: "Tomato", fertilizers: ["Ammonium Sulphate"], bestSeason: "Year-round" }
        ];
        await CropReference.insertMany(indianCrops);
        res.status(200).json({ message: "Master Database Seeded Successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// --- 3. PERSONAL CROP MANAGEMENT ---

exports.getCrops = async (req, res) => {
    try {
        const crops = await Crop.find({ userId: req.auth.userId });
        res.status(200).json(crops);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addCrop = async (req, res) => {
    try {
        const { name, area, expectedYield, soilHealth } = req.body;
        
        const newCrop = new Crop({
            userId: req.auth.userId,
            name: name,
            area: Number(area),
            expectedYield: Number(expectedYield || 0),
            // Added SHC support
            soilHealth: soilHealth || { nitrogen: 0, phosphorus: 0, potassium: 0, ph: 7, isAnalyzed: false }
        });

        const saved = await newCrop.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteCrop = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCrop = await Crop.findOneAndDelete({ _id: id, userId: req.auth.userId });
        
        if (!deletedCrop) {
            return res.status(404).json({ message: "Unauthorized or not found" });
        }
        await Expense.deleteMany({ cropId: id }); 
        res.status(200).json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateCropStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updated = await Crop.findOneAndUpdate(
            { _id: id, userId: req.auth.userId },
            { status: status }, 
            { new: true }
        );
        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateCrop = async (req, res) => {
    try {
        const { name, area, expectedYield, soilHealth } = req.body;
        
        const updatedCrop = await Crop.findOneAndUpdate(
            { _id: req.params.id, userId: req.auth.userId },
            { 
                $set: { 
                    name, 
                    area: Number(area), 
                    expectedYield: Number(expectedYield),
                    // Updated to save SHC data
                    soilHealth: soilHealth 
                } 
            },
            { returnDocument: 'after', runValidators: false } 
        );
        
        res.json(updatedCrop);
    } catch (error) {
        res.status(500).json({ message: "Update failed", error: error.message });
    }
};