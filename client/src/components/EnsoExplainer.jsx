import React from 'react';

const EnsoExplainer = () => {
    return (
        <div style={{ background: '#1e272e', padding: '30px', borderRadius: '15px', marginTop: '20px', color: 'white', border: '1px solid #34495e' }}>
            <h2 style={{ color: '#3498db', marginTop: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                📊 ENSO Climate Impact Analysis
            </h2>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', marginTop: '20px' }}>
                
                {/* Text & Data Section */}
                <div style={{ flex: '1 1 400px' }}>
                    <p style={{ lineHeight: '1.6', color: '#bdc3c7' }}>
                        <strong>What is ENSO?</strong> The El Niño-Southern Oscillation is a climate pattern involving changes in the temperature of waters in the central and eastern tropical Pacific Ocean. It shifts between El Niño, La Niña, and Neutral.
                    </p>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '20px' }}>
                        <div style={{ background: 'rgba(231, 76, 60, 0.1)', padding: '15px', borderRadius: '10px', borderLeft: '4px solid #e74c3c' }}>
                            <h4 style={{ color: '#e74c3c', margin: '0 0 10px 0' }}>🔥 El Niño (Warm Phase)</h4>
                            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.9rem', color: '#ecf0f1' }}>
                                <li>Suppresses Indian Monsoon rainfall.</li>
                                <li>High risk of drought in central/western India.</li>
                                <li><strong>Action:</strong> Invest in irrigation, choose drought-resistant crops (Millets).</li>
                            </ul>
                        </div>
                        
                        <div style={{ background: 'rgba(52, 152, 219, 0.1)', padding: '15px', borderRadius: '10px', borderLeft: '4px solid #3498db' }}>
                            <h4 style={{ color: '#3498db', margin: '0 0 10px 0' }}>🌧️ La Niña (Cool Phase)</h4>
                            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.9rem', color: '#ecf0f1' }}>
                                <li>Boosts Indian Monsoon rainfall.</li>
                                <li>Risk of waterlogging and floods.</li>
                                <li><strong>Action:</strong> Ensure field drainage, ideal for water-intensive crops (Rice).</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Video Explainer Section - Replaced your custom audio/video refs with YouTube Iframe */}
                <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#bdc3c7' }}>🎥 ENSO & Indian Monsoon Explained</h4>
                    
                    <div style={{ background: 'black', borderRadius: '10px', overflow: 'hidden', flexGrow: 1, minHeight: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #444' }}>
                        <iframe 
                            width="100%" 
                            height="100%" 
                            src="https://www.youtube.com/embed/pLd3IXqFnkE" 
                            title="ENSO Explained" 
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                            style={{ minHeight: '250px' }}
                        ></iframe>
                    </div>

                    {/* This matches the exact paragraph style from your screenshot */}
                    <p style={{ fontSize: '0.8rem', color: '#7f8c8d', textAlign: 'center', marginTop: '10px' }}>
                        Watch how Pacific currents affect your local farm.
                    </p>
                </div>

            </div>
        </div>
    );
};

export default EnsoExplainer;