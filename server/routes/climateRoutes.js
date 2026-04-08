const express = require('express');
const router = express.Router();
const { getEnsoStatus } = require('../controllers/climateController');

router.get('/enso', getEnsoStatus);

module.exports = router;