const express = require('express');
const router = express.Router();
const { 
    getCrops, addCrop, deleteCrop, updateCropStatus, 
    searchCropKnowledge, seedMasterData, 
    updateCrop // FEATURE 3: Imported our new controller function
} = require('../controllers/cropController');

router.get('/', getCrops);
router.post('/add', addCrop);
router.delete('/:id', deleteCrop);
router.patch('/:id/status', updateCropStatus);

// FEATURE 3: The new Update Route
router.put('/:id', updateCrop); 

// KNOWLEDGE ROUTES
router.get('/search', searchCropKnowledge);
router.get('/seed', seedMasterData); // SET TO GET FOR EASY BROWSER ACCESS

module.exports = router;