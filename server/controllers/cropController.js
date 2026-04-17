const Crop = require('../models/Crop');
const Expense = require('../models/Expense');
const CropReference = require('../models/CropReference');

// --- 1. KNOWLEDGE BANK SEARCH ---
// This allows the farmer to search for any crop in the master database
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

// --- 2. MASTER DATA SEED (The "Agri-Wiki" Database) ---
// Run this once by visiting https://krishivishwas-backend.onrender.com/api/crops/seed in your browser
exports.seedMasterData = async (req, res) => {
    try {
        // Clear existing reference data to prevent duplicates
        await CropReference.deleteMany({}); 
        
        const indianCrops = [
            {
                cropName: "Wheat",
                fertilizers: ["Urea", "DAP", "Potash"],
                commonDiseases: [{ name: "Leaf Rust", symptoms: "Orange-brown pustules on leaves", pesticide: "Propiconazole" }],
                bestSeason: "Rabi (Oct-March)"
            },
            {
                cropName: "Rice (Paddy)",
                fertilizers: ["Zinc Sulphate", "Urea", "DAP"],
                commonDiseases: [{ name: "Blast Disease", symptoms: "Spindle-shaped spots on leaves", pesticide: "Tricyclazole" }],
                bestSeason: "Kharif (June-Nov)"
            },
            {
                cropName: "Cotton",
                fertilizers: ["NPK 12:32:16", "Magnesium Sulphate"],
                commonDiseases: [{ name: "Pink Bollworm", symptoms: "Holes in bolls, stained lint", pesticide: "Spinosad" }],
                bestSeason: "Kharif (May-July)"
            },
            {
                cropName: "Soybean",
                fertilizers: ["Single Super Phosphate", "Muriate of Potash"],
                commonDiseases: [{ name: "Yellow Mosaic", symptoms: "Bright yellow patches on leaves", pesticide: "Thiamethoxam" }],
                bestSeason: "Kharif (June-July)"
            },
            {
                cropName: "Tomato",
                fertilizers: ["Ammonium Sulphate", "Compost"],
                commonDiseases: [{ name: "Early Blight", symptoms: "Concentric rings on lower leaves", pesticide: "Mancozeb" }],
                bestSeason: "Year-round"
            }
        ];

        await CropReference.insertMany(indianCrops);
        res.status(200).json({ message: "Master Database Seeded Successfully with 5 Indian Crops!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// --- 3. PERSONAL CROP MANAGEMENT ---
// Get all crops for the specific logged-in farmer
exports.getCrops = async (req, res) => {
    try {
        // Find crops where the userId matches the logged-in user
        const crops = await Crop.find({ userId: req.auth.userId });
        res.status(200).json(crops);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add a new crop field
exports.addCrop = async (req, res) => {
    try {
        // Attach the userId to the new crop before saving
        const newCrop = new Crop({
            ...req.body,
            userId: req.auth.userId 
        });
        await newCrop.save();
        res.status(201).json(newCrop);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete a crop and its associated expenses
exports.deleteCrop = async (req, res) => {
    try {
        const { id } = req.params;
        // Ensure the user deleting the crop actually owns it
        const deletedCrop = await Crop.findOneAndDelete({ _id: id, userId: req.auth.userId });
        
        if (!deletedCrop) {
            return res.status(404).json({ message: "Crop record not found or unauthorized" });
        }

        // Clean up: Delete all expenses linked to this crop ID
        await Expense.deleteMany({ cropId: id }); 
        
        res.status(200).json({ message: "Crop and associated expenses deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update status
exports.updateCropStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        const updated = await Crop.findOneAndUpdate(
            { _id: id, userId: req.auth.userId }, // Verify ownership
            { status: status }, 
            { returnDocument: 'after' }
        );
        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// FEATURE 3: Update an existing field (name and area)
exports.updateCrop = async (req, res) => {
    try {
        const updatedCrop = await Crop.findOneAndUpdate(
            { _id: req.params.id, userId: req.auth.userId }, // Verify ownership
            { 
                name: req.body.name, 
                area: req.body.area 
            }, 
            { returnDocument: 'after' }
        );
        
        if (!updatedCrop) {
            return res.status(404).json({ message: "Field not found or unauthorized" });
        }
        
        res.json(updatedCrop);
    } catch (error) {
        console.error("Error updating field:", error);
        res.status(500).json({ message: "Server Error" });
    }
};