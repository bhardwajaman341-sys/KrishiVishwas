import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ExpenseChart from './ExpenseChart';
import EnsoExplainer from './EnsoExplainer';

// --- TRANSLATION DICTIONARY ---
// You can easily add 'mr' (Marathi), 'pa' (Punjabi), etc., here later!
const translations = {
    en: {
        title1: "Krishi", title2: "Vishwas", subtitle: "Vision 2047: Vikshit Bharat",
        searchPlaceholder: "Search Knowledge Bank...", searchBtn: "Search",
        weatherTitle: "Local Weather", temp: "Temp",
        investmentTitle: "Total Farm Investment", downloadBtn: "Download Report",
        cropNamePlace: "Crop Name", acresPlace: "Acres", registerBtn: "Register Field",
        editBtn: "Edit", removeBtn: "Remove", saveBtn: "Save", cancelBtn: "Cancel",
        logCostBtn: "Log Cost", fieldCost: "Field Cost",
        loading: "Loading KrishiVishwas...",
        seeds: "Seeds", irrigation: "Irrigation", labour: "Labour",
        fertilizers: "Fertilizers", pesticides: "Pesticides", equipment: "Equipment",
        amountPlaceholder: "Amount ₹"
    },
    hi: {
        title1: "कृषि", title2: "विश्वास", subtitle: "विजन 2047: विकसित भारत",
        searchPlaceholder: "ज्ञान बैंक खोजें...", searchBtn: "खोजें",
        weatherTitle: "स्थानीय मौसम", temp: "तापमान",
        investmentTitle: "कुल कृषि निवेश", downloadBtn: "रिपोर्ट डाउनलोड करें",
        cropNamePlace: "फसल का नाम", acresPlace: "एकड़", registerBtn: "खेत दर्ज करें",
        editBtn: "संपादित करें", removeBtn: "हटाएं", saveBtn: "सहेजें", cancelBtn: "रद्द करें",
        logCostBtn: "लागत दर्ज करें", fieldCost: "खेत की लागत",
        loading: "कृषिविश्वास लोड हो रहा है...",
        seeds: "बीज", irrigation: "सिंचाई", labour: "मज़दूर",
        fertilizers: "उर्वरक", pesticides: "कीटनाशक", equipment: "उपकरण",
        amountPlaceholder: "राशि ₹"
    }
};

