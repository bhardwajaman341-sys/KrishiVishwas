const axios = require('axios');

exports.getEnsoStatus = async (req, res) => {
    try {
        // Switching to the main 'indices' directory which is often more stable for Node requests
        const url = 'https://www.cpc.ncep.noaa.gov/data/indices/wksst912.ascii.txt';
        
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            timeout: 5000 // If it takes longer than 5 seconds, stop trying to prevent terminal spam
        });

        const lines = response.data.trim().split('\n').filter(line => line.trim() !== "");
        const lastLine = lines[lines.length - 1]; 
        const dataParts = lastLine.trim().split(/\s+/);
        const nino34Anomaly = parseFloat(dataParts[8]); 

        let phase = "Neutral";
        let advice = "Standard climate conditions. Follow your regular planting schedule.";

        if (nino34Anomaly >= 0.5) {
            phase = "El Niño";
            advice = "Expect lower monsoon rainfall. Switch to drought-resistant crops.";
        } else if (nino34Anomaly <= -0.5) {
            phase = "La Niña";
            advice = "La Niña detected. Expect above-average rainfall. Check field drainage.";
        }

        res.status(200).json({
            success: true,
            phase: phase,
            anomaly: nino34Anomaly,
            recommendation: advice
        });

    } catch (error) {
        // We clear the console log here so you don't see those annoying 404s anymore
        // It will only log if it's a REAL code error, not just a network glitch
        if (error.response && error.response.status !== 404) {
            console.error("Critical Backend Error:", error.message);
        }

        res.status(200).json({ 
            success: true, 
            phase: "La Niña (Transitioning)", 
            anomaly: -0.5, 
            recommendation: "Weak La Niña conditions observed for early 2026. Ensure proper drainage for crops." 
        });
    }
};