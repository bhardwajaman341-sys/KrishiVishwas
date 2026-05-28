import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ExpenseChart from './ExpenseChart';
import EnsoExplainer from './EnsoExplainer';
import Chatbot from './Chatbot';
import { useAuth, SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import MspTracker from '../components/MspTracker';

/* - GLOBAL STYLES - */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:        #e8d4b8;
    --surface:   #f5e6ce;
    --surface2:  #ead0b0;
    --border:    rgba(139,92,72,0.1);
    --accent:    #059669;
    --accent2:   #d97706;
    --accent3:   #2563eb;
    --red:       #dc2626;
    --text:      #3d2817;
    --muted:     #8b5c48;
    --glow:      rgba(5,150,105,0.15);
    --font-head: 'Syne', sans-serif;
    --font-body: 'DM Sans', sans-serif;
    --radius:    14px;
    --radius-lg: 20px;
    --trans:     0.22s cubic-bezier(.4,0,.2,1);
  }

  html, body, #root { height: 100%; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-body);
    font-size: 15px;
    -webkit-font-smoothing: antialiased;
  }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

  /* - Splash - */
  @keyframes splashFadeIn  { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
  @keyframes pulse-ring    { 0%,100% { box-shadow: 0 0 0 0 var(--glow) } 60% { box-shadow: 0 0 0 18px transparent } }
  @keyframes ticker        { from { transform:translateX(0) } to { transform:translateX(-50%) } }
  @keyframes shimmer       { 0% { background-position: -400px 0 } 100% { background-position: 400px 0 } }
  @keyframes fadeUp        { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }

  .splash-content   { animation: splashFadeIn .8s ease both; }
  .entering-logo    { animation: pulse-ring 2s ease-in-out infinite; border-radius: 50%; }
  .card-fadeup      { animation: fadeUp .35s ease both; }

  /* - Sidebar nav items - */
  .nav-item {
    display: flex; align-items: center; gap: 12px;
    padding: 11px 16px;
    border-radius: var(--radius);
    border: 1px solid transparent;
    cursor: pointer;
    font-family: var(--font-head);
    font-size: 0.88rem;
    font-weight: 600;
    letter-spacing: 0;
    color: var(--muted);
    background: transparent;
    transition: color var(--trans), background var(--trans), border-color var(--trans);
    width: 100%;
    text-align: left;
    white-space: nowrap;
  }
  .nav-item:hover  { color: var(--text); background: rgba(0,0,0,0.04); }
  .nav-item.active {
    color: var(--accent);
    background: rgba(5,150,105,0.08);
    border-color: rgba(5,150,105,0.2);
  }
  .nav-dot {
    width: 6px; height: 6px; border-radius: 50%; background: currentColor;
    flex-shrink: 0; opacity: .5; transition: opacity var(--trans);
  }
  .nav-item.active .nav-dot { opacity: 1; }

  /* - Glass card - */
  .glass-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    position: relative;
    overflow: hidden;
    box-shadow: 0 1px 4px rgba(0,0,0,0.06);
    z-index: 1;
  }
  .glass-card::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.6) 0%, transparent 60%);
    pointer-events: none;
  }

  /* - Accent line on cards - */
  .card-accent-left { border-left: 3px solid var(--accent) !important; }
  .card-accent-gold { border-left: 3px solid var(--accent2) !important; }
  .card-accent-blue { border-left: 3px solid var(--accent3) !important; }

  /* - Buttons - */
  .btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 9px 20px; border: none; border-radius: 10px;
    font-family: var(--font-body); font-size: 0.82rem;
    font-weight: 600;
    cursor: pointer; transition: filter var(--trans), transform var(--trans);
  }
  .btn:hover  { filter: brightness(1.12); transform: translateY(-1px); }
  .btn:active { transform: translateY(0); }
  .btn-green  { background: var(--accent); color: #fff; }
  .btn-blue   { background: var(--accent3); color: #fff; }
  .btn-gold   { background: var(--accent2); color: #fff; }
  .btn-red    { background: var(--red); color: #fff; }
  .btn-ghost  { background: #e0caa0; color: var(--text); border: 1px solid var(--border); }
  .btn-sm     { padding: 6px 14px; font-size: 0.72rem; }

  /* - Inputs - */
  .inp {
    background: #ffffff;
    border: 1px solid rgba(0,0,0,0.12);
    border-radius: 10px;
    color: var(--text);
    font-family: var(--font-body);
    font-size: 0.9rem;
    padding: 11px 15px;
    outline: none;
    transition: border-color var(--trans), box-shadow var(--trans);
  }
  .inp:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(0,229,160,0.12); }
  .inp::placeholder { color: var(--muted); }

  /* - Stat chip - */
  .stat-chip {
    display: flex; flex-direction: column; gap: 4px;
    padding: 18px 22px;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: var(--radius);
  }
  .stat-chip .label { font-size: 0.75rem; color: var(--muted); font-family: var(--font-body); }
  .stat-chip .value { font-size: 1.5rem; font-weight: 500; font-family: var(--font-body); line-height: 1; }

  /* - Tag badge - */
  .badge {
    display: inline-block; padding: 3px 10px;
    border-radius: 99px; font-size: 0.68rem;
    font-weight: 600;
    font-family: var(--font-body);
  }
  .badge-green { background: rgba(0,229,160,0.14); color: var(--accent); }
  .badge-red   { background: rgba(255,77,109,0.14); color: var(--red); }
  .badge-gold  { background: rgba(245,166,35,0.14); color: var(--accent2); }

  /* - Ticker - */
  .ticker-wrap {
    overflow: hidden; white-space: nowrap;
    background: linear-gradient(90deg, transparent, rgba(5,150,105,0.04), transparent);
    border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
    padding: 8px 0;
  }
  .ticker-inner { display: inline-flex; gap: 0; animation: ticker 30s linear infinite; }
  .ticker-item { padding: 0 32px; font-size: 0.75rem; color: var(--muted); font-family: var(--font-body); }

  /* - Section header - */
  .section-heading {
    font-family: var(--font-head);
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--text);
    display: flex; align-items: center; gap: 12px;
    position: relative;
    z-index: 1;
  }
  .section-heading::after {
    content: ''; flex: 1; height: 1px; background: rgba(0,0,0,0.08);
  }

  /* - Law card hover - */
  .law-card { transition: transform var(--trans), box-shadow var(--trans); }
  .law-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.1); }

  /* - Crop card - */
  .crop-card { transition: box-shadow var(--trans); }
  .crop-card:hover { box-shadow: 0 0 0 1px rgba(5,150,105,0.2), 0 8px 24px rgba(0,0,0,0.1); }

  /* - Sidebar logo glow - */
  .logo-glow {
    border-radius: 50%;
    box-shadow: 0 0 0 4px rgba(5,150,105,0.1), 0 2px 12px rgba(0,0,0,0.1);
  }

  /* - Header gradient - */
  .topbar {
    background: rgba(255,255,255,0.95);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
  }

  /* - Profit row - */
  .profit-positive { color: var(--accent); }
  .profit-negative { color: var(--red); }

  /* - Soil chip - */
  .soil-chip {
    display: flex; flex-direction: column; align-items: center;
    background: #ead0b0; border: 1px solid var(--border);
    border-radius: 10px; padding: 10px 14px; min-width: 56px;
  }
  .soil-chip .s-label { font-size: 0.7rem; color: var(--muted); font-family: var(--font-body); }
  .soil-chip .s-val   { font-size: 1rem; font-weight: 700; font-family: var(--font-head); margin-top: 2px; }

  /* - Expense log row - */
  .exp-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 7px 14px; border-radius: 8px;
    transition: background var(--trans);
  }
  .exp-row:hover { background: rgba(0,0,0,0.03); }

  /* - Select - */
  select.inp { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7a8d' d='M6 8L1 3h10z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; padding-right: 32px; }

  /* - Watermark - */
  .watermark {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 0;
    opacity: 0.08;
    pointer-events: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 40px;
    overflow: hidden;
  }
  .watermark img {
    width: 70vw;
    max-width: 700px;
    height: auto;
    object-fit: contain;
  }
  .watermark-text {
    font-family: var(--font-head);
    font-size: 6vw;
    font-weight: 800;
    letter-spacing: 0.08em;
    color: var(--text);
    white-space: nowrap;
  }
  
  @media (max-width: 768px) {
    .watermark img { width: 80vw; }
    .watermark-text { font-size: 8vw; }
  }
