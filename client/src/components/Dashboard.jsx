import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ExpenseChart from './ExpenseChart';
import EnsoExplainer from './EnsoExplainer';
import Chatbot from './Chatbot';
import { useAuth, SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import MspTracker from '../components/MspTracker';

const translations = {
    en: {
        title1: "Krishi", title2: "Vishwas", 
        subtitle1: "Vision 2047: Viksit ", subtitle2: "Bharat",
        searchPlaceholder: "Search Knowledge Bank...", searchBtn: "Search",
        weatherTitle: "Local Weather", temp: "Temp",
        investmentTitle: "Total Farm Investment", downloadBtn: "Download Report",
        cropNamePlace: "Crop Name", acresPlace: "Acres", registerBtn: "Register Field",
        editBtn: "Edit", removeBtn: "Remove", saveBtn: "Save", cancelBtn: "Cancel",
        logCostBtn: "Log Cost", fieldCost: "Field Cost",
        loading: "Loading KrishiVishwas...",
        seeds: "Seeds", irrigation: "Irrigation", labour: "Labour",
        fertilizers: "Fertilizers", pesticides: "Pesticides", equipment: "Equipment",
        amountPlaceholder: "Amount ₹",
        signInBtn: "Sign In",
        lockedTitle: "🔒 Secure Farm Dashboard",
        lockedDesc: "Sign in to register your fields, log expenses, and view your personalized financial charts.",
        yieldPlace: "Yield (Q/Acre)",
        knowledgeResult: "Knowledge Bank Result:",
        cropLabel: "Crop:",
        bestSeasonLabel: "Best Season:",
        recommendedFertilizersLabel: "Recommended Fertilizers:",
        closeResultBtn: "Close Result",
        indexLabel: "Index:",
        rainChanceLabel: "Chance of Rain:",
        fetchingLocation: "Fetching location...",
        currentLocation: "Current Location",
        defaultLocation: "Central India (Default)",
        geoNotSupported: "Geolocation not supported",
        expectedProductionLabel: "Expected Production:",
        quintals: "Quintals",
        estimatedProfitLabel: "Estimated Profit:",
        soilParamsLabel: "Soil Parameters (N, P, K, pH):",
        aiScanBtn: "✨ AI Scan",
        logHistoryLabel: "Log History (Click 🗑️ to remove mistakes):",
        noExpensesLabel: "No expenses logged yet.",
        shcAdviceLabel: "SHC Advice:",
        waitingSoilAnalysis: "Waiting for soil analysis...",
        lowNUrea: "Low N: Apply Urea",
        lowPDAP: "Low P: Apply DAP",
        acidicLime: "Acidic: Apply Lime",
        soilHealthy: "Soil is healthy!",
        confirmRemoveField: "Remove this field?",
        confirmDeleteLog: "Delete this log entry?",
        yieldLabel: "Yield",
        navDashboard: "Main Dashboard",
        navEnso: "ENSO Data",
        navWeather: "Weather",
        navInvest: "Farm Investments",
        navMsp: "Official MSP Rates"
    },
    hi: {
        title1: "कृषि", title2: "विश्वास", 
        subtitle1: "विजन 2047: विकसित ", subtitle2: "भारत",
        searchPlaceholder: "ज्ञान बैंक खोजें...", searchBtn: "खोजें",
        weatherTitle: "स्थानीय मौसम", temp: "तापमान",
        investmentTitle: "कुल कृषि निवेश", downloadBtn: "रिपोर्ट डाउनलोड करें",
        cropNamePlace: "फसल का नाम", acresPlace: "एकड़", registerBtn: "खेत दर्ज करें",
        editBtn: "संपादित करें", removeBtn: "हटाएं", saveBtn: "सहेजें", cancelBtn: "रद्द करें",
        logCostBtn: "लागत दर्ज करें", fieldCost: "खेत की लागत",
        loading: "कृषिविश्वास लोड हो रहा है...",
        seeds: "बीज", irrigation: "सिंचाई", labour: "मज़दूर",
        fertilizers: "उर्वरक", pesticides: "कीटनाशक", equipment: "उपकरण",
        amountPlaceholder: "राशि ₹",
        signInBtn: "साइन इन करें",
        lockedTitle: "🔒 सुरक्षित कृषि डैशबोर्ड",
        lockedDesc: "अपने खेत दर्ज करने, खर्च जोड़ने और अपने व्यक्तिगत वित्तीय चार्ट देखने के लिए साइन इन करें।",
        yieldPlace: "पैदावार (क्व./एकड़)",
        knowledgeResult: "ज्ञान बैंक परिणाम:",
        cropLabel: "फसल:",
        bestSeasonLabel: "सर्वोत्तम मौसम:",
        recommendedFertilizersLabel: "अनुशंसित उर्वरक:",
        closeResultBtn: "परिणाम बंद करें",
        indexLabel: "सूचकांक:",
        rainChanceLabel: "बारिश की संभावना:",
        fetchingLocation: "स्थान प्राप्त किया जा रहा है...",
        currentLocation: "वर्तमान स्थान",
        defaultLocation: "मध्य भारत (डिफ़ॉल्ट)",
        geoNotSupported: "जियोलोकेशन समर्थित नहीं है",
        expectedProductionLabel: "अपेक्षित उत्पादन:",
        quintals: "क्विंटल",
        estimatedProfitLabel: "अनुमानित लाभ:",
        soilParamsLabel: "मिट्टी के पैरामीटर (N, P, K, pH):",
        aiScanBtn: "✨ एआई स्कैन",
        logHistoryLabel: "लॉग इतिहास (गलतियां हटाने के लिए 🗑️ क्लिक करें):",
        noExpensesLabel: "अभी तक कोई खर्च दर्ज नहीं किया गया है।",
        shcAdviceLabel: "एसएचसी सलाह:",
        waitingSoilAnalysis: "मिट्टी विश्लेषण की प्रतीक्षा है...",
        lowNUrea: "कम नाइट्रोजन: यूरिया डालें",
        lowPDAP: "कम फास्फोरस: डीएपी (DAP) डालें",
        acidicLime: "अम्लीय: चूना डालें",
        soilHealthy: "मिट्टी स्वस्थ है!",
        confirmRemoveField: "क्या आप इस खेत को हटाना चाहते हैं?",
        confirmDeleteLog: "क्या आप इस लॉग प्रविष्टि को हटाना चाहते हैं?",
        yieldLabel: "पैदावार",
        navDashboard: "मुख्य डैशबोर्ड",
        navEnso: "ENSO डेटा",
        navWeather: "मौसम",
        navInvest: "कृषि निवेश",
        navMsp: "आधिकारिक एमएसपी दरें"
    }
};

const Dashboard = () => {
    const { getToken, isSignedIn } = useAuth();

// UI States
    const [showSplash, setShowSplash] = useState(true);
    const [isTransitioning, setIsTransitioning] = useState(false); // FOR THE LOGO SCREEN
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const [lang, setLang] = useState('en'); 
    const [ensoData, setEnsoData] = useState(null);
    const [crops, setCrops] = useState([]);
    const [expenses, setExpenses] = useState({});
    const [cropBreakdowns, setCropBreakdowns] = useState({});
    const [individualExpenses, setIndividualExpenses] = useState({});

    const [weatherData, setWeatherData] = useState({ temp: "--", rainChance: "--" });
    const [locationStatusKey, setLocationStatusKey] = useState("fetchingLocation");
    const [loading, setLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    
    const [newCrop, setNewCrop] = useState({ name: '', area: '', expectedYield: '' });
    const [expenseInputs, setExpenseInputs] = useState({});

    const [editingCropId, setEditingCropId] = useState(null);
    const [editForm, setEditForm] = useState({ 
        name: '', area: '', expectedYield: '',
        soilHealth: { nitrogen: 0, phosphorus: 0, potassium: 0, ph: 7, isAnalyzed: false }
    });

    const t = translations[lang];

// TRANSITION HANDLER
    const handleSkipToMain = () => {
        setIsTransitioning(true);
        setTimeout(() => {
            setShowSplash(false);
            setIsTransitioning(false);
        }, 4000); // SHOW LOGO SCREEN FOR 4 SECONDS
    };

    const translateBackendData = (text, currentLang) => {
        if (currentLang === 'en' || !text) return text;
        const hindiMap = {
            "La Niña (Transitioning)": "ला नीना (संक्रमणकालीन)",
            "Weak La Niña conditions observed for early 2026. Ensure proper drainage for crops.": "2026 की शुरुआत के लिए कमजोर ला नीना की स्थिति देखी गई। फसलों के लिए उचित जल निकासी सुनिश्चित करें।"
        };
        return hindiMap[text] || text;
    };

    const getSoilRecommendation = (soil, t) => {
        if (!soil || !soil.isAnalyzed) return t.waitingSoilAnalysis;
        let recs = [];
        if (soil.nitrogen < 150) recs.push(t.lowNUrea);
        if (soil.phosphorus < 10) recs.push(t.lowPDAP);
        if (soil.ph < 6.5) recs.push(t.acidicLime);
        return recs.length > 0 ? recs.join(" | ") : t.soilHealthy;
    };

    const handleAiSoilScan = () => {
        const mockData = {
            nitrogen: Math.floor(Math.random() * 300),
            phosphorus: Math.floor(Math.random() * 30),
            potassium: Math.floor(Math.random() * 200),
            ph: (Math.random() * (8 - 5.5) + 5.5).toFixed(1),
            isAnalyzed: true
        };
        setEditForm(prev => ({ ...prev, soilHealth: mockData }));
    };

    const calculateUserProfit = (crop) => {
        const mspRates = { "paddy": 2369, "rice": 2369, "wheat": 2585, "maize": 2400, "soyabean": 5328, "mustard": 6200, "cotton": 8100 };
        const cropKey = crop.name ? crop.name.toLowerCase().trim() : "";
        const msp = mspRates[cropKey] || 0;
        const totalCost = expenses[crop._id] || 0;
        const totalProduction = Number(crop.area) * Number(crop.expectedYield || 0);
        return (totalProduction * msp) - totalCost;
    };

    const fetchData = async () => {
        try {
            const ensoRes = await axios.get('https://krishivishwas-backend.onrender.com/api/climate/enso');
            setEnsoData(ensoRes.data);

            if (isSignedIn) {
                const token = await getToken();
                const headers = { Authorization: `Bearer ${token}` };
                const cropsRes = await axios.get('https://krishivishwas-backend.onrender.com/api/crops', { headers });
                setCrops(cropsRes.data);

                const totals = {}; const breakdowns = {}; const listData = {}; 
                const categoryMap = { 'Seeds': 0, 'Irrigation': 1, 'Labour': 2, 'Fertilizers': 3, 'Pesticides': 4, 'Equipment': 5 };

                await Promise.all(cropsRes.data.map(async (c) => {
                    const e = await axios.get(`https://krishivishwas-backend.onrender.com/api/expenses/${c._id}`, { headers });
                    totals[c._id] = e.data.total;
                    listData[c._id] = e.data.expenses; 
                    const chartData = [0, 0, 0, 0, 0, 0];
                    e.data.expenses.forEach(exp => {
                        const index = categoryMap[exp.category];
                        if (index !== undefined) chartData[index] += Number(exp.amount);
                    });
                    breakdowns[c._id] = chartData; 
                }));
                setExpenses(totals); setCropBreakdowns(breakdowns); setIndividualExpenses(listData);
            } else {
                setCrops([]); setExpenses({}); setCropBreakdowns({}); setIndividualExpenses({});
            }
        } catch (err) { console.error("Backend Fetch Error:", err); } 
        finally { setLoading(false); }
    };

    const fetchWeather = () => {
        const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (pos) => {
                    try {
                        const { latitude, longitude } = pos.coords;
                        setLocationStatusKey("currentLocation");
                        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`);
                        const data = await response.json();
                        if (data.list && data.list.length > 0) {
                            setWeatherData({ temp: Math.round(data.list[0].main.temp), rainChance: Math.round(data.list[0].pop * 100) });
                        }
                    } catch (weatherErr) { setWeatherData({ temp: 28, rainChance: 10 }); }
                },
                async () => {
                    try {
                        setLocationStatusKey("defaultLocation");
                        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=23.72&lon=85.50&units=metric&appid=${API_KEY}`);
                        const data = await response.json();
                        if (data.list && data.list.length > 0) {
                            setWeatherData({ temp: Math.round(data.list[0].main.temp), rainChance: Math.round(data.list[0].pop * 100) });
                        }
                    } catch (weatherErr) { setWeatherData({ temp: 30, rainChance: 0 }); }
                }
            );
        } else {
            setLocationStatusKey("geoNotSupported"); setWeatherData({ temp: 30, rainChance: 0 });
        }
    };

    useEffect(() => { fetchData(); fetchWeather(); }, [isSignedIn]);

    const handleSearch = async () => {
        if (!searchQuery) return;
        const res = await axios.get(`https://krishivishwas-backend.onrender.com/api/crops/search?q=${searchQuery}`);
        setSearchResult(res.data[0]);
    };

    const handleDelete = async (id) => {
        if (window.confirm(t.confirmRemoveField)) {
            const token = await getToken();
            await axios.delete(`https://krishivishwas-backend.onrender.com/api/crops/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            fetchData();
        }
    };

    const handleAddCrop = async (e) => {
        e.preventDefault();
        const token = await getToken();
        await axios.post('https://krishivishwas-backend.onrender.com/api/crops/add', newCrop, { headers: { Authorization: `Bearer ${token}` } });
        setNewCrop({ name: '', area: '', expectedYield: '' });
        fetchData();
    };

    const handleExpenseChange = (cropId, field, value) => {
        setExpenseInputs(prev => ({ ...prev, [cropId]: { ...prev[cropId], category: prev[cropId]?.category || 'Seeds', [field]: value } }));
    };

    const handleExpense = async (cropId) => {
        const inputForCrop = expenseInputs[cropId];
        if (!inputForCrop || !inputForCrop.amount) return;
        const token = await getToken();
        await axios.post('https://krishivishwas-backend.onrender.com/api/expenses/add', { cropId, amount: inputForCrop.amount, category: inputForCrop.category || 'Seeds' }, { headers: { Authorization: `Bearer ${token}` } });
        setExpenseInputs(prev => ({ ...prev, [cropId]: { amount: '', category: 'Seeds' } }));
        fetchData();
    };

    const handleRemoveExpense = async (expenseId) => {
        if (window.confirm(t.confirmDeleteLog)) {
            try {
                const token = await getToken();
                await axios.delete(`https://krishivishwas-backend.onrender.com/api/expenses/single/${expenseId}`, { headers: { Authorization: `Bearer ${token}` } });
                fetchData();
            } catch (err) { console.error("Error deleting expense:", err); }
        }
    };

    const handleEditClick = (crop) => {
        setEditingCropId(crop._id);
        setEditForm({ name: crop.name, area: crop.area, expectedYield: crop.expectedYield || '', soilHealth: crop.soilHealth || { nitrogen: 0, phosphorus: 0, potassium: 0, ph: 7, isAnalyzed: false } });
    };

    const handleEditSave = async (id) => {
        const token = await getToken();
        const cleanData = { 
            name: editForm.name, 
            area: Number(editForm.area), 
            expectedYield: Number(editForm.expectedYield), 
            soilHealth: { ...editForm.soilHealth, isAnalyzed: true } 
        };
        await axios.put(`https://krishivishwas-backend.onrender.com/api/crops/${id}`, cleanData, { headers: { Authorization: `Bearer ${token}` } });
        setEditingCropId(null);
        fetchData();
    };

    const exportToCSV = () => {
        let csv = "Crop Name,Area (Acres),Total Investment (₹)\n";
        crops.forEach(c => csv += `${c.name},${c.area},${expenses[c._id] || 0}\n`);
        csv += `\nGRAND TOTAL,,${grandTotal}\n`;
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a"); a.href = url; a.download = "KrishiVishwas_Report.csv"; a.click();
    };

    const grandTotal = Object.values(expenses).reduce((a, b) => a + b, 0);

    if (loading) return <h2 style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>{t.loading}</h2>;

    const renderSidebar = () => (
        <div style={{ width: isSidebarOpen ? '260px' : '0px', overflow: 'hidden', background: '#111', borderRight: '1px solid #222', transition: 'width 0.3s ease', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '20px', textAlign: 'center', borderBottom: '1px solid #222' }}>
                <img src="/logo.png" alt="Logo" style={{ width: '60px', height: '60px', borderRadius: '50%', marginBottom: '10px' }} />
                <h2 style={{ margin: 0, color: '#2ecc71', fontSize: '1.2rem' }}>{t.title1}<span style={{color: '#f39c12'}}>{t.title2}</span></h2>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', padding: '15px 10px' }}>
                <button onClick={() => setActiveTab('dashboard')} style={{ textAlign: 'left', padding: '12px 15px', background: activeTab === 'dashboard' ? '#2c3e50' : 'transparent', color: activeTab === 'dashboard' ? '#3498db' : '#ecf0f1', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                    🏠 {t.navDashboard}
                </button>
                <button onClick={() => setActiveTab('enso')} style={{ textAlign: 'left', padding: '12px 15px', background: activeTab === 'enso' ? '#2c3e50' : 'transparent', color: activeTab === 'enso' ? '#3498db' : '#ecf0f1', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                    🌍 {t.navEnso}
                </button>
                <button onClick={() => setActiveTab('weather')} style={{ textAlign: 'left', padding: '12px 15px', background: activeTab === 'weather' ? '#2c3e50' : 'transparent', color: activeTab === 'weather' ? '#3498db' : '#ecf0f1', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                    🌤️ {t.navWeather}
                </button>
                <button onClick={() => setActiveTab('invest')} style={{ textAlign: 'left', padding: '12px 15px', background: activeTab === 'invest' ? '#2c3e50' : 'transparent', color: activeTab === 'invest' ? '#3498db' : '#ecf0f1', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                    💰 {t.navInvest}
                </button>
                <button onClick={() => setActiveTab('msp')} style={{ textAlign: 'left', padding: '12px 15px', background: activeTab === 'msp' ? '#2c3e50' : 'transparent', color: activeTab === 'msp' ? '#3498db' : '#ecf0f1', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                    🌾 {t.navMsp}
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* ENHANCED SPLASH SCREEN WITH TRANSITION */}
            {showSplash && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: '#0f171e', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', boxSizing: 'border-box' }}>
                    {!isTransitioning ? (
                        <>
                            <h1 style={{ color: '#2ecc71', marginBottom: '20px', fontSize: '2.5rem' }}>Welcome to Krishi Vishwas</h1>
                            <video src="/demo-video.mp4" controls autoPlay style={{ width: '100%', maxWidth: '800px', borderRadius: '15px', boxShadow: '0 10px 40px rgba(0,0,0,0.6)', border: '2px solid #34495e', backgroundColor: '#000' }}>
                                Your browser does not support the video tag.
                            </video>
                            <p style={{ color: '#bdc3c7', fontSize: '1.2rem', marginTop: '20px', fontWeight: 'bold' }}>How to use this application ??</p>
                            <div style={{ marginTop: '15px' }}>
                                <button onClick={handleSkipToMain} style={{ padding: '15px 30px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '30px', fontSize: '1.2rem', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 5px 15px rgba(231, 76, 60, 0.4)' }}>
                                    Skip to Main Content ⏭️
                                </button>
                            </div>
                        </>
                    ) : (
                        <div style={{ textAlign: 'center', animation: 'fadeIn 2s ease-in-out' }}>
                            <img src="/logo.png" alt="Logo" style={{ width: '150px', marginBottom: '30px', borderRadius: '50%' }} />
                            <h2 style={{ color: '#f1c40f', fontSize: '2rem', maxWidth: '800px', lineHeight: '1.5', fontStyle: 'italic' }}>
                                "Agriculture is our wisest pursuit, contributing most to real wealth, good morals, and happiness."
                            </h2>
                            <p style={{ color: '#fff', marginTop: '30px', fontSize: '1.1rem', letterSpacing: '3px' }}>ENTERING DASHBOARD...</p>
                        </div>
                    )}
                </div>
            )}

            {/* MAIN DASHBOARD */}
            <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#1e272e', fontFamily: 'sans-serif' }}>
                
                {renderSidebar()}

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto' }}>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 30px', background: '#222f3e', borderBottom: '1px solid #222', position: 'sticky', top: 0, zIndex: 10 }}>
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}>
                            ☰
                        </button>

                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                            <select value={lang} onChange={(e) => setLang(e.target.value)} style={{ background: '#3498db', color: 'white', padding: '8px 15px', borderRadius: '5px', border: 'none', cursor: 'pointer', fontWeight: 'bold', outline: 'none' }}>
                                <option value="en">English</option>
                                <option value="hi">हिंदी (Hindi)</option>
                            </select>
                            <SignedIn><UserButton afterSignOutUrl="/" /></SignedIn>
                            <SignedOut><SignInButton mode="modal"><button style={{ background: '#2ecc71', color: 'white', padding: '8px 20px', borderRadius: '5px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>{t.signInBtn}</button></SignInButton></SignedOut>
                        </div>
                    </div>

                    <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto', width: '100%', boxSizing: 'border-box', color: 'white' }}>
                        
                        {/* THEME-INDEPENDENT SEARCH BAR */}
                        <div style={{ marginBottom: '30px', display: 'flex', gap: '10px' }}>
                            <input 
                                type="text" 
                                placeholder={t.searchPlaceholder} 
                                value={searchQuery} 
                                onChange={(e) => setSearchQuery(e.target.value)} 
                                style={{ 
                                    padding: '15px 25px', 
                                    flex: 1, 
                                    borderRadius: '30px', 
                                    border: '2px solid #bdc3c7', 
                                    background: '#ffffff', 
                                    color: '#2c3e50', 
                                    fontSize: '1rem',
                                    outline: 'none',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                }} 
                            />
                            <button onClick={handleSearch} style={{ background: '#3498db', color: 'white', padding: '0 30px', borderRadius: '30px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>{t.searchBtn}</button>
                        </div>

                        {searchResult && (
                            <div style={{ background: '#2c3e50', padding: '20px', borderRadius: '15px', marginBottom: '30px', borderLeft: '5px solid #3498db' }}>
                                <h3 style={{ margin: '0 0 10px 0', color: '#f1c40f' }}>🔍 {t.knowledgeResult}</h3>
                                <p style={{ margin: '5px 0' }}><strong>{t.cropLabel}</strong> {searchResult.cropName || searchResult.name}</p>
                                {searchResult.bestSeason && <p style={{ margin: '5px 0' }}><strong>{t.bestSeasonLabel}</strong> {searchResult.bestSeason}</p>}
                                {searchResult.fertilizers && searchResult.fertilizers.length > 0 && <p style={{ margin: '5px 0' }}><strong>{t.recommendedFertilizersLabel}</strong> {searchResult.fertilizers.join(', ')}</p>}
                                <button onClick={() => setSearchResult(null)} style={{ marginTop: '15px', background: '#e74c3c', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer' }}>{t.closeResultBtn}</button>
                            </div>
                        )}

                        {activeTab === 'dashboard' && (
                            <>
                                <EnsoExplainer lang={lang} />

                                <SignedIn>
                                    <div style={{ marginTop: '40px' }}>
                                        <h2 style={{ borderBottom: '2px solid #34495e', paddingBottom: '10px', color: '#f1c40f' }}>Personalized Crop Expenses</h2>
                                        
                                        <form onSubmit={handleAddCrop} style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '15px', marginBottom: '30px' }}>
                                            <input type="text" placeholder={t.cropNamePlace} value={newCrop.name} onChange={(e) => setNewCrop({ ...newCrop, name: e.target.value })} style={{ padding: '12px', flex: 2, borderRadius: '8px', background: '#222', border: '1px solid #444', color: 'white' }} required />
                                            <input type="number" placeholder={t.acresPlace} value={newCrop.area} onChange={(e) => setNewCrop({ ...newCrop, area: e.target.value })} style={{ padding: '12px', flex: 1, borderRadius: '8px', background: '#222', border: '1px solid #444', color: 'white' }} required />
                                            <input type="number" placeholder={t.yieldPlace} value={newCrop.expectedYield} onChange={(e) => setNewCrop({ ...newCrop, expectedYield: e.target.value })} style={{ padding: '12px', flex: 1, borderRadius: '8px', background: '#222', border: '1px solid #444', color: 'white' }} required />
                                            <button type="submit" style={{ background: '#2ecc71', color: 'white', border: 'none', padding: '0 25px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>{t.registerBtn}</button>
                                        </form>

                                        <div style={{ display: 'grid', gap: '30px' }}>
                                            {crops.map((crop) => (
                                                <div key={crop._id} style={{ background: '#2c3e50', padding: '25px', borderRadius: '15px', borderLeft: '5px solid #f1c40f', boxShadow: '0 8px 20px rgba(0,0,0,0.2)' }}>
                                                    
                                                    {editingCropId === crop._id ? (
                                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
                                                            <div style={{ display: 'flex', width: '100%', gap: '10px' }}>
                                                                <input type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} style={{ padding: '8px', borderRadius: '5px', flex: 1, background: '#222', color: 'white', border: '1px solid #444' }} />
                                                                <input type="number" value={editForm.area} onChange={(e) => setEditForm({ ...editForm, area: e.target.value })} style={{ padding: '8px', borderRadius: '5px', width: '80px', background: '#222', color: 'white', border: '1px solid #444' }} />
                                                                <input type="number" placeholder={t.yieldLabel} value={editForm.expectedYield} onChange={(e) => setEditForm({ ...editForm, expectedYield: e.target.value })} style={{ padding: '8px', borderRadius: '5px', width: '100px', background: '#333', color: 'white', border: '1px solid #555' }} />
                                                            </div>
                                                            
                                                            <div style={{ width: '100%', marginTop: '10px', padding: '10px', background: 'rgba(52, 152, 219, 0.1)', borderRadius: '8px', borderLeft: '4px solid #3498db' }}>
                                                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: '#3498db', fontWeight: 'bold' }}>🧪 {t.soilParamsLabel}</label>
                                                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                                                                    <input type="number" placeholder="N" value={editForm.soilHealth.nitrogen} onChange={(e) => setEditForm({...editForm, soilHealth: {...editForm.soilHealth, nitrogen: e.target.value}})} style={{ width: '60px', padding: '6px', background: '#222', color: 'white', border: '1px solid #444', borderRadius: '4px' }} />
                                                                    <input type="number" placeholder="P" value={editForm.soilHealth.phosphorus} onChange={(e) => setEditForm({...editForm, soilHealth: {...editForm.soilHealth, phosphorus: e.target.value}})} style={{ width: '60px', padding: '6px', background: '#222', color: 'white', border: '1px solid #444', borderRadius: '4px' }} />
                                                                    <input type="number" placeholder="K" value={editForm.soilHealth.potassium} onChange={(e) => setEditForm({...editForm, soilHealth: {...editForm.soilHealth, potassium: e.target.value}})} style={{ width: '60px', padding: '6px', background: '#222', color: 'white', border: '1px solid #444', borderRadius: '4px' }} />
                                                                    <input type="number" placeholder="pH" step="0.1" value={editForm.soilHealth.ph} onChange={(e) => setEditForm({...editForm, soilHealth: {...editForm.soilHealth, ph: e.target.value}})} style={{ width: '60px', padding: '6px', background: '#222', color: 'white', border: '1px solid #444', borderRadius: '4px' }} />
                                                                    <button type="button" onClick={handleAiSoilScan} style={{ background: '#9b59b6', border: 'none', color: 'white', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold', marginLeft: 'auto' }}>{t.aiScanBtn}</button>
                                                                </div>
                                                            </div>

                                                            <div style={{ width: '100%', display: 'flex', gap: '10px', marginTop: '5px' }}>
                                                                <button onClick={() => handleEditSave(crop._id)} style={{ background: '#2ecc71', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>{t.saveBtn} ✅</button>
                                                                <button onClick={() => setEditingCropId(null)} style={{ background: '#95a5a6', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>{t.cancelBtn}</button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{crop.name} ({crop.area} {t.acresPlace})</h3>
                                                            <div>
                                                                <button onClick={() => handleEditClick(crop)} style={{ background: '#f39c12', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', marginRight: '10px' }}>{t.editBtn} ✏️</button>
                                                                <button onClick={() => handleDelete(crop._id)} style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer' }}>{t.removeBtn} 🗑️</button>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* RESTORED: SHC ADVICE DISPLAY BOX */}
                                                    {crop.soilHealth && crop.soilHealth.isAnalyzed && (
                                                        <div style={{ marginTop: '15px', padding: '15px', background: 'rgba(155, 89, 182, 0.1)', borderRadius: '10px', borderLeft: '5px solid #9b59b6', fontSize: '1rem' }}>
                                                            📡 <strong style={{ color: '#9b59b6' }}>{t.shcAdviceLabel}</strong> <span style={{ color: '#ecf0f1' }}>{getSoilRecommendation(crop.soilHealth, t)}</span>
                                                        </div>
                                                    )}

                                                    <div style={{ marginTop: '15px', padding: '20px', background: 'rgba(46, 204, 113, 0.05)', borderRadius: '10px', border: '1px solid rgba(46, 204, 113, 0.3)' }}>
                                                        <h4 style={{ margin: '0 0 15px 0', color: '#2ecc71', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>📈 Personalized Profit Projection (Vision 2047)</h4>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
                                                            <span style={{ color: '#bdc3c7' }}>{t.expectedProductionLabel}</span>
                                                            <span>{Number(crop.area) * Number(crop.expectedYield || 0)} {t.quintals}</span>
                                                        </div>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', fontWeight: 'bold', fontSize: '1.2rem' }}>
                                                            <span>{t.estimatedProfitLabel}</span>
                                                            <span style={{ color: calculateUserProfit(crop) >= 0 ? '#2ecc71' : '#e74c3c' }}>
                                                                ₹{calculateUserProfit(crop).toLocaleString()}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {cropBreakdowns[crop._id] && (
                                                        <div style={{ marginTop: '30px', background: '#fff', borderRadius: '10px', padding: '20px' }}>
                                                            <ExpenseChart dataValues={cropBreakdowns[crop._id]} />
                                                        </div>
                                                    )}

                                                    <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#111', padding: '15px 20px', borderRadius: '10px', border: '1px solid #333' }}>
                                                        <div style={{ display: 'flex', gap: '10px' }}>
                                                            <select value={expenseInputs[crop._id]?.category || 'Seeds'} onChange={(e) => handleExpenseChange(crop._id, 'category', e.target.value)} style={{ padding: '8px 15px', borderRadius: '5px', background: '#222', color: 'white', border: '1px solid #444' }}>
                                                                <option value="Seeds">{t.seeds}</option>
                                                                <option value="Irrigation">{t.irrigation}</option>
                                                                <option value="Labour">{t.labour}</option>
                                                                <option value="Fertilizers">{t.fertilizers}</option>
                                                                <option value="Pesticides">{t.pesticides}</option>
                                                                <option value="Equipment">{t.equipment}</option>
                                                            </select>
                                                            <input type="number" placeholder={t.amountPlaceholder} value={expenseInputs[crop._id]?.amount || ''} onChange={(e) => handleExpenseChange(crop._id, 'amount', e.target.value)} style={{ width: '120px', padding: '8px 15px', borderRadius: '5px', background: '#222', color: 'white', border: '1px solid #444' }} />
                                                            <button onClick={() => handleExpense(crop._id)} style={{ background: '#3498db', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>{t.logCostBtn}</button>
                                                        </div>
                                                        <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{t.fieldCost}: ₹{expenses[crop._id] || 0}</span>
                                                    </div>
                                                    
                                                    <div style={{ marginTop: '10px', maxHeight: '100px', overflowY: 'auto' }}>
                                                        {individualExpenses[crop._id]?.map((exp) => (
                                                            <div key={exp._id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '5px 10px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                                <span style={{ color: '#95a5a6' }}>{t[exp.category.toLowerCase()]} : <strong style={{ color: 'white' }}>₹{exp.amount}</strong></span>
                                                                <button onClick={() => handleRemoveExpense(exp._id)} style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer' }}>🗑️</button>
                                                            </div>
                                                        ))}
                                                    </div>

                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </SignedIn>
                                <SignedOut>
                                    <div style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(255,255,255,0.05)', borderRadius: '15px', border: '1px dashed #7f8c8d' }}>
                                        <h2 style={{ color: '#f39c12', marginBottom: '15px' }}>{t.lockedTitle}</h2>
                                        <p style={{ color: '#bdc3c7', marginBottom: '25px', fontSize: '1.1rem' }}>{t.lockedDesc}</p>
                                        <SignInButton mode="modal"><button style={{ background: '#3498db', color: 'white', padding: '12px 30px', borderRadius: '30px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem' }}>{t.signInBtn}</button></SignInButton>
                                    </div>
                                </SignedOut>
                            </>
                        )}

                        {activeTab === 'enso' && (
                            <div style={{ background: '#e6f2ff', padding: '30px', borderRadius: '15px', borderLeft: '8px solid #3498db' }}>
                                <h2 style={{ margin: '0 0 20px 0', color: '#2c3e50' }}>🌍 {translateBackendData(ensoData?.phase, lang)}</h2>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2980b9', marginBottom: '15px' }}>
                                    {t.indexLabel} <span style={{ color: '#c0392b' }}>{ensoData?.anomaly}°C</span>
                                </div>
                                <p style={{ fontSize: '1.1rem', opacity: 0.9, lineHeight: '1.6', color: '#2c3e50' }}>{translateBackendData(ensoData?.recommendation, lang)}</p>
                            </div>
                        )}

                        {activeTab === 'weather' && (
                            <div style={{ background: '#fff3e0', padding: '30px', borderRadius: '15px', borderLeft: '8px solid #f39c12' }}>
                                <h2 style={{ margin: '0 0 20px 0', color: '#d35400' }}>🌤️ {t.weatherTitle}</h2>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#d35400', marginBottom: '15px' }}>
                                    {t.temp}: <span style={{ color: '#c0392b' }}>{weatherData.temp}°C</span>
                                </div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#2980b9', marginBottom: '15px' }}>
                                    🌧️ {t.rainChanceLabel} {weatherData.rainChance}%
                                </div>
                                <p style={{ fontSize: '1rem', opacity: 0.8, color: '#d35400' }}>📍 {t[locationStatusKey]}</p>
                            </div>
                        )}

                        {activeTab === 'invest' && (
                            <div style={{ background: '#27ae60', padding: '40px', borderRadius: '15px', textAlign: 'center' }}>
                                <h2 style={{ margin: '0 0 10px 0', opacity: 0.9, color: 'white' }}>{t.investmentTitle}</h2>
                                <p style={{ fontSize: '3rem', fontWeight: 'bold', margin: '0 0 20px 0', color: 'white' }}>₹{grandTotal}</p>
                                <button onClick={exportToCSV} style={{ background: 'white', color: '#27ae60', border: 'none', padding: '12px 25px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.1rem' }}>
                                    📥 {t.downloadBtn}
                                </button>
                            </div>
                        )}

                        {activeTab === 'msp' && (
                            <MspTracker lang={lang} />
                        )}

                    </div>
                    <Chatbot />
                </div>
            </div>
        </>
    );
};

export default Dashboard;