import React from 'react';

// Hardcoded MSP Data with English and Hindi translations
const mspData = [
    { key: 'paddy', en: 'Paddy (Common)', hi: 'धान (सामान्य)', price: 2369 },
    { key: 'wheat', en: 'Wheat', hi: 'गेहूं', price: 2585 },
    { key: 'maize', en: 'Maize', hi: 'मक्का', price: 2400 },
    { key: 'soyabean', en: 'Soyabean (Yellow)', hi: 'सोयाबीन (पीला)', price: 5328 },
    { key: 'mustard', en: 'Mustard', hi: 'सरसों', price: 6200 },
    { key: 'cotton', en: 'Cotton (Long Staple)', hi: 'कपास (लंबा रेशा)', price: 8100 }
];

const translations = {
    en: {
        title: "Official MSP Rates (2025-26)",
        cropHeader: "CROP",
        priceHeader: "PRICE (₹/Q)"
    },
    hi: {
        title: "आधिकारिक एमएसपी दरें (2025-26)",
        cropHeader: "फसल",
        priceHeader: "मूल्य (₹/क्विंटल)"
    }
};

const MspTracker = ({ lang = 'en' }) => {
    const t = translations[lang];

    return (
        <div style={{ background: '#111111', padding: '20px', borderRadius: '10px', color: 'white', fontFamily: 'sans-serif', border: '1px solid #222' }}>
            <h3 style={{ color: '#2ecc71', textAlign: 'center', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                🌾 {t.title}
            </h3>
            
            {/* Table Headers */}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #333', paddingBottom: '10px', color: '#7f8c8d', fontSize: '0.85rem', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' }}>
                <span>{t.cropHeader}</span>
                <span>{t.priceHeader}</span>
            </div>

            {/* Scrollable Data List */}
            <div style={{ maxHeight: '300px', overflowY: 'auto', marginTop: '10px', paddingRight: '10px' }}>
                {mspData.map((item) => (
                    <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid #222' }}>
                        {/* Dynamically render English or Hindi based on the lang prop */}
                        <span style={{ fontSize: '1rem', color: '#ecf0f1' }}>
                            {lang === 'hi' ? item.hi : item.en}
                        </span>
                        <span style={{ fontWeight: 'bold', fontSize: '1.05rem' }}>₹{item.price}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MspTracker;