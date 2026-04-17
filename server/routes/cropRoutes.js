const express = require('express');
const router = express.Router();
const { getAuth } = require('@clerk/express'); // <-- NEW: Import Clerk's extraction tool
const { 
    getCrops, addCrop, deleteCrop, updateCropStatus, 
    searchCropKnowledge, seedMasterData, updateCrop 
} = require('../controllers/cropController');

// OUR CUSTOM BOUNCER (Updated for the newest Clerk version)
const protectRoute = (req, res, next) => {
    const auth = getAuth(req); // <-- Extract the user data the new way!
    
    if (!auth || !auth.userId) {
        return res.status(401).json({ message: "Unauthorized - Please log in" });
    }
    
    // Attach the auth object exactly where our controllers expect it
    req.auth = auth; 
    next();
};

// KNOWLEDGE ROUTES (Public)
router.get('/search', searchCropKnowledge);
router.get('/seed', seedMasterData); 

// PERSONAL CROP ROUTES (Secure)
router.get('/', protectRoute, getCrops);
router.post('/add', protectRoute, addCrop);
router.delete('/:id', protectRoute, deleteCrop);
router.patch('/:id/status', protectRoute, updateCropStatus);
router.put('/:id', protectRoute, updateCrop); 

module.exports = router;