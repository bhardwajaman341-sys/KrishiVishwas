const express = require('express');
const router = express.Router();
const axios = require('axios');

// Official fallback data for 2025-26
const fallbackMsp = [
    { crop: "Paddy (Common)", msp: 2369, year: "2025-26" },
    { crop: "Wheat", msp: 2585, year: "2025-26" },
    { crop: "Maize", msp: 2400, year: "2025-26" },
    { crop: "Soyabean (Yellow)", msp: 5328, year: "2025-26" },
    { crop: "Mustard", msp: 6200, year: "2025-26" },
    { crop: "Cotton (Long Staple)", msp: 8100, year: "2025-26" }
];

router.get('/live', async (req, res) => {
    try {
        const apiKey = process.env.GOVT_DATA_API_KEY;
        // Updated URL with a higher limit and sorted by year
        const url = `https://api.data.gov.in/resource/05d490f4-9048-4d90-7a3d-25e731adeed8?api-key=${apiKey}&format=json&limit=50`;

        const response = await axios.get(url);
        const rawRecords = response.data.records || [];

        if (rawRecords.length > 0) {
            const cleanData = rawRecords.map(item => ({
                crop: item.commodity || item.crop || "Unknown Crop",
                msp: item.msp_price || item.minimum_support_price || 0,
                year: item.year || "N/A"
            }));
            return res.json(cleanData);
        }

        // If API returns empty [], send the fallback data
        console.log("Using fallback MSP data...");
        res.json(fallbackMsp);

    } catch (error) {
        console.error("Govt API Error, serving fallback:", error.message);
        res.json(fallbackMsp); // Always show data, even if the API crashes
    }
});

module.exports = router;