const Dashboard = () => {
    // --- STATE MANAGEMENT ---
    const [lang, setLang] = useState('en'); // Native Language State
    const [ensoData, setEnsoData] = useState(null);
    const [crops, setCrops] = useState([]);
    const [expenses, setExpenses] = useState({});
    const [cropBreakdowns, setCropBreakdowns] = useState({});
    const [weatherData, setWeatherData] = useState(null);
    const [locationStatus, setLocationStatus] = useState("Fetching location...");
    const [loading, setLoading] = useState(true);
    
    // Search & Forms
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [newCrop, setNewCrop] = useState({ name: '', area: '' });
    const [expenseInput, setExpenseInput] = useState({ amount: '', category: 'Seeds' });

    // Feature 3: Editing State
    const [editingCropId, setEditingCropId] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', area: '' });

    // Active translation object based on selected language
    const t = translations[lang];

    // --- DATA FETCHING (LOCAL DB + REAL WEATHER API) ---
    const fetchData = async () => {
        try {
            const [ensoRes, cropsRes] = await Promise.all([
                axios.get('http://localhost:5000/api/climate/enso'),
                axios.get('http://localhost:5000/api/crops')
            ]);
            
            setEnsoData(ensoRes.data);
            setCrops(cropsRes.data);
            
            const totals = {};
            const breakdowns = {}; 

            // Calculate totals and chart data for each individual crop
            await Promise.all(cropsRes.data.map(async (c) => {
                const e = await axios.get(`http://localhost:5000/api/expenses/${c._id}`);
                totals[c._id] = e.data.total;

                const tempCatTotals = { 'Seeds': 0, 'Irrigation': 0, 'Labour': 0, 'Fertilizers': 0, 'Pesticides': 0, 'Equipment': 0 };
                const expenseList = e.data.expenses || []; 
                expenseList.forEach(exp => {
                    const cat = exp.category ? exp.category.trim() : '';
                    if (tempCatTotals[cat] !== undefined) {
                        tempCatTotals[cat] += Number(exp.amount);
                    }
                });
                
                breakdowns[c._id] = [
                    tempCatTotals['Seeds'], tempCatTotals['Irrigation'], tempCatTotals['Labour'],
                    tempCatTotals['Fertilizers'], tempCatTotals['Pesticides'], tempCatTotals['Equipment']
                ];
            }));
            
            setExpenses(totals);
            setCropBreakdowns(breakdowns); 
            setLoading(false);

            // --- SAFER WEATHER FETCH ---
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    async (pos) => {
                        try {
                            const { latitude, longitude } = pos.coords;
                            setLocationStatus("Current Location");
                            const response = await fetch(`/api/weather/v1/forecast?latitude=${latitude.toFixed(2)}&longitude=${longitude.toFixed(2)}&current_weather=true`);
                            const data = await response.json();
                            setWeatherData(data.current_weather);
                        } catch (weatherErr) {
                            console.log("Weather API blocked by network. Using fallback.");
                            setWeatherData({ temperature: 28 });
                        }
                    },
                    async () => {
                        try {
                            setLocationStatus("Central India (Default)");
                            const response = await fetch(`/api/weather/v1/forecast?latitude=23.72&longitude=85.50&current_weather=true`);
                            const data = await response.json();
                            setWeatherData(data.current_weather);
                        } catch (weatherErr) {
                            setWeatherData({ temperature: 30 }); 
                        }
                    }
                );
            }
        } catch (err) { 
            console.error("Fetch Error:", err);
            setLoading(false); 
        }
    };

    useEffect(() => { fetchData(); }, []);

    // --- LOGIC HANDLERS (SEARCH, ADD, DELETE, EDIT, EXPORT) ---
    const handleSearch = async () => {
        if(!searchQuery) return;
        const res = await axios.get(`http://localhost:5000/api/crops/search?q=${searchQuery}`);
        setSearchResult(res.data[0]);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Remove this field?")) {
            await axios.delete(`http://localhost:5000/api/crops/${id}`);
            fetchData();
        }
    };

    const handleAddCrop = async (e) => {
        e.preventDefault();
        await axios.post('http://localhost:5000/api/crops/add', newCrop);
        setNewCrop({ name: '', area: '' }); 
        fetchData();
    };

    const handleExpense = async (cropId) => {
        if (!expenseInput.amount) return;
        await axios.post('http://localhost:5000/api/expenses/add', { cropId, ...expenseInput });
        setExpenseInput({ amount: '', category: 'Seeds' }); 
        fetchData();
    };

    const handleEditClick = (crop) => {
        setEditingCropId(crop._id);
        setEditForm({ name: crop.name, area: crop.area });
    };

    const handleEditSave = async (id) => {
        await axios.put(`http://localhost:5000/api/crops/${id}`, editForm);
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

    if (loading) return <h2 style={{color: 'white', textAlign: 'center', marginTop: '50px'}}>{t.loading}</h2>;

    return (
        <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto', color: 'white', fontFamily: 'sans-serif' }}>
            
            {/* Native Custom Language Switcher */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
                <select 
                    value={lang} 
                    onChange={(e) => setLang(e.target.value)} 
                    style={{ background: '#3498db', color: 'white', padding: '8px 15px', borderRadius: '5px', border: 'none', cursor: 'pointer', fontWeight: 'bold', outline: 'none' }}
                >
                    <option value="en">English</option>
                    <option value="hi">हिंदी (Hindi)</option>
                </select>
            </div>

            <header style={{ textAlign: 'center', marginBottom: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {/* The New Logo */}
                <img
                    src="/logo.png"
                    alt="KrishiVishwas Logo"
                    style={{ width: '100px', height: '100px', marginBottom: '15px', borderRadius: '50%', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}
                />

                <h1 style={{ fontSize: '4.5rem', margin: 0, fontWeight: '900', letterSpacing: '-1px' }}>
                    {t.title1}<span style={{ color: '#3498db' }}>{t.title2}</span>
                </h1>
                <p style={{ color: '#bdc3c7', margin: '20px 0 0 0', letterSpacing: '3px', textTransform: 'uppercase' }}>
                    {t.subtitle}
                </p>
            </header>

            {/* Search Bar */}
            <div style={{ marginBottom: '30px', display: 'flex', gap: '10px' }}>
                <input type="text" placeholder={t.searchPlaceholder} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ padding: '15px', flex: 1, borderRadius: '30px', border: 'none', background: 'rgba(255,255,255,0.1)', color: 'white' }} />
                <button onClick={handleSearch} style={{ background: '#3498db', color: 'white', padding: '0 30px', borderRadius: '30px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>{t.searchBtn}</button>
            </div>

            {/* Top Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                {/* 1. ENSO Card */}
                <div style={{ background: '#e6f2ff', color: '#2c3e50', padding: '20px', borderRadius: '15px', borderBottom: '5px solid #3498db' }}>
                    <h3 style={{ margin: 0 }}>🌍 {ensoData?.phase}</h3>
                    <div style={{ margin: '10px 0', fontSize: '1.2rem', fontWeight: 'bold', color: '#2980b9' }}>
                        Index: <span style={{ color: '#c0392b' }}>{ensoData?.anomaly}°C</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>{ensoData?.recommendation}</p>
                </div>

                {/* 2. Weather Card */}
                <div style={{ background: '#fff3e0', color: '#d35400', padding: '20px', borderRadius: '15px', borderBottom: '5px solid #f39c12' }}>
                    <h3 style={{ margin: 0 }}>🌤️ {t.weatherTitle}</h3>
                    <div style={{ margin: '10px 0', fontSize: '1.2rem', fontWeight: 'bold' }}>
                        {t.temp}: <span style={{ color: '#c0392b' }}>{weatherData?.temperature || '--'}°C</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>📍 {locationStatus}</p>
                </div>

                {/* 3. Investment Card + Export Feature */}
                <div style={{ background: '#27ae60', padding: '20px', borderRadius: '15px', textAlign: 'right' }}>
                    <h3 style={{ margin: 0, opacity: 0.8 }}>{t.investmentTitle}</h3>
                    <p style={{ fontSize: '2.2rem', fontWeight: 'bold', margin: 0 }}>₹{grandTotal}</p>
                    <button onClick={exportToCSV} style={{ marginTop: '10px', background: 'white', color: '#27ae60', border: 'none', padding: '8px 12px', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
                        📥 {t.downloadBtn}
                    </button>
                </div>
            </div>

            {/* ---> ENSO EXPLAINER PLACED HERE <--- */}
            <EnsoExplainer />

            {/* Add Crop Form */}
            <form onSubmit={handleAddCrop} style={{ display: 'flex', gap: '10px', background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '15px', marginBottom: '30px', marginTop: '30px' }}>
                <input type="text" placeholder={t.cropNamePlace} value={newCrop.name} onChange={(e) => setNewCrop({...newCrop, name: e.target.value})} style={{ padding: '12px', flex: 2, borderRadius: '8px', background: '#222', border: '1px solid #444', color: 'white' }} required />
                <input type="number" placeholder={t.acresPlace} value={newCrop.area} onChange={(e) => setNewCrop({...newCrop, area: e.target.value})} style={{ padding: '12px', flex: 1, borderRadius: '8px', background: '#222', border: '1px solid #444', color: 'white' }} required />
                <button type="submit" style={{ background: '#2ecc71', color: 'white', border: 'none', padding: '0 25px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>{t.registerBtn}</button>
            </form>

            {/* Field List */}
            <div style={{ display: 'grid', gap: '20px' }}>
                {crops.map((crop) => (
                    <div key={crop._id} style={{ background: '#2c3e50', padding: '25px', borderRadius: '15px', borderLeft: '5px solid #f1c40f' }}>
                        
                        {/* Edit Logic Toggle */}
                        {editingCropId === crop._id ? (
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                                <input type="text" value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} style={{ padding: '8px', borderRadius: '5px' }} />
                                <input type="number" value={editForm.area} onChange={(e) => setEditForm({...editForm, area: e.target.value})} style={{ padding: '8px', borderRadius: '5px', width: '80px' }} />
                                <button onClick={() => handleEditSave(crop._id)} style={{ background: '#2ecc71', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }}>{t.saveBtn} ✅</button>
                                <button onClick={() => setEditingCropId(null)} style={{ background: '#95a5a6', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }}>{t.cancelBtn}</button>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ margin: 0 }}>{crop.name} ({crop.area} {t.acresPlace})</h3>
                                <div>
                                    <button onClick={() => handleEditClick(crop)} style={{ background: '#f39c12', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', marginRight: '10px' }}>{t.editBtn} ✏️</button>
                                    <button onClick={() => handleDelete(crop._id)} style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer' }}>{t.removeBtn} 🗑️</button>
                                </div>
                            </div>
                        )}
                        
                        {/* Visualization Chart */}
                        {cropBreakdowns[crop._id] && (
                            <div style={{ marginTop: '20px' }}>
                                <ExpenseChart dataValues={cropBreakdowns[crop._id]} />
                            </div>
                        )}
                        
                        {/* Expense Logger */}
                        <div style={{ marginTop: '20px', display: 'flex', gap: '10px', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '10px' }}>
                            <select value={expenseInput.category} onChange={(e) => setExpenseInput({...expenseInput, category: e.target.value})} style={{ padding: '5px', borderRadius: '5px' }}>
                                {/* Note: Values stay in English for the Database, but display changes based on language */}
                                <option value="Seeds">{t.seeds}</option>
                                <option value="Irrigation">{t.irrigation}</option>
                                <option value="Labour">{t.labour}</option>
                                <option value="Fertilizers">{t.fertilizers}</option>
                                <option value="Pesticides">{t.pesticides}</option>
                                <option value="Equipment">{t.equipment}</option>
                            </select>
                            <input type="number" placeholder={t.amountPlaceholder} onChange={(e) => setExpenseInput({...expenseInput, amount: e.target.value})} value={expenseInput.amount} style={{ width: '100px', padding: '5px', borderRadius: '5px' }} />
                            <button onClick={() => handleExpense(crop._id)} style={{ background: '#3498db', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '5px', cursor: 'pointer' }}>{t.logCostBtn}</button>
                            <span style={{ marginLeft: 'auto', fontWeight: 'bold' }}>{t.fieldCost}: ₹{expenses[crop._id] || 0}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;