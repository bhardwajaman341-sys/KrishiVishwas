import React from 'react';

// ENSO Translation Dictionary
const ensoTranslations = {
    en: {
        title: "ENSO Climate Impact Analysis",
        whatIsEnso: "What is ENSO?",
        ensoDesc: "The El Niño-Southern Oscillation is a climate pattern involving changes in the temperature of waters in the central and eastern tropical Pacific Ocean. It shifts between El Niño, La Niña, and Neutral.",
        elNinoTitle: "El Niño (Warm Phase)",
        elNinoPoints: [
            "Suppresses Indian Monsoon rainfall.",
            "High risk of drought in central/western India.",
            "Action: Invest in irrigation, choose drought-resistant crops (Millets)."
        ],
        laNinaTitle: "La Niña (Cool Phase)",
        laNinaPoints: [
            "Boosts Indian Monsoon rainfall.",
            "Risk of waterlogging and floods.",
            "Action: Ensure field drainage, ideal for water-intensive crops (Rice)."
        ],
        videoTitle: "ENSO & Indian Monsoon Explained",
        videoDesc: "Watch how Pacific currents affect your local farm.",
        actionBold: "Action:"
    },
    hi: {
        title: "ENSO जलवायु प्रभाव विश्लेषण",
        whatIsEnso: "ENSO क्या है?",
        ensoDesc: "अल नीनो-दक्षिणी दोलन एक जलवायु पैटर्न है जिसमें मध्य और पूर्वी उष्णकटिबंधीय प्रशांत महासागर के पानी के तापमान में बदलाव शामिल है। यह अल नीनो, ला नीना और तटस्थ के बीच बदलता रहता है।",
        elNinoTitle: "अल नीनो (गर्म चरण)",
        elNinoPoints: [
            "भारतीय मानसून की वर्षा को दबाता है।",
            "मध्य/पश्चिमी भारत में सूखे का उच्च जोखिम।",
            "कार्रवाई: सिंचाई में निवेश करें, सूखा प्रतिरोधी फसलें (बाजरा) चुनें।"
        ],
        laNinaTitle: "ला नीना (ठंडा चरण)",
        laNinaPoints: [
            "भारतीय मानसून की वर्षा को बढ़ाता है।",
            "जलभराव और बाढ़ का खतरा।",
            "कार्रवाई: खेत में जल निकासी सुनिश्चित करें, पानी वाली फसलों (चावल) के लिए आदर्श।"
        ],
        videoTitle: "ENSO और भारतीय मानसून की व्याख्या",
        videoDesc: "देखें कि प्रशांत धाराएँ आपके स्थानीय खेत को कैसे प्रभावित करती हैं।",
        actionBold: "कार्रवाई:"
    }
};

// Accept 'lang' as a prop
const EnsoExplainer = ({ lang = 'en' }) => {
    const t = ensoTranslations[lang];

    return (
        <div style={{ background: '#1e272e', padding: '30px', borderRadius: '15px', marginBottom: '30px', border: '1px solid #34495e', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            
            {/* Left Side: The Explanation & Cards */}
            <div style={{ flex: '1 1 500px' }}>
                <h2 style={{ color: '#3498db', marginTop: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    📊 {t.title}
                </h2>
                <p style={{ color: '#ecf0f1', lineHeight: '1.6', fontSize: '1.1rem' }}>
                    <strong>{t.whatIsEnso}</strong> {t.ensoDesc}
                </p>

                <div style={{ display: 'flex', gap: '15px', marginTop: '20px', flexWrap: 'wrap' }}>
                    {/* El Nino Card */}
                    <div style={{ flex: 1, background: '#2c3e50', padding: '20px', borderRadius: '10px', borderLeft: '5px solid #e74c3c' }}>
                        <h4 style={{ color: '#e74c3c', margin: '0 0 10px 0' }}>🔥 {t.elNinoTitle}</h4>
                        <ul style={{ color: '#bdc3c7', paddingLeft: '20px', margin: 0, lineHeight: '1.5' }}>
                            <li>{t.elNinoPoints[0]}</li>
                            <li>{t.elNinoPoints[1]}</li>
                            <li><strong>{t.actionBold}</strong> {t.elNinoPoints[2].replace("Action: ", "").replace("कार्रवाई: ", "")}</li>
                        </ul>
                    </div>

                    {/* La Nina Card */}
                    <div style={{ flex: 1, background: '#2c3e50', padding: '20px', borderRadius: '10px', borderLeft: '5px solid #3498db' }}>
                        <h4 style={{ color: '#3498db', margin: '0 0 10px 0' }}>🌧️ {t.laNinaTitle}</h4>
                        <ul style={{ color: '#bdc3c7', paddingLeft: '20px', margin: 0, lineHeight: '1.5' }}>
                            <li>{t.laNinaPoints[0]}</li>
                            <li>{t.laNinaPoints[1]}</li>
                            <li><strong>{t.actionBold}</strong> {t.laNinaPoints[2].replace("Action: ", "").replace("कार्रवाई: ", "")}</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Right Side: The Local Video Stack */}
            <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <h3 style={{ color: '#95a5a6', marginTop: 0, marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    🎥 {t.videoTitle}
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
                    {t.videoDesc}
                </p>
            </div>
            
        </div>
    );
};

export default EnsoExplainer;