`;

/* - NAV CONFIG - */
const NAV = [
  { id: 'dashboard', labelKey: 'navDashboard' },
  { id: 'enso',      labelKey: 'navEnso' },
  { id: 'climate',   labelKey: 'navClimateGuide' },
  { id: 'weather',   labelKey: 'navWeather' },
  { id: 'alerts',    labelKey: 'navAlerts' },       
  { id: 'invest',    labelKey: 'navInvest' },
  { id: 'msp',       labelKey: 'navMsp' },
  { id: 'farmlaws',  labelKey: 'navFarmLaws' },
];

/* - TRANSLATIONS - */
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
        lockedTitle: "Secure Farm Dashboard",
        lockedDesc: "Sign in to register your fields, log expenses, and view your personalized financial charts.",
        yieldPlace: "Yield (Q/Acre)",
        knowledgeResult: "Knowledge Bank Result:",
        cropLabel: "Crop:", bestSeasonLabel: "Best Season:",
        recommendedFertilizersLabel: "Recommended Fertilizers:",
        closeResultBtn: "Close Result",
        indexLabel: "ONI Index:", rainChanceLabel: "Chance of Rain:",
        fetchingLocation: "Fetching location...", currentLocation: "Current Location",
        defaultLocation: "Central India (Default)", geoNotSupported: "Geolocation not supported",
        expectedProductionLabel: "Expected Production:", quintals: "Quintals",
        estimatedProfitLabel: "Estimated Profit:",
        soilParamsLabel: "Soil Parameters (N, P, K, pH):",
        aiScanBtn: "AI Scan",
        logHistoryLabel: "Log History (Click Delete to remove mistakes):",
        noExpensesLabel: "No expenses logged yet.",
        shcAdviceLabel: "SHC Advice:",
        waitingSoilAnalysis: "Waiting for soil analysis...",
        lowNUrea: "Low N: Apply Urea", lowPDAP: "Low P: Apply DAP",
        acidicLime: "Acidic: Apply Lime", soilHealthy: "Soil is healthy!",
        confirmRemoveField: "Remove this field?", confirmDeleteLog: "Delete this log entry?",
        yieldLabel: "Yield",
        navDashboard: "Dashboard", navEnso: "ENSO Data", navWeather: "Weather",
        navAlerts: "Telecom Dispatch", navInvest: "Investments", navMsp: "MSP Rates", navFarmLaws: "Farm Laws",
        navClimateGuide: "Climate Adaptation",
        cgHeader: "Climate Adaptation & Survival Guide",
        cgElNinoTitle: "El Niño Mitigation (Drought / Deficit Rainfall)",
        cgElNinoPoint1: "Stop growing high-water traditional crops like Sugarcane and Rice.",
        cgElNinoPoint2: "Switch to drought-resistant crops: Millets (Bajra, Jwari), Maize, and Moong (Green Gram).",
        cgElNinoPoint3: "Select short-duration crops (60-90 days instead of 120 days) to harvest before soil dries completely.",
        cgElNinoPoint4: "Implement Soil Moisture Conservation: Use Mulching, Deep Plowing, and Cross-Riding to create small basins that trap rainwater.",
        cgLaNinaTitle: "La Niña Mitigation (Excess Rainfall / Flooding)",
        cgLaNinaPoint1: "Avoid growing vulnerable vegetables.",
        cgLaNinaPoint2: "Use deep-water seed varieties specifically designed to survive submerged underwater for several days.",
        cgLaNinaPoint3: "Implement Smart Soil Management: Ensure proper drainage and switch to Raised Bed farming.",
        cgLaNinaPoint4: "Pest & Disease Control: High rainfall and high humidity lead to a massive increase in fungal diseases. Apply preventative sprays and ensure post-harvest protection.",
        cgGenTitle: "General Resilience & Preparation",
        cgGenPoint1: "Smart Water Management: Instead of flood irrigation, switch to drip irrigation or sprinkler irrigation targeting roots directly.",
        cgGenPoint2: "Activate Rainwater Harvesting systems immediately.",
        cgGenPoint3: "Financial Protection: Ensure all crops are covered under Crop Insurance.",
        cgGenPoint4: "Livelihood Shift: Shift primary income temporarily to Animal Husbandry, Poultry, or Mushroom Farming, which are less reliant on traditional field conditions."
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
        lockedTitle: "सुरक्षित कृषि डैशबोर्ड",
        lockedDesc: "अपने खेत दर्ज करने, खर्च जोड़ने और अपने व्यक्तिगत वित्तीय चार्ट देखने के लिए साइन इन करें।",
        yieldPlace: "पैदावार (क्व./एकड़)",
        knowledgeResult: "ज्ञान बैंक परिणाम:", cropLabel: "फसल:", bestSeasonLabel: "सर्वोत्तम मौसम:",
        recommendedFertilizersLabel: "अनुशंसित उर्वरक:",
        closeResultBtn: "परिणाम बंद करें",
        indexLabel: "सूचकांक:", rainChanceLabel: "बारिश की संभावना:",
        fetchingLocation: "स्थान प्राप्त किया जा रहा है...", currentLocation: "वर्तमान स्थान",
        defaultLocation: "मध्य भारत (डिफ़ॉल्ट)", geoNotSupported: "जियोलोकेशन समर्थित नहीं है",
        expectedProductionLabel: "अपेक्षित उत्पादन:", quintals: "क्विंटल",
        estimatedProfitLabel: "अनुमानित लाभ:",
        soilParamsLabel: "मिट्टी के पैरामीटर (N, P, K, pH):",
        aiScanBtn: "एआई स्कैन",
        logHistoryLabel: "लॉग इतिहास:", noExpensesLabel: "अभी तक कोई खर्च नहीं।",
        shcAdviceLabel: "एसएचसी सलाह:", waitingSoilAnalysis: "मिट्टी विश्लेषण की प्रतीक्षा है...",
        lowNUrea: "कम नाइट्रोजन: यूरिया डालें", lowPDAP: "कम फास्फोरस: डीएपी डालें",
        acidicLime: "अम्लीय: चूना डालें", soilHealthy: "मिट्टी स्वस्थ है!",
        confirmRemoveField: "क्या आप इस खेत को हटाना चाहते हैं?", confirmDeleteLog: "क्या आप इस लॉग प्रविष्टि को हटाना चाहते हैं?",
        yieldLabel: "पैदावार",
        navDashboard: "मुख्य डैशबोर्ड", navEnso: "ENSO डेटा", navWeather: "मौसम",
        navAlerts: "टेलीकॉम प्रेषण", navInvest: "कृषि निवेश", navMsp: "एमएसपी दरें", navFarmLaws: "कृषि कानून",
        navClimateGuide: "जलवायु अनुकूलन",
        cgHeader: "जलवायु अनुकूलन एवं सुरक्षा गाइड",
        cgElNinoTitle: "अल नीनो बचाव (सूखा / कम वर्षा)",
        cgElNinoPoint1: "अधिक पानी वाली पारंपरिक फसलें जैसे गन्ना और धान उगाना बंद करें।",
        cgElNinoPoint2: "सूखा-प्रतिरोधी फसलें अपनाएं: बाजरा, ज्वार, मक्का और मूंग।",
        cgElNinoPoint3: "मिट्टी के पूरी तरह सूखने से पहले कटाई के लिए कम अवधि वाली फसलें (120 के बजाय 60-90 दिन) चुनें।",
        cgElNinoPoint4: "मृदा नमी संरक्षण: वर्षा जल को रोकने के लिए मल्चिंग, गहरी जुताई और क्रॉस-राइडिंग का उपयोग करें।",
        cgLaNinaTitle: "ला नीना बचाव (अत्यधिक वर्षा / बाढ़)",
        cgLaNinaPoint1: "सब्जियां उगाने से बचें क्योंकि वे जल्दी खराब हो जाती हैं।",
        cgLaNinaPoint2: "उन डीप-वॉटर (गहरे पानी वाले) बीजों का उपयोग करें जो कई दिनों तक पानी में डूबे रहने पर भी जीवित रह सकें।",
        cgLaNinaPoint3: "स्मार्ट मृदा प्रबंधन: उचित जल निकासी सुनिश्चित करें और रेज़्ड बेड (ऊंचे बिस्तर) खेती अपनाएं।",
        cgLaNinaPoint4: "कीट और रोग नियंत्रण: भारी वर्षा और उच्च आर्द्रता से फंगल रोगों में भारी वृद्धि होती है। बचाव के लिए स्प्रे करें और कटाई के बाद सुरक्षा सुनिश्चित करें।",
        cgGenTitle: "सामान्य तैयारी एवं बचाव",
        cgGenPoint1: "स्मार्ट जल प्रबंधन: बाढ़ सिंचाई के बजाय ड्रिप सिंचाई या स्प्रिंकलर सिंचाई अपनाएं जो सीधे जड़ों को पानी दे।",
        cgGenPoint2: "वर्षा जल संचयन (Rainwater Harvesting) प्रणालियों को तुरंत सक्रिय करें।",
        cgGenPoint3: "वित्तीय सुरक्षा: सुनिश्चित करें कि सभी फसलें फसल बीमा (Crop Insurance) के अंतर्गत कवर की गई हैं।",
        cgGenPoint4: "आजीविका बदलाव: अपनी प्राथमिक आय को पशुपालन, मुर्गी पालन या मशरूम की खेती में स्थानांतरित करें, जो खेतों की स्थिति पर कम निर्भर हैं।"
    }
};

/* - FARM LAWS DATA - */
const farmLawsData = {
    en: {
        header: "Farmer Protection Laws (IPC & BNS)",
        intro: "Agriculture-related protection in Indian criminal law is spread across different offences rather than one separate 'farmer law.' Earlier these offences were mainly under the Indian Penal Code (IPC). Since 2023-24, many IPC provisions have been replaced by the Bharatiya Nyaya Sanhita (BNS). Most concepts remain similar.",
        laws: [
            { id:1, title:"1. Theft of Crops & Equipment", desc:"If someone steals harvested crops, tractors, irrigation pumps, seeds, or cattle, it becomes theft.", points:["Earlier IPC: Section 378 & 379","Under BNS: Equivalent theft provisions continue.","Example: Cutting and taking wheat from another field at night."], color:"#3498db" },
            { id:2, title:"2. Trespassing into Farmland", desc:"Illegally entering farmland to damage crops, occupy land, or graze animals intentionally.", points:["Earlier IPC: Section 441 & 447","Example: A neighbor forcefully entering field boundaries and destroying plantations."], color:"#e74c3c" },
            { id:3, title:"3. Mischief Causing Damage", desc:"Intentionally damaging standing crops, irrigation systems, tube wells, or farm machinery.", points:["Earlier IPC: Section 425 & 427","Example: Cutting irrigation pipes or burning crop residue to harm another farmer."], color:"#f39c12" },
            { id:4, title:"4. Arson of Farms", desc:"Burning crop fields, hay storage, grain warehouses, or sheds is a serious criminal offence.", points:["Earlier IPC: Section 435 & 436","Example: Setting fire to harvested paddy stacks during a rivalry."], color:"#d35400" },
            { id:5, title:"5. Cheating Farmers", desc:"Traders or agents using false weighing systems or selling fake agricultural products.", points:["Earlier IPC: Section 415 & 420","Example: Selling fake 'high-yield' seeds causing crop failure."], color:"#2ecc71" },
            { id:6, title:"6. Adulterated Inputs", desc:"Selling fake fertilizer, expired pesticide, misbranding seeds, or black marketing.", points:["Relevant Laws: Essential Commodities Act, Fertilizer Control Order, Seeds Act."], color:"#9b59b6" },
            { id:7, title:"7. Animal Theft & Crimes", desc:"Stealing cows, buffaloes, or poultry is punishable like property theft.", points:["Killing or poisoning farm animals can also lead to criminal liability."], color:"#e67e22" },
            { id:8, title:"8. Threats & Extortion", desc:"Threatening a farmer over land, extorting money, or intimidating during harvest.", points:["Earlier IPC: Section 503, 384, 323."], color:"#8e44ad" },
            { id:9, title:"9. Water Theft", desc:"Damaging irrigation canals or illegally diverting water.", points:["Leads to public property damage cases and irrigation act violations."], color:"#1abc9c" },
            { id:10, title:"10. Forgery of Land Records", desc:"Creating fake land papers, registry documents, crop insurance records, or loan papers.", points:["Earlier IPC: Section 463 & 468"], color:"#bdc3c7" }
        ]
    },
    hi: {
        header: "किसान संरक्षण कानून (IPC और BNS)",
        intro: "भारतीय आपराधिक कानून में कृषि से संबंधित संरक्षण अलग-अलग अपराधों में फैले हुए हैं। 2023-24 से, कई IPC प्रावधानों को भारतीय न्याय संहिता (BNS) द्वारा बदल दिया गया है।",
        laws: [
            { id:1, title:"1. फसलों और उपकरणों की चोरी", desc:"कटी हुई फसल, ट्रैक्टर, सिंचाई पंप, बीज या मवेशी चुराना चोरी है।", points:["पूर्व IPC: धारा 378 और 379","BNS के तहत: समान चोरी के प्रावधान जारी हैं।","उदाहरण: रात में दूसरे के खेत से गेहूं काटना।"], color:"#3498db" },
            { id:2, title:"2. खेत में अतिक्रमण", desc:"जानबूझकर फसलों को नुकसान पहुंचाने के लिए अवैध रूप से खेत में प्रवेश करना।", points:["पूर्व IPC: धारा 441 और 447"], color:"#e74c3c" },
            { id:3, title:"3. नुकसान पहुंचाने वाली शरारत", desc:"खड़ी फसलों या कृषि मशीनरी को जानबूझकर नुकसान पहुंचाना।", points:["पूर्व IPC: धारा 425 और 427"], color:"#f39c12" },
            { id:4, title:"4. खेतों में आगजनी", desc:"फसलों के खेतों या अनाज के गोदामों में आग लगाना एक गंभीर अपराध है।", points:["पूर्व IPC: धारा 435 और 436"], color:"#d35400" },
            { id:5, title:"5. किसानों से धोखाधड़ी", desc:"व्यापारियों द्वारा झूठी तौल या नकली कृषि उत्पाद बेचना।", points:["पूर्व IPC: धारा 415 और 420"], color:"#2ecc71" },
            { id:6, title:"6. मिलावटी इनपुट", desc:"नकली उर्वरक या एक्सपायर्ड कीटनाशक बेचना।", points:["संबंधित कानून: आवश्यक वस्तु अधिनियम, उर्वरक नियंत्रण आदेश।"], color:"#9b59b6" },
            { id:7, title:"7. पशु चोरी और अपराध", desc:"गाय, भैंस या मुर्गी चोरी करना दंडनीय है।", points:["खेत के जानवरों को मारना भी आपराधिक दायित्व।"], color:"#e67e22" },
            { id:8, title:"8. धमकियां और जबरन वसूली", desc:"जमीन को लेकर किसान को धमकाना या पैसे ऐंठना।", points:["पूर्व IPC: धारा 503, 384, 323."], color:"#8e44ad" },
            { id:9, title:"9. पानी की चोरी", desc:"सिंचाई नहरों को नुकसान पहुंचाना या अवैध रूप से पानी मोड़ना।", points:["सिंचाई अधिनियम के उल्लंघन।"], color:"#1abc9c" },
            { id:10, title:"10. भूमि रिकॉर्ड की जालसाजी", desc:"फर्जी जमीन के कागजात या ऋण पत्र बनाना।", points:["पूर्व IPC: धारा 463 और 468"], color:"#bdc3c7" }
        ]
    }
};

/* - TICKER ITEMS - */
const TICKER_ITEMS = [
  "Wheat MSP 2024-25", "₹2,585/Q",
  "Paddy (Common)", "₹2,369/Q",
  "Maize", "₹2,400/Q",
  "Soyabean (Black)", "₹5,328/Q",
  "Mustard & Rapeseed", "₹6,200/Q",
  "Cotton (Long Staple)", "₹8,100/Q",
];

/* - MAIN COMPONENT - */
const Dashboard = () => {
    const { getToken, isSignedIn } = useAuth();

    const [showSplash, setShowSplash] = useState(true);
    const [isTransitioning, setIsTransitioning] = useState(false);
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

    const [smsLogs, setSmsLogs] = useState([]);
    const [smsType, setSmsType] = useState('enso');
    const [isDispatching, setIsDispatching] = useState(false);

    const t = translations[lang];
    const lawsData = farmLawsData[lang];

    useEffect(() => {
        const id = 'kv-global-css';
        if (!document.getElementById(id)) {
            const style = document.createElement('style');
            style.id = id;
            style.textContent = GLOBAL_CSS;
            document.head.appendChild(style);
        }
    }, []);

    const handleSkipToMain = () => {
        setIsTransitioning(true);
        setTimeout(() => { setShowSplash(false); setIsTransitioning(false); }, 4000);
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
        return recs.length > 0 ? recs.join(" - ") : t.soilHealthy;
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
        const mspRates = { "paddy":2369,"rice":2369,"wheat":2585,"maize":2400,"soyabean":5328,"mustard":6200,"cotton":8100 };
        const msp = mspRates[crop.name?.toLowerCase().trim()] || 0;
        const totalCost = expenses[crop._id] || 0;
        const totalProduction = Number(crop.area) * Number(crop.expectedYield || 0);
        return (totalProduction * msp) - totalCost;
    };

    const fetchData = async () => {
        try {
            const ensoRes = await axios.get('http://localhost:5001/api/climate/enso');
            setEnsoData(ensoRes.data);
            if (isSignedIn) {
                const token = await getToken();
                const headers = { Authorization: `Bearer ${token}` };
                const cropsRes = await axios.get('http://localhost:5001/api/crops', { headers });
                setCrops(cropsRes.data);
                const totals={}, breakdowns={}, listData={};
                const categoryMap={'Seeds':0,'Irrigation':1,'Labour':2,'Fertilizers':3,'Pesticides':4,'Equipment':5};
                await Promise.all(cropsRes.data.map(async (c) => {
                    const e = await axios.get(`http://localhost:5001/api/expenses/${c._id}`, { headers });
                    totals[c._id] = e.data.total;
                    listData[c._id] = e.data.expenses;
                    const chartData = [0,0,0,0,0,0];
                    e.data.expenses.forEach(exp => { const i=categoryMap[exp.category]; if(i!==undefined) chartData[i]+=Number(exp.amount); });
                    breakdowns[c._id] = chartData;
                }));
                setExpenses(totals); setCropBreakdowns(breakdowns); setIndividualExpenses(listData);
            } else {
                setCrops([]); setExpenses({}); setCropBreakdowns({}); setIndividualExpenses({});
            }
        } catch(err){ console.error(err); }
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
                        if (data.list?.length > 0) setWeatherData({ temp: Math.round(data.list[0].main.temp), rainChance: Math.round(data.list[0].pop * 100) });
                    } catch { setWeatherData({ temp:28, rainChance:10 }); }
                },
                async () => {
                    try {
                        setLocationStatusKey("defaultLocation");
                        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=23.72&lon=85.50&units=metric&appid=${API_KEY}`);
                        const data = await response.json();
                        if (data.list?.length > 0) setWeatherData({ temp: Math.round(data.list[0].main.temp), rainChance: Math.round(data.list[0].pop * 100) });
                    } catch { setWeatherData({ temp:30, rainChance:0 }); }
                }
            );
        } else { setLocationStatusKey("geoNotSupported"); setWeatherData({ temp:30, rainChance:0 }); }
    };

    useEffect(() => { fetchData(); fetchWeather(); }, [isSignedIn]);

    const handleSearch = async () => {
        if (!searchQuery) return;
        const res = await axios.get(`http://localhost:5001/api/crops/search?q=${searchQuery}`);
        setSearchResult(res.data[0]);
    };

    const handleDelete = async (id) => {
        if (window.confirm(t.confirmRemoveField)) {
            const token = await getToken();
            await axios.delete(`http://localhost:5001/api/crops/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            fetchData();
        }
    };

    const handleAddCrop = async (e) => {
        e.preventDefault();
        const token = await getToken();
        await axios.post('http://localhost:5001/api/crops/add', newCrop, { headers: { Authorization: `Bearer ${token}` } });
        setNewCrop({ name:'', area:'', expectedYield:'' });
        fetchData();
    };

    const handleExpenseChange = (cropId, field, value) => {
        setExpenseInputs(prev => ({ ...prev, [cropId]: { ...prev[cropId], category: prev[cropId]?.category || 'Seeds', [field]: value } }));
    };

    const handleExpense = async (cropId) => {
        const inp = expenseInputs[cropId];
        if (!inp?.amount) return;
        const token = await getToken();
        await axios.post('http://localhost:5001/api/expenses/add', { cropId, amount: inp.amount, category: inp.category || 'Seeds' }, { headers: { Authorization: `Bearer ${token}` } });
        setExpenseInputs(prev => ({ ...prev, [cropId]: { amount:'', category:'Seeds' } }));
        fetchData();
    };

    const handleRemoveExpense = async (expenseId) => {
        if (window.confirm(t.confirmDeleteLog)) {
            try {
                const token = await getToken();
                await axios.delete(`http://localhost:5001/api/expenses/single/${expenseId}`, { headers: { Authorization: `Bearer ${token}` } });
                fetchData();
            } catch(err) { console.error(err); }
        }
    };

    const handleEditClick = (crop) => {
        setEditingCropId(crop._id);
        setEditForm({ name: crop.name, area: crop.area, expectedYield: crop.expectedYield || '', soilHealth: crop.soilHealth || { nitrogen:0, phosphorus:0, potassium:0, ph:7, isAnalyzed:false } });
    };

    const handleEditSave = async (id) => {
        const token = await getToken();
        await axios.put(`http://localhost:5001/api/crops/${id}`, {
            name: editForm.name, area: Number(editForm.area),
            expectedYield: Number(editForm.expectedYield),
            soilHealth: { ...editForm.soilHealth, isAnalyzed: true }
        }, { headers: { Authorization: `Bearer ${token}` } });
        setEditingCropId(null); fetchData();
    };

    const handleSendSMS = () => {
        setIsDispatching(true);
        setTimeout(() => {
            const timestamp = new Date().toLocaleTimeString();
            const messageType = smsType === 'enso' ? 'Climate Warning (ENSO)' : 'Local Weather Update';
            const logEntry = {
                id: Date.now(),
                time: timestamp,
                target: "Registered Farmers (Central District)",
                status: "DELIVERED via Fast2SMS",
                type: messageType
            };
            setSmsLogs(prev => [logEntry, ...prev]);
            setIsDispatching(false);
        }, 1500);
    };

    const getSmsDraft = () => {
        if (lang === 'en') {
            if (smsType === 'enso') {
                return `KRISHI VISHWAS ALERT: ${ensoData?.phase || 'Normal'} conditions detected. Expected Anomaly: ${ensoData?.anomaly || '0'}°C. Ensure proper field drainage mechanisms.`;
            } else {
                return `KRISHI VISHWAS WEATHER: Current Temp ${weatherData.temp}°C. Rain Probability ${weatherData.rainChance}%. Adjust irrigation schedule accordingly.`;
            }
        } else {
            if (smsType === 'enso') {
                return `कृषि विश्वास चेतावनी: ${translateBackendData(ensoData?.phase, 'hi') || 'सामान्य'} स्थिति। अपेक्षित तापमान परिवर्तन: ${ensoData?.anomaly || '0'}°C. खेतों में जल निकासी सुनिश्चित करें।`;
            } else {
                return `कृषि विश्वास मौसम: तापमान ${weatherData.temp}°C. बारिश की संभावना ${weatherData.rainChance}%. कृपया अपनी सिंचाई योजना को समायोजित करें।`;
            }
        }
    };

    const exportToCSV = () => {
        let csv = "Crop Name,Area (Acres),Total Investment (₹)\n";
        crops.forEach(c => csv += `${c.name},${c.area},${expenses[c._id]||0}\n`);
        csv += `\nGRAND TOTAL,,${grandTotal}\n`;
        const blob = new Blob([csv], { type:'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a"); a.href=url; a.download="KrishiVishwas_Report.csv"; a.click();
    };

    const grandTotal = Object.values(expenses).reduce((a,b) => a+b, 0);

    if (loading) return (
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'#e8d4b8', fontFamily:'var(--font-head)', color:'var(--accent)', fontSize:'1.2rem', letterSpacing:'0' }}>
            {t.loading}
        </div>
    );

    /* - TICKER - */
    const TickerBar = () => (
        <div className="ticker-wrap">
            <div className="ticker-inner">
                {[...TICKER_ITEMS,...TICKER_ITEMS].map((item, i) => (
                    <span key={i} className="ticker-item">
                        {i%2===0 ? <span>{item}</span> : item + '  -  '}
                    </span>
                ))}
            </div>
        </div>
    );

    /* - SIDEBAR - */
    const renderSidebar = () => (
        <div style={{
            width: isSidebarOpen ? '260px' : '0px',
            overflow: 'hidden',
            background: '#f5e6ce',
            borderRight: '1px solid rgba(0,0,0,0.08)',
            transition: 'width 0.3s cubic-bezier(.4,0,.2,1)',
            display: 'flex', flexDirection: 'column',
            flexShrink: 0,
        }}>
            <div style={{ padding: '20px 16px', borderBottom: '1px solid var(--border)', minWidth: '260px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                    <img src="/logo.png" alt="Logo" className="logo-glow" style={{ width:'38px', height:'38px', borderRadius:'50%', objectFit:'cover', flexShrink:0 }} />
                    <div style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:'0.85rem', lineHeight:1.2, whiteSpace: 'nowrap' }}>
                        <span style={{ color:'var(--accent)' }}>{t.title1}</span>
                        <span style={{ color:'var(--accent2)' }}>{t.title2}</span>
                    </div>
                </div>
            </div>

            <nav style={{ display:'flex', flexDirection:'column', gap:'3px', padding:'16px 10px', flex:1 }}>
                {NAV.map(n => (
                    <button key={n.id} className={`nav-item${activeTab===n.id?' active':''}`} onClick={() => setActiveTab(n.id)}>
                        {t[n.labelKey]}
                    </button>
                ))}
            </nav>
        </div>
    );

    /* - SPLASH - */
    if (showSplash) return (
        <div style={{ position:'fixed', inset:0, background:'#e8d4b8', zIndex:9999, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'20px' }}>
            {!isTransitioning ? (
                <div className="splash-content" style={{ textAlign:'center', width:'100%', maxWidth:'860px' }}>
                    <div style={{ marginBottom:'24px' }}>
                    <span style={{ fontFamily:'var(--font-head)', fontSize:'2.8rem', fontWeight:800 }}>
                            <span style={{ color:'var(--accent)' }}>Krishi</span>
                            <span style={{ color:'var(--accent2)' }}>Vishwas</span>
                        </span>
                    </div>
                    <video src="/demo-video.mp4" controls autoPlay style={{ width:'100%', borderRadius:'16px', boxShadow:'0 20px 60px rgba(0,0,0,0.7)', border:'1px solid var(--border)', background:'#000' }}>
                        Your browser does not support the video tag.
                    </video>
                    <p style={{ color:'var(--muted)', fontSize:'1rem', marginTop:'20px' }}>How to use this application</p>
                    <button onClick={handleSkipToMain} className="btn btn-green" style={{ marginTop:'16px', padding:'14px 36px', fontSize:'0.9rem' }}>
                        Skip to Main Content 
                    </button>
                </div>
            ) : (
                <div style={{ textAlign:'center', animation:'splashFadeIn 1s ease both' }}>
                    <img src="/logo.png" alt="Logo" className="entering-logo" style={{ width:'120px', marginBottom:'32px' }} />
                        <p style={{ fontSize:'0.85rem', color:'var(--muted)', marginBottom:'24px' }}>
                        Entering Dashboard
                    </p>
                    <blockquote style={{ fontFamily:'var(--font-body)', fontStyle:'italic', color:'var(--accent2)', fontSize:'1.2rem', lineHeight:1.7, maxWidth:'600px', fontWeight:300 }}>
                        "Agriculture is our wisest pursuit, contributing most to real wealth, good morals, and happiness."
                    </blockquote>
                    <div style={{ marginTop:'40px', display:'flex', gap:'6px', justifyContent:'center' }}>
                        {[0,1,2].map(i => (
                            <div key={i} style={{ width:'6px', height:'6px', borderRadius:'50%', background:'var(--accent)', opacity: 0.4+i*0.3, animation:`pulse-ring ${1+i*0.3}s ease-in-out infinite` }} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

    /* - MAIN - */
    return (
        <div style={{ display:'flex', height:'100vh', background:'var(--bg)', fontFamily:'var(--font-body)' }}>
            {renderSidebar()}

            <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
                <div className="topbar" style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0 24px', height:'58px', flexShrink:0, position:'sticky', top:0, zIndex:10 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'16px' }}>
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ background:'transparent', border:'none', color:'var(--muted)', fontSize:'1.2rem', cursor:'pointer', padding:'4px', lineHeight:1, transition:'color var(--trans)' }}
                            onMouseEnter={e=>e.target.style.color='var(--text)'} onMouseLeave={e=>e.target.style.color='var(--muted)'}>
                            ☰
                        </button>
                        <div style={{ height:'18px', width:'1px', background:'var(--border)' }} />
                        <span style={{ fontSize:'0.85rem', color:'var(--muted)' }}>
                            {t[NAV.find(n=>n.id===activeTab)?.labelKey]}
                        </span>
                    </div>

                    <div style={{ display:'flex', gap:'10px', alignItems:'center' }}>
                        <select value={lang} onChange={e=>setLang(e.target.value)} className="inp" style={{ fontSize:'0.82rem', padding:'6px 28px 6px 12px' }}>
                            <option value="en">EN</option>
                            <option value="hi">हिंदी</option>
                        </select>
                        <SignedIn><UserButton afterSignOutUrl="/" /></SignedIn>
                        <SignedOut>
                            <SignInButton mode="modal">
                                <button className="btn btn-green btn-sm">{t.signInBtn}</button>
                            </SignInButton>
                        </SignedOut>
                    </div>
                </div>

                <TickerBar />

                <div style={{ flex:1, overflowY:'auto', padding:'28px 32px', position:'relative' }}>

                    <div className="watermark">
                        <img src="/logo.png" alt="" />
                        <div className="watermark-text">KrishiVishwas</div>
                    </div>

                    <div style={{ display:'flex', gap:'10px', marginBottom:'28px' }}>
                        <input
                            type="text"
                            placeholder={t.searchPlaceholder}
                            value={searchQuery}
                            onChange={e=>setSearchQuery(e.target.value)}
                            onKeyDown={e=>e.key==='Enter'&&handleSearch()}
                            className="inp"
                            style={{ flex:1, fontSize:'0.95rem' }}
                        />
                        <button onClick={handleSearch} className="btn btn-blue">{t.searchBtn}</button>
                    </div>

                    {searchResult && (
                        <div className="glass-card card-accent-blue card-fadeup" style={{ padding:'22px 26px', marginBottom:'28px' }}>
                            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'14px' }}>
                                <h3 style={{ fontWeight:700, color:'var(--accent3)', margin:0 }}>{t.knowledgeResult}</h3>
                                <button onClick={()=>setSearchResult(null)} className="btn btn-ghost btn-sm">{t.closeResultBtn}</button>
                            </div>
                            <div style={{ display:'flex', flexDirection:'column', gap:'6px', color:'var(--text)', fontSize:'0.9rem', lineHeight:1.7 }}>
                                <div><span style={{ color:'var(--muted)', marginRight:'8px' }}>{t.cropLabel}</span>{searchResult.cropName || searchResult.name}</div>
                                {searchResult.bestSeason && <div><span style={{ color:'var(--muted)', marginRight:'8px' }}>{t.bestSeasonLabel}</span>{searchResult.bestSeason}</div>}
                                {searchResult.fertilizers?.length > 0 && <div><span style={{ color:'var(--muted)', marginRight:'8px' }}>{t.recommendedFertilizersLabel}</span>{searchResult.fertilizers.join(', ')}</div>}
                            </div>
                        </div>
                    )}

                    {activeTab === 'dashboard' && (
                        <>
                            <EnsoExplainer lang={lang} />

                            <SignedIn>
                                <div style={{ marginTop:'40px' }}>
                                    <h2 className="section-heading" style={{ marginBottom:'20px' }}>Personalized Crop Expenses</h2>

                                    <form onSubmit={handleAddCrop} className="glass-card" style={{ padding:'20px', marginBottom:'28px', display:'flex', flexWrap:'wrap', gap:'10px' }}>
                                        <input type="text" placeholder={t.cropNamePlace} value={newCrop.name} onChange={e=>setNewCrop({...newCrop,name:e.target.value})} className="inp" style={{ flex:'2 1 160px' }} required />
                                        <input type="number" placeholder={t.acresPlace} value={newCrop.area} onChange={e=>setNewCrop({...newCrop,area:e.target.value})} className="inp" style={{ flex:'1 1 90px' }} required />
                                        <input type="number" placeholder={t.yieldPlace} value={newCrop.expectedYield} onChange={e=>setNewCrop({...newCrop,expectedYield:e.target.value})} className="inp" style={{ flex:'1 1 120px' }} required />
                                        <button type="submit" className="btn btn-green">{t.registerBtn}</button>
                                    </form>

                                    <div style={{ display:'flex', flexDirection:'column', gap:'24px' }}>
                                        {crops.map(crop => (
                                            <div key={crop._id} className="glass-card card-accent-gold crop-card card-fadeup" style={{ padding:'26px' }}>

                                                {editingCropId === crop._id ? (
                                                    <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
                                                        <div style={{ display:'flex', flexWrap:'wrap', gap:'10px' }}>
                                                            <input type="text" value={editForm.name} onChange={e=>setEditForm({...editForm,name:e.target.value})} className="inp" style={{ flex:'2 1 140px' }} />
                                                            <input type="number" value={editForm.area} onChange={e=>setEditForm({...editForm,area:e.target.value})} className="inp" style={{ flex:'1 1 80px' }} />
                                                            <input type="number" placeholder={t.yieldLabel} value={editForm.expectedYield} onChange={e=>setEditForm({...editForm,expectedYield:e.target.value})} className="inp" style={{ flex:'1 1 90px' }} />
                                                        </div>

                                                        <div style={{ background:'#e5d0a8', border:'1px solid rgba(37,99,235,0.15)', borderRadius:'12px', padding:'16px' }}>
                                                            <div style={{ fontSize:'0.8rem', color:'var(--accent3)', marginBottom:'12px', fontWeight:600 }}>{t.soilParamsLabel}</div>
                                                            <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', alignItems:'center' }}>
                                                                {['nitrogen','phosphorus','potassium'].map(key => (
                                                                    <input key={key} type="number" placeholder={key[0].toUpperCase()} value={editForm.soilHealth[key]} onChange={e=>setEditForm({...editForm,soilHealth:{...editForm.soilHealth,[key]:e.target.value}})} className="inp" style={{ width:'72px' }} />
                                                                ))}
                                                                <input type="number" placeholder="pH" step="0.1" value={editForm.soilHealth.ph} onChange={e=>setEditForm({...editForm,soilHealth:{...editForm.soilHealth,ph:e.target.value}})} className="inp" style={{ width:'72px' }} />
                                                                <button type="button" onClick={handleAiSoilScan} className="btn btn-sm" style={{ background:'rgba(155,89,182,0.2)', color:'#7c3aed', border:'1px solid rgba(155,89,182,0.3)', marginLeft:'auto' }}>{t.aiScanBtn}</button>
                                                            </div>
                                                        </div>

                                                        <div style={{ display:'flex', gap:'10px' }}>
                                                            <button onClick={()=>handleEditSave(crop._id)} className="btn btn-green">{t.saveBtn}</button>
                                                            <button onClick={()=>setEditingCropId(null)} className="btn btn-ghost">{t.cancelBtn}</button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'12px' }}>
                                                        <div>
                                                            <h3 style={{ fontFamily:'var(--font-head)', fontSize:'1.25rem', fontWeight:800, margin:0 }}>{crop.name}</h3>
                                                            <span style={{ color:'var(--muted)', fontSize:'0.82rem' }}>{crop.area} {t.acresPlace}</span>
                                                        </div>
                                                        <div style={{ display:'flex', gap:'8px' }}>
                                                            <button onClick={()=>handleEditClick(crop)} className="btn btn-gold btn-sm">{t.editBtn}</button>
                                                            <button onClick={()=>handleDelete(crop._id)} className="btn btn-red btn-sm">{t.removeBtn}</button>
                                                        </div>
                                                    </div>
                                                )}

                                                {crop.soilHealth?.isAnalyzed && (
                                                    <div style={{ marginTop:'16px', padding:'14px 18px', background:'#ebd8b8', border:'1px solid rgba(147,51,234,0.2)', borderRadius:'10px', display:'flex', alignItems:'flex-start', gap:'12px' }}>
                                                        <div style={{ display:'flex', gap:'12px', flexWrap:'wrap', marginBottom:'8px' }}>
                                                            {[['N',crop.soilHealth.nitrogen],['P',crop.soilHealth.phosphorus],['K',crop.soilHealth.potassium],['pH',crop.soilHealth.ph]].map(([lbl,val])=>(
                                                                <div key={lbl} className="soil-chip">
                                                                    <span className="s-label">{lbl}</span>
                                                                    <span className="s-val" style={{ color:'#7c3aed' }}>{val}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div style={{ flex:1 }}>
                                                            <div style={{ fontSize:'0.78rem', color:'#7c3aed', marginBottom:'4px', fontWeight:600 }}>{t.shcAdviceLabel}</div>
                                                            <div style={{ fontSize:'0.88rem', color:'var(--text)', lineHeight:1.5 }}>{getSoilRecommendation(crop.soilHealth, t)}</div>
                                                        </div>
                                                    </div>
                                                )}

                                                <div style={{ marginTop:'18px', background:'#ecdcbd', border:'1px solid rgba(5,150,105,0.15)', borderRadius:'12px', padding:'18px 20px' }}>
                                                    <div style={{ fontSize:'0.8rem', color:'var(--muted)', marginBottom:'12px', fontWeight:600 }}>
                                                        Profit Projection
                                                    </div>
                                                    <div style={{ display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:'16px' }}>
                                                        <div className="stat-chip" style={{ flex:'1 1 140px' }}>
                                                            <span className="label">{t.expectedProductionLabel}</span>
                                                            <span style={{ fontSize:'1.3rem', fontWeight:500, fontFamily:'var(--font-body)' }}>{Number(crop.area)*Number(crop.expectedYield||0)} <span style={{ fontSize:'0.7rem', fontWeight:500, color:'var(--muted)' }}>{t.quintals}</span></span>
                                                        </div>
                                                        <div className="stat-chip" style={{ flex:'1 1 140px' }}>
                                                            <span className="label">{t.estimatedProfitLabel}</span>
                                                            <span style={{ fontSize:'1.4rem', fontWeight:500, fontFamily:'var(--font-body)', color: calculateUserProfit(crop)>=0 ? 'var(--accent)' : 'var(--red)' }}>
                                                                ₹{Math.abs(calculateUserProfit(crop)).toLocaleString()}
                                                                {calculateUserProfit(crop)<0&&<span style={{ fontSize:'0.7rem', marginLeft:'4px' }}>Loss</span>}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {cropBreakdowns[crop._id] && (
                                                    <div style={{ marginTop:'20px', background:'#fff', borderRadius:'12px', padding:'20px' }}>
                                                        <ExpenseChart dataValues={cropBreakdowns[crop._id]} />
                                                    </div>
                                                )}

                                                <div style={{ marginTop:'20px', background:'var(--surface2)', border:'1px solid var(--border)', borderRadius:'12px', padding:'16px', display:'flex', flexWrap:'wrap', gap:'10px', alignItems:'center', justifyContent:'space-between' }}>
                                                    <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
                                                        <select value={expenseInputs[crop._id]?.category||'Seeds'} onChange={e=>handleExpenseChange(crop._id,'category',e.target.value)} className="inp" style={{ fontSize:'0.82rem' }}>
                                                            <option value="Seeds">{t.seeds}</option>
                                                            <option value="Irrigation">{t.irrigation}</option>
                                                            <option value="Labour">{t.labour}</option>
                                                            <option value="Fertilizers">{t.fertilizers}</option>
                                                            <option value="Pesticides">{t.pesticides}</option>
                                                            <option value="Equipment">{t.equipment}</option>
                                                        </select>
                                                        <input type="number" placeholder={t.amountPlaceholder} value={expenseInputs[crop._id]?.amount||''} onChange={e=>handleExpenseChange(crop._id,'amount',e.target.value)} className="inp" style={{ width:'130px' }} />
                                                        <button onClick={()=>handleExpense(crop._id)} className="btn btn-blue btn-sm">{t.logCostBtn}</button>
                                                    </div>
                                                    <div style={{ fontWeight:600, fontSize:'1rem' }}>
                                                        {t.fieldCost}: <span style={{ color:'var(--accent2)' }}>₹{(expenses[crop._id]||0).toLocaleString()}</span>
                                                    </div>
                                                </div>

                                                {individualExpenses[crop._id]?.length > 0 && (
                                                    <div style={{ marginTop:'10px', maxHeight:'110px', overflowY:'auto' }}>
                                                        {individualExpenses[crop._id].map(exp => (
                                                            <div key={exp._id} className="exp-row">
                                                                <span style={{ fontSize:'0.82rem', color:'var(--muted)' }}>
                                                                    {t[exp.category.toLowerCase()] || exp.category}
                                                                    <strong style={{ color:'var(--text)', marginLeft:'6px' }}>₹{exp.amount}</strong>
                                                                </span>
                                                                <button onClick={()=>handleRemoveExpense(exp._id)} style={{ background:'none', border:'none', color:'var(--red)', cursor:'pointer', fontSize:'0.82rem' }}>Delete</button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </SignedIn>

                            <SignedOut>
                                <div className="glass-card" style={{ padding:'60px 30px', textAlign:'center', marginTop:'30px', borderStyle:'dashed', borderColor:'#cbd5e1' }}>
                                    <h2 style={{ fontFamily:'var(--font-head)', fontWeight:800, color:'var(--accent2)', marginBottom:'12px' }}>{t.lockedTitle}</h2>
                                    <p style={{ color:'var(--muted)', maxWidth:'440px', margin:'0 auto 28px', lineHeight:1.7 }}>{t.lockedDesc}</p>
                                    <SignInButton mode="modal">
                                        <button className="btn btn-green" style={{ padding:'13px 36px', fontSize:'0.9rem' }}>{t.signInBtn}</button>
                                    </SignInButton>
                                </div>
                            </SignedOut>
                        </>
                    )}

                    {/* - TAB: CLIMATE GUIDE (EL NINO / LA NINA) - */}
                    {activeTab === 'climate' && (
                        <div>
                            <div className="glass-card card-accent-gold" style={{ padding:'30px', marginBottom:'28px' }}>
                                <h2 style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:'1.5rem', color:'var(--text)', marginBottom:'10px' }}>
                                    {t.cgHeader}
                                </h2>
                            </div>

                            <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
                                <div className="glass-card" style={{ borderLeft: '4px solid #e74c3c' }}>
                                    <h3 style={{ fontFamily:'var(--font-head)', fontSize:'1.2rem', color:'#e74c3c', marginBottom:'15px' }}>
                                        {t.cgElNinoTitle}
                                    </h3>
                                    <ul style={{ color:'var(--text)', fontSize:'0.95rem', lineHeight:'1.7', paddingLeft:'20px', margin:0 }}>
                                        <li style={{ marginBottom:'8px' }}>{t.cgElNinoPoint1}</li>
                                        <li style={{ marginBottom:'8px' }}>{t.cgElNinoPoint2}</li>
                                        <li style={{ marginBottom:'8px' }}>{t.cgElNinoPoint3}</li>
                                        <li style={{ marginBottom:'8px' }}>{t.cgElNinoPoint4}</li>
                                    </ul>
                                </div>

                                <div className="glass-card" style={{ borderLeft: '4px solid #3498db' }}>
                                    <h3 style={{ fontFamily:'var(--font-head)', fontSize:'1.2rem', color:'#3498db', marginBottom:'15px' }}>
                                        {t.cgLaNinaTitle}
                                    </h3>
                                    <ul style={{ color:'var(--text)', fontSize:'0.95rem', lineHeight:'1.7', paddingLeft:'20px', margin:0 }}>
                                        <li style={{ marginBottom:'8px' }}>{t.cgLaNinaPoint1}</li>
                                        <li style={{ marginBottom:'8px' }}>{t.cgLaNinaPoint2}</li>
                                        <li style={{ marginBottom:'8px' }}>{t.cgLaNinaPoint3}</li>
                                        <li style={{ marginBottom:'8px' }}>{t.cgLaNinaPoint4}</li>
                                    </ul>
                                </div>

                                <div className="glass-card" style={{ borderLeft: '4px solid #2ecc71' }}>
                                    <h3 style={{ fontFamily:'var(--font-head)', fontSize:'1.2rem', color:'#2ecc71', marginBottom:'15px' }}>
                                        {t.cgGenTitle}
                                    </h3>
                                    <ul style={{ color:'var(--text)', fontSize:'0.95rem', lineHeight:'1.7', paddingLeft:'20px', margin:0 }}>
                                        <li style={{ marginBottom:'8px' }}>{t.cgGenPoint1}</li>
                                        <li style={{ marginBottom:'8px' }}>{t.cgGenPoint2}</li>
                                        <li style={{ marginBottom:'8px' }}>{t.cgGenPoint3}</li>
                                        <li style={{ marginBottom:'8px' }}>{t.cgGenPoint4}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* - TAB: ALERTS (SMS DISPATCH FEATURE) - */}
                    {activeTab === 'alerts' && (
                        <div>
                            <div className="glass-card card-accent-left" style={{ padding:'30px', marginBottom:'28px' }}>
                                <h2 style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:'1.5rem', color:'var(--text)', marginBottom:'10px' }}>Offline Farmer Notifications</h2>
                                <p style={{ color:'var(--muted)', fontSize:'0.95rem', lineHeight:1.6, marginBottom:'24px' }}>
                                    Not all farmers have access to 4G internet. This system bypasses standard web protocols to dispatch critical climate and weather data directly via SMS to basic feature phones.
                                </p>
                                
                                <div style={{ background:'var(--surface2)', padding:'24px', borderRadius:'12px', border:'1px solid var(--border)' }}>
                                    <div style={{ display:'flex', gap:'24px', alignItems:'flex-start', flexWrap:'wrap' }}>
                                        
                                        <div style={{ flex:1, minWidth:'250px' }}>
                                            <label style={{ display:'block', color:'var(--text)', marginBottom:'8px', fontSize:'0.9rem', fontWeight:600 }}>Select Data Payload</label>
                                            <select className="inp" value={smsType} onChange={(e) => setSmsType(e.target.value)} style={{ width:'100%', marginBottom:'20px' }}>
                                                <option value="enso">ENSO Anomaly Alert</option>
                                                <option value="weather">Local Weather Update</option>
                                            </select>

                                            <label style={{ display:'block', color:'var(--text)', marginBottom:'8px', fontSize:'0.9rem', fontWeight:600 }}>Draft Message (Translates automatically)</label>
                                            <div style={{ background:'#fff', border:'1px solid var(--border)', padding:'16px', borderRadius:'10px', color:'var(--text)', minHeight:'100px', fontSize:'0.95rem', lineHeight:'1.5' }}>
                                                {getSmsDraft()}
                                            </div>
                                        </div>

                                        <div style={{ width:'300px', background:'#fff', border:'1px solid var(--border)', borderRadius:'12px', padding:'24px', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center' }}>
                                            <div style={{ color:'var(--muted)', fontSize:'0.85rem', marginBottom:'16px', fontWeight:600, letterSpacing:'1px' }}>CONNECTION STATUS</div>
                                            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'24px', gap:'10px' }}>
                                                <div style={{ width:'12px', height:'12px', borderRadius:'50%', background:'var(--accent)', animation:'pulse-ring 2s infinite' }}></div>
                                                <span style={{ color:'var(--accent)', fontWeight:'bold', letterSpacing:'1px' }}>GATEWAY ACTIVE</span>
                                            </div>
                                            <button 
                                                className="btn btn-green" 
                                                onClick={handleSendSMS}
                                                disabled={isDispatching}
                                                style={{ width:'100%', justifyContent:'center', opacity: isDispatching ? 0.7 : 1, padding:'12px' }}
                                            >
                                                {isDispatching ? 'Transmitting...' : 'Dispatch SMS Broadcast'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="glass-card" style={{ padding:'30px' }}>
                                <h3 style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:'1.2rem', color:'var(--text)', marginBottom:'20px' }}>Transmission Ledger</h3>
                                
                                {smsLogs.length === 0 ? (
                                    <div style={{ color:'var(--muted)', fontStyle:'italic', textAlign:'center', padding:'20px 0' }}>No transmissions recorded in the current session.</div>
                                ) : (
                                    <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
                                        {smsLogs.map(log => (
                                            <div key={log.id} style={{ background:'var(--surface2)', border:'1px solid var(--border)', padding:'16px', borderRadius:'10px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'10px' }}>
                                                <div>
                                                    <div style={{ color:'var(--accent3)', fontWeight:700, marginBottom:'4px' }}>{log.type}</div>
                                                    <div style={{ color:'var(--text)', fontSize:'0.9rem' }}>Target: {log.target}</div>
                                                </div>
                                                <div style={{ textAlign:'right' }}>
                                                    <div style={{ color:'var(--muted)', fontSize:'0.85rem', marginBottom:'4px' }}>{log.time}</div>
                                                    <div style={{ color:'var(--accent)', fontSize:'0.85rem', fontWeight:700 }}>{log.status}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* - TAB: ENSO - */}
                    {activeTab === 'enso' && (
                        <div className="glass-card card-accent-blue" style={{ padding:'36px' }}>
                            <div style={{ fontSize:'0.7rem', fontFamily:'var(--font-head)', color:'var(--accent3)', letterSpacing:'0', marginBottom:'10px' }}>
                                ENSO Climate Monitor
                            </div>
                            <h2 style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:'2rem', margin:'0 0 10px', color:'var(--text)' }}>
                                {translateBackendData(ensoData?.phase, lang)}
                            </h2>
                            <div style={{ display:'flex', gap:'16px', flexWrap:'wrap', marginTop:'24px', marginBottom:'24px' }}>
                                <div className="stat-chip" style={{ flex:'1 1 150px' }}>
                                    <span className="label">{t.indexLabel}</span>
                                    <span className="value" style={{ color:'var(--red)' }}>{ensoData?.anomaly}°C</span>
                                </div>
                            </div>
                            <p style={{ color:'var(--muted)', lineHeight:1.75, fontSize:'0.95rem' }}>{translateBackendData(ensoData?.recommendation, lang)}</p>
                        </div>
                    )}

                    {/* - TAB: WEATHER - */}
                    {activeTab === 'weather' && (
                        <div className="glass-card card-accent-gold" style={{ padding:'36px' }}>
                            <h2 style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:'1.4rem', marginBottom:'24px', color:'var(--text)' }}>{t.weatherTitle}</h2>
                            <div style={{ display:'flex', gap:'20px', flexWrap:'wrap', marginBottom:'20px' }}>
                                <div className="stat-chip" style={{ flex:'1 1 150px' }}>
                                    <span className="label">{t.temp}</span>
                                    <span className="value" style={{ color:'var(--accent2)' }}>{weatherData.temp}°C</span>
                                </div>
                                <div className="stat-chip" style={{ flex:'1 1 150px' }}>
                                    <span className="label">{t.rainChanceLabel}</span>
                                    <span className="value" style={{ color:'var(--accent3)' }}>{weatherData.rainChance}%</span>
                                </div>
                            </div>
                            <div style={{ fontSize:'0.82rem', color:'var(--muted)' }}>{t[locationStatusKey]}</div>
                        </div>
                    )}

                    {/* - TAB: INVEST - */}
                    {activeTab === 'invest' && (
                        <div className="glass-card" style={{ padding:'40px', textAlign:'center', background:'linear-gradient(135deg, #ecdcbd, #ead0b0)' }}>
                            <h2 style={{ fontFamily:'var(--font-head)', fontSize:'1.1rem', color:'var(--text)', marginBottom:'16px', fontWeight:700 }}>{t.investmentTitle}</h2>
                            <div style={{ fontFamily:'var(--font-body)', fontSize:'3rem', fontWeight:500, color:'var(--accent)', lineHeight:1, marginBottom:'8px' }}>
                                ₹{grandTotal.toLocaleString()}
                            </div>
                            <div style={{ color:'var(--muted)', fontSize:'0.82rem', marginBottom:'32px' }}>
                                Across {crops.length} registered field{crops.length!==1?'s':''}
                            </div>
                            <button onClick={exportToCSV} className="btn btn-green" style={{ padding:'13px 32px', fontSize:'0.88rem' }}>
                                {t.downloadBtn}
                            </button>
                        </div>
                    )}

                    {/* - TAB: MSP - */}
                    {activeTab === 'msp' && <MspTracker lang={lang} />}

                    {/* - TAB: FARM LAWS - */}
                    {activeTab === 'farmlaws' && (
                        <div>
                            <div className="glass-card" style={{ padding:'30px', marginBottom:'28px', textAlign:'center' }}>
                                <h2 style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:'1.5rem', color:'var(--text)', marginBottom:'16px' }}>{lawsData.header}</h2>
                                <p style={{ color:'var(--muted)', maxWidth:'700px', margin:'0 auto', lineHeight:1.75, fontSize:'0.9rem' }}>{lawsData.intro}</p>
                            </div>
                            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:'18px' }}>
                                {lawsData.laws.map(law => (
                                    <div key={law.id} className="glass-card law-card" style={{ padding:'22px', borderLeft:`4px solid ${law.color}`, background:'#f5e6ce' }}>
                                        <h3 style={{ fontFamily:'var(--font-head)', fontSize:'1rem', fontWeight:700, color:law.color, marginBottom:'10px' }}>{law.title}</h3>
                                        <p style={{ color:'var(--muted)', fontSize:'0.85rem', lineHeight:1.65, marginBottom:'14px' }}>{law.desc}</p>
                                        <ul style={{ paddingLeft:'16px', color:'#64748b', fontSize:'0.78rem', lineHeight:1.8 }}>
                                            {law.points.map((pt,i) => <li key={i}>{pt}</li>)}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>{/* end content */}

                <Chatbot />
            </div>
        </div>
    );
};

export default Dashboard;