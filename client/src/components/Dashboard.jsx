import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ExpenseChart from './ExpenseChart';
import EnsoExplainer from './EnsoExplainer';
import Chatbot from './Chatbot';
import { useAuth, SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';

// --- TRANSLATION DICTIONARY ---
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
        lockedDesc: "Sign in to register your fields, log expenses, and view your personalized financial charts."
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
        lockedDesc: "अपने खेत दर्ज करने, खर्च जोड़ने और अपने व्यक्तिगत वित्तीय चार्ट देखने के लिए साइन इन करें।"
    }
};

const Dashboard = () => {
    // --- AUTHENTICATION ---
    const { getToken, isSignedIn } = useAuth(); // Grabbing the Clerk token tool

    // --- STATE MANAGEMENT ---
    const [lang, setLang] = useState('en'); 
    const [ensoData, setEnsoData] = useState(null);
    const [crops, setCrops] = useState([]);
    const [expenses, setExpenses] = useState({});
    const [cropBreakdowns, setCropBreakdowns] = useState({});
    
    const [weatherData, setWeatherData] = useState({ temp: "--", rainChance: "--" });
    const [locationStatus, setLocationStatus] = useState("Fetching location...");
    const [loading, setLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [newCrop, setNewCrop] = useState({ name: '', area: '' });
    const [expenseInputs, setExpenseInputs] = useState({});

    const [editingCropId, setEditingCropId] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', area: '' });

    const t = translations[lang];

    // --- DATA FETCHING ---
    const fetchData = async () => {
        try {
            // 1. Fetch Public ENSO data (No token needed)
            const ensoRes = await axios.get('https://krishivishwas-backend.onrender.com/api/climate/enso');
            setEnsoData(ensoRes.data);

            // 2. Fetch Secure Crop Data (ONLY if user is logged in)
            if (isSignedIn) {
                const token = await getToken();
                const headers = { Authorization: `Bearer ${token}` };

                const cropsRes = await axios.get('https://krishivishwas-backend.onrender.com/api/crops', { headers });
                setCrops(cropsRes.data);

                const totals = {};
                const breakdowns = {};
                const categoryMap = {
                    'Seeds': 0, 'Irrigation': 1, 'Labour': 2,
                    'Fertilizers': 3, 'Pesticides': 4, 'Equipment': 5
                };

                await Promise.all(cropsRes.data.map(async (c) => {
                    const e = await axios.get(`https://krishivishwas-backend.onrender.com/api/expenses/${c._id}`, { headers });
                    totals[c._id] = e.data.total;
                    
                    const chartData = [0, 0, 0, 0, 0, 0];
                    e.data.expenses.forEach(exp => {
                        const index = categoryMap[exp.category];
                        if (index !== undefined) {
                            chartData[index] += Number(exp.amount);
                        }
                    });

                    breakdowns[c._id] = chartData; 
                }));

                setExpenses(totals);
                setCropBreakdowns(breakdowns);
            } else {
                // If logged out, clear the secure data
                setCrops([]);
                setExpenses({});
                setCropBreakdowns({});
            }
        } catch (err) {
            console.error("Backend Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchWeather = () => {
        const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (pos) => {
                    try {
                        const { latitude, longitude } = pos.coords;
                        setLocationStatus("Current Location");
                        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`);
                        const data = await response.json();

                        if (data.list && data.list.length > 0) {
                            setWeatherData({
                                temp: Math.round(data.list[0].main.temp),
                                rainChance: Math.round(data.list[0].pop * 100)
                            });
                        }
                    } catch (weatherErr) {
                        setWeatherData({ temp: 28, rainChance: 10 });
                    }
                },
                async () => {
                    try {
                        setLocationStatus("Central India (Default)");
                        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=23.72&lon=85.50&units=metric&appid=${API_KEY}`);
                        const data = await response.json();

                        if (data.list && data.list.length > 0) {
                            setWeatherData({
                                temp: Math.round(data.list[0].main.temp),
                                rainChance: Math.round(data.list[0].pop * 100)
                            });
                        }
                    } catch (weatherErr) {
                        setWeatherData({ temp: 30, rainChance: 0 });
                    }
                }
            );
        } else {
            setLocationStatus("Geolocation not supported");
            setWeatherData({ temp: 30, rainChance: 0 });
        }
    };

    // Re-run fetchData whenever the user logs in or out
    useEffect(() => {
        fetchData();
        fetchWeather();
    }, [isSignedIn]);

    // --- LOGIC HANDLERS (With Tokens attached) ---
    const handleSearch = async () => {
        if (!searchQuery) return;
        // Knowledge Bank is public, no token needed
        const res = await axios.get(`https://krishivishwas-backend.onrender.com/api/crops/search?q=${searchQuery}`);
        setSearchResult(res.data[0]);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Remove this field?")) {
            const token = await getToken();
            await axios.delete(`https://krishivishwas-backend.onrender.com/api/crops/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            fetchData();
        }
    };

    const handleAddCrop = async (e) => {
        e.preventDefault();
        const token = await getToken();
        await axios.post('https://krishivishwas-backend.onrender.com/api/crops/add', newCrop, { headers: { Authorization: `Bearer ${token}` } });
        setNewCrop({ name: '', area: '' });
        fetchData();
    };

    const handleExpenseChange = (cropId, field, value) => {
        setExpenseInputs(prev => ({
            ...prev,
            [cropId]: {
                ...prev[cropId],
                category: prev[cropId]?.category || 'Seeds',
                [field]: value
            }
        }));
    };

    const handleExpense = async (cropId) => {
        const inputForCrop = expenseInputs[cropId];
        if (!inputForCrop || !inputForCrop.amount) return;

        const token = await getToken();
        await axios.post('https://krishivishwas-backend.onrender.com/api/expenses/add', {
            cropId,
            amount: inputForCrop.amount,
            category: inputForCrop.category || 'Seeds'
        }, { headers: { Authorization: `Bearer ${token}` } });

        setExpenseInputs(prev => ({
            ...prev,
            [cropId]: { amount: '', category: 'Seeds' }
        }));
        fetchData();
    };

    const handleEditClick = (crop) => {
        setEditingCropId(crop._id);
        setEditForm({ name: crop.name, area: crop.area });
    };

    const handleEditSave = async (id) => {
        const token = await getToken();
        await axios.put(`https://krishivishwas-backend.onrender.com/api/crops/${id}`, editForm, { headers: { Authorization: `Bearer ${token}` } });
        setEditingCropId(null);
        fetchData();
    };

    const exportToCSV = () => {
        let csv = "Crop Name,Area (Acres),Total Investment (₹)\n";
        crops.forEach(c => csv += `${c.name},${c.area},${expenses[c._id] || 0}\n`);
        csv += `\nGRAND TOTAL,,${grandTotal}\n`;
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "KrishiVishwas_Report.csv";
        a.click();
    };

    const grandTotal = Object.values(expenses).reduce((a, b) => a + b, 0);

    if (loading) return <h2 style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>{t.loading}</h2>;

    return (
        <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto', color: 'white', fontFamily: 'sans-serif' }}>

            {/* Top Bar: Language Switcher & Authentication */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <select
                    value={lang}
                    onChange={(e) => setLang(e.target.value)}
                    style={{ background: '#3498db', color: 'white', padding: '8px 15px', borderRadius: '5px', border: 'none', cursor: 'pointer', fontWeight: 'bold', outline: 'none' }}
                >
                    <option value="en">English</option>
                    <option value="hi">हिंदी (Hindi)</option>
                </select>

                <SignedIn>
                    <UserButton afterSignOutUrl="/" />
                </SignedIn>
                
                <SignedOut>
                    <SignInButton mode="modal">
                        <button style={{ background: '#2ecc71', color: 'white', padding: '8px 20px', borderRadius: '5px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                            {t.signInBtn}
                        </button>
                    </SignInButton>
                </SignedOut>
            </div>

            <header style={{ textAlign: 'center', marginBottom: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img
                    src="/logo.png"
                    alt="KrishiVishwas Logo"
                    style={{ width: '100px', height: '100px', marginBottom: '15px', borderRadius: '50%', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}
                />

                <h1 style={{ fontSize: 'clamp(2.5rem, 10vw, 4.5rem)', margin: 0, fontWeight: '900', letterSpacing: '-1px', textAlign: 'center' }}>
                    <span style={{ color: '#ff9800' }}>{t.title1}</span><span style={{ color: '#2ecc71' }}>{t.title2}</span>
                </h1>
                
                <p style={{ color: '#ffffff', margin: '35px 0 0 0', letterSpacing: '2px', textTransform: 'uppercase', fontSize: 'clamp(0.7rem, 3vw, 1rem)', textAlign: 'center', fontWeight: 'bold' }}>
                    {t.subtitle1}{t.subtitle2}
                </p>
            </header>

            {/* Public Knowledge Bank Search */}
            <div style={{ marginBottom: '30px', display: 'flex', gap: '10px' }}>
                <input type="text" placeholder={t.searchPlaceholder} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ padding: '15px', flex: 1, borderRadius: '30px', border: 'none', background: 'rgba(255,255,255,0.1)', color: 'white' }} />
                <button onClick={handleSearch} style={{ background: '#3498db', color: 'white', padding: '0 30px', borderRadius: '30px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>{t.searchBtn}</button>
            </div>

            {searchResult && (
                <div style={{ background: '#2c3e50', padding: '20px', borderRadius: '15px', marginBottom: '30px', borderLeft: '5px solid #3498db' }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#f1c40f' }}>🔍 Knowledge Bank Result:</h3>
                    <p style={{ margin: '5px 0' }}><strong>Crop:</strong> {searchResult.cropName || searchResult.name}</p>
                    {searchResult.bestSeason && <p style={{ margin: '5px 0' }}><strong>Best Season:</strong> {searchResult.bestSeason}</p>}
                    {searchResult.fertilizers && searchResult.fertilizers.length > 0 && <p style={{ margin: '5px 0' }}><strong>Recommended Fertilizers:</strong> {searchResult.fertilizers.join(', ')}</p>}
                    {searchResult.area && <p style={{ margin: '5px 0' }}><strong>Area:</strong> {searchResult.area} Acres</p>}
                    <button onClick={() => setSearchResult(null)} style={{ marginTop: '15px', background: '#e74c3c', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer' }}>Close Result</button>
                </div>
            )}

            {/* Top Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                
                <div style={{ background: '#e6f2ff', color: '#2c3e50', padding: '20px', borderRadius: '15px', borderBottom: '5px solid #3498db' }}>
                    <h3 style={{ margin: 0 }}>🌍 {ensoData?.phase}</h3>
                    <div style={{ margin: '10px 0', fontSize: '1.2rem', fontWeight: 'bold', color: '#2980b9' }}>
                        Index: <span style={{ color: '#c0392b' }}>{ensoData?.anomaly}°C</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>{ensoData?.recommendation}</p>
                </div>

                <div style={{ background: '#fff3e0', color: '#d35400', padding: '20px', borderRadius: '15px', borderBottom: '5px solid #f39c12' }}>
                    <h3 style={{ margin: 0 }}>🌤️ {t.weatherTitle}</h3>
                    <div style={{ margin: '10px 0', fontSize: '1.2rem', fontWeight: 'bold' }}>
                        {t.temp}: <span style={{ color: '#c0392b' }}>{weatherData.temp}°C</span>
                    </div>
                    <div style={{ margin: '5px 0', fontSize: '1rem', fontWeight: 'bold', color: '#2980b9' }}>
                        🌧️ Chance of Rain: {weatherData.rainChance}%
                    </div>
                    <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>📍 {locationStatus}</p>
                </div>

                <SignedIn>
                    <div style={{ background: '#27ae60', padding: '20px', borderRadius: '15px', textAlign: 'right' }}>
                        <h3 style={{ margin: 0, opacity: 0.8 }}>{t.investmentTitle}</h3>
                        <p style={{ fontSize: '2.2rem', fontWeight: 'bold', margin: 0 }}>₹{grandTotal}</p>
                        <button onClick={exportToCSV} style={{ marginTop: '10px', background: 'white', color: '#27ae60', border: 'none', padding: '8px 12px', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
                            📥 {t.downloadBtn}
                        </button>
                    </div>
                </SignedIn>
            </div>

            <EnsoExplainer />

            {/* --- SECURE DATA ENTRY ZONE --- */}
            <SignedIn>
                <form onSubmit={handleAddCrop} style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '15px', marginBottom: '30px', marginTop: '30px' }}>
                    <input type="text" placeholder={t.cropNamePlace} value={newCrop.name} onChange={(e) => setNewCrop({ ...newCrop, name: e.target.value })} style={{ padding: '12px', flex: 2, borderRadius: '8px', background: '#222', border: '1px solid #444', color: 'white' }} required />
                    <input type="number" placeholder={t.acresPlace} value={newCrop.area} onChange={(e) => setNewCrop({ ...newCrop, area: e.target.value })} style={{ padding: '12px', flex: 1, borderRadius: '8px', background: '#222', border: '1px solid #444', color: 'white' }} required />
                    <button type="submit" style={{ background: '#2ecc71', color: 'white', border: 'none', padding: '0 25px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>{t.registerBtn}</button>
                </form>

                <div style={{ display: 'grid', gap: '20px' }}>
                    {crops.map((crop) => (
                        <div key={crop._id} style={{ background: '#2c3e50', padding: '25px', borderRadius: '15px', borderLeft: '5px solid #f1c40f' }}>
                            {editingCropId === crop._id ? (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
                                    <input type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} style={{ padding: '8px', borderRadius: '5px' }} />
                                    <input type="number" value={editForm.area} onChange={(e) => setEditForm({ ...editForm, area: e.target.value })} style={{ padding: '8px', borderRadius: '5px', width: '80px' }} />
                                    <button onClick={() => handleEditSave(crop._id)} style={{ background: '#2ecc71', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }}>{t.saveBtn} ✅</button>
                                    <button onClick={() => setEditingCropId(null)} style={{ background: '#95a5a6', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }}>{t.cancelBtn}</button>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h3 style={{ margin: 0 }}>{crop.name} ({crop.area} {t.acresPlace})</h3>
                                    <div>
                                        <button onClick={() => handleEditClick(crop)} style={{ background: '#f39c12', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', marginRight: '10px' }}>{t.editBtn} ✏️</button>
                                        <button onClick={() => handleDelete(crop._id)} style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer' }}>{t.removeBtn} 🗑️</button>
                                    </div>
                                </div>
                            )}

                            {cropBreakdowns[crop._id] && (
                                <div style={{ marginTop: '20px' }}>
                                    <ExpenseChart dataValues={cropBreakdowns[crop._id]} />
                                </div>
                            )}

                            <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '10px' }}>
                                <select value={expenseInputs[crop._id]?.category || 'Seeds'} onChange={(e) => handleExpenseChange(crop._id, 'category', e.target.value)} style={{ padding: '5px', borderRadius: '5px' }}>
                                    <option value="Seeds">{t.seeds}</option>
                                    <option value="Irrigation">{t.irrigation}</option>
                                    <option value="Labour">{t.labour}</option>
                                    <option value="Fertilizers">{t.fertilizers}</option>
                                    <option value="Pesticides">{t.pesticides}</option>
                                    <option value="Equipment">{t.equipment}</option>
                                </select>
                                <input type="number" placeholder={t.amountPlaceholder} value={expenseInputs[crop._id]?.amount || ''} onChange={(e) => handleExpenseChange(crop._id, 'amount', e.target.value)} style={{ width: '100px', padding: '5px', borderRadius: '5px' }} />
                                <button onClick={() => handleExpense(crop._id)} style={{ background: '#3498db', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '5px', cursor: 'pointer' }}>{t.logCostBtn}</button>
                                <span style={{ marginLeft: 'auto', fontWeight: 'bold' }}>{t.fieldCost}: ₹{expenses[crop._id] || 0}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </SignedIn>

            {/* --- LOCKED STATE FALLBACK --- */}
            <SignedOut>
                <div style={{ textAlign: 'center', padding: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '15px', marginTop: '30px', border: '1px dashed #7f8c8d' }}>
                    <h2 style={{ color: '#f39c12', margin: '0 0 10px 0' }}>{t.lockedTitle}</h2>
                    <p style={{ color: '#bdc3c7', marginBottom: '20px' }}>{t.lockedDesc}</p>
                    <SignInButton mode="modal">
                        <button style={{ background: '#3498db', color: 'white', padding: '10px 25px', borderRadius: '30px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem' }}>
                            {t.signInBtn}
                        </button>
                    </SignInButton>
                </div>
            </SignedOut>

            <Chatbot />
        </div>
    );
};

export default Dashboard;