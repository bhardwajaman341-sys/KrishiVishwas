import React from 'react';

const EnsoExplainer = () => {
    return (
        <div style={{ background: '#1e272e', padding: '30px', borderRadius: '15px', marginBottom: '30px', border: '1px solid #34495e', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            
            {/* Left Side: The Explanation & Cards */}
            <div style={{ flex: '1 1 500px' }}>
                <h2 style={{ color: '#3498db', marginTop: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    📊 ENSO Climate Impact Analysis
                </h2>
                <p style={{ color: '#ecf0f1', lineHeight: '1.6', fontSize: '1.1rem' }}>
                    <strong>What is ENSO?</strong> The El Niño-Southern Oscillation is a climate pattern involving changes in the temperature of waters in the central and eastern tropical Pacific Ocean. It shifts between El Niño, La Niña, and Neutral.
                </p>

                <div style={{ display: 'flex', gap: '15px', marginTop: '20px', flexWrap: 'wrap' }}>
                    {/* El Nino Card */}
                    <div style={{ flex: 1, background: '#2c3e50', padding: '20px', borderRadius: '10px', borderLeft: '5px solid #e74c3c' }}>
                        <h4 style={{ color: '#e74c3c', margin: '0 0 10px 0' }}>🔥 El Niño (Warm Phase)</h4>
                        <ul style={{ color: '#bdc3c7', paddingLeft: '20px', margin: 0, lineHeight: '1.5' }}>
                            <li>Suppresses Indian Monsoon rainfall.</li>
                            <li>High risk of drought in central/western India.</li>
                            <li><strong>Action:</strong> Invest in irrigation, choose drought-resistant crops (Millets).</li>
                        </ul>
                    </div>

                    {/* La Nina Card */}
                    <div style={{ flex: 1, background: '#2c3e50', padding: '20px', borderRadius: '10px', borderLeft: '5px solid #3498db' }}>
                        <h4 style={{ color: '#3498db', margin: '0 0 10px 0' }}>🌧️ La Niña (Cool Phase)</h4>
                        <ul style={{ color: '#bdc3c7', paddingLeft: '20px', margin: 0, lineHeight: '1.5' }}>
                            <li>Boosts Indian Monsoon rainfall.</li>
                            <li>Risk of waterlogging and floods.</li>
                            <li><strong>Action:</strong> Ensure field drainage, ideal for water-intensive crops (Rice).</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Right Side: The Local Video Stack */}
            <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <h3 style={{ color: '#95a5a6', marginTop: 0, marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    🎥 ENSO & Indian Monsoon Explained
                </h3>
                
                {/* Scrollable container so it doesn't get too tall with 3 videos */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '400px', overflowY: 'auto', paddingRight: '10px' }}>
                    
                    {/* Video 1 */}
                    <div style={{ borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', background: '#000' }}>
                        <video width="100%" controls style={{ display: 'block' }}>
                            <source src="/enso1.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>

                    {/* Video 2 */}
                    <div style={{ borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', background: '#000' }}>
                        <video width="100%" controls style={{ display: 'block' }}>
                            <source src="/enso2.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>

                    {/* Video 3 */}
                    <div style={{ borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', background: '#000' }}>
                        <video width="100%" controls style={{ display: 'block' }}>
                            <source src="/enso3.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>

                </div>

                <p style={{ color: '#7f8c8d', fontSize: '0.9rem', textAlign: 'center', marginTop: '10px' }}>
                    Watch how Pacific currents affect your local farm.
                </p>
            </div>
            
        </div>
    );
};

export default EnsoExplainer;