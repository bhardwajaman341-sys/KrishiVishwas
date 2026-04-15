import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Browser-native speech recognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([{ text: "Namaste! I am Krishi Mitra. How can I help with your farm today?", isBot: true }]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    
    // --- VOICE ASSISTANT STATES ---
    const [isListening, setIsListening] = useState(false);
    const [voiceLang, setVoiceLang] = useState('hi-IN'); // Default to Hindi

    // Voice Languages List (10+ Languages)
    const languages = [
        { code: 'hi-IN', name: 'हिंदी (Hindi)' },
        { code: 'mr-IN', name: 'मराठी (Marathi)' },
        { code: 'bn-IN', name: 'বাংলা (Bengali)' },
        { code: 'gu-IN', name: 'ગુજરાતી (Gujarati)' },
        { code: 'ta-IN', name: 'தமிழ் (Tamil)' },
        { code: 'te-IN', name: 'తెలుగు (Telugu)' },
        { code: 'kn-IN', name: 'ಕನ್ನಡ (Kannada)' },
        { code: 'ml-IN', name: 'മലയാളം (Malayalam)' },
        { code: 'pa-IN', name: 'ਪੰਜਾਬੀ (Punjabi)' },
        { code: 'en-IN', name: 'English (India)' }
    ];

    // --- TEXT-TO-SPEECH (Bot Speaks) ---
    const speakText = (text) => {
        if (!window.speechSynthesis) return;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = voiceLang; // Speak in the selected accent/language
        window.speechSynthesis.speak(utterance);
    };

    // --- SPEECH-TO-TEXT (Bot Listens) ---
    const handleListen = () => {
        if (!recognition) {
            alert("Voice recognition is not supported in this browser. Please use Chrome.");
            return;
        }

        if (isListening) {
            recognition.stop();
            setIsListening(false);
            return;
        }

        recognition.lang = voiceLang;
        recognition.start();
        setIsListening(true);

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setInput(transcript); // Put the spoken words into the input box
            setIsListening(false);
        };

        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
    };

    // --- MESSAGE SENDING LOGIC ---
    const sendMessage = async (e) => {
        if (e) e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input;
        setMessages((prev) => [...prev, { text: userMsg, isBot: false }]);
        setInput('');
        setIsTyping(true);

        try {
            const res = await axios.post('https://krishivishwas-backend.onrender.com/api/chat', { message: userMsg } , { timeout: 15000 });
            const botReply = res.data.reply;
            
            setMessages((prev) => [...prev, { text: botReply, isBot: true }]);
            speakText(botReply); // Make the bot speak the response out loud!
            
        } catch (error) {
            setMessages((prev) => [...prev, { text: "Connection error. Please try again.", isBot: true }]);
        }
        setIsTyping(false);
    };

    return (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000, fontFamily: 'sans-serif' }}>
            {/* The Floating Button */}
            {!isOpen && (
                <button 
                    onClick={() => setIsOpen(true)}
                    style={{ background: '#3498db', color: 'white', border: 'none', borderRadius: '50%', width: '60px', height: '60px', fontSize: '24px', cursor: 'pointer', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}
                >
                    🤖
                </button>
            )}

            {/* The Chat Window */}
            {isOpen && (
                <div style={{ width: '320px', height: '450px', background: 'white', borderRadius: '15px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}>
                    
                    {/* Header */}
                    <div style={{ background: '#2c3e50', color: 'white', padding: '10px 15px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, fontSize: '1rem' }}>🤖 Krishi Mitra</h3>
                            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '16px' }}>✖</button>
                        </div>
                        
                        {/* Voice Language Selector */}
                        <select 
                            value={voiceLang} 
                            onChange={(e) => setVoiceLang(e.target.value)}
                            style={{ padding: '5px', borderRadius: '5px', fontSize: '0.8rem', background: '#34495e', color: 'white', border: '1px solid #7f8c8d', outline: 'none' }}
                        >
                            {languages.map(lang => (
                                <option key={lang.code} value={lang.code}>{lang.name}</option>
                            ))}
                        </select>
                    </div>
                    
                    {/* Message Area */}
                    <div style={{ flex: 1, padding: '15px', overflowY: 'auto', background: '#f1f2f6', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {messages.map((msg, i) => (
                            <div key={i} style={{ alignSelf: msg.isBot ? 'flex-start' : 'flex-end', background: msg.isBot ? '#bdc3c7' : '#3498db', color: msg.isBot ? '#2c3e50' : 'white', padding: '10px 15px', borderRadius: '15px', maxWidth: '80%', fontSize: '0.9rem' }}>
                                {msg.text}
                            </div>
                        ))}
                        {isTyping && <div style={{ alignSelf: 'flex-start', color: '#7f8c8d', fontSize: '0.8rem' }}>Krishi Mitra is typing...</div>}
                    </div>

                    {/* Input Area with Microphone */}
                    <form onSubmit={sendMessage} style={{ display: 'flex', padding: '10px', background: 'white', borderTop: '1px solid #eee', alignItems: 'center' }}>
                        
                        <button 
                            type="button" 
                            onClick={handleListen} 
                            style={{ background: isListening ? '#e74c3c' : '#ecf0f1', color: isListening ? 'white' : 'black', border: 'none', borderRadius: '50%', width: '40px', height: '40px', marginRight: '10px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', transition: '0.3s' }}
                            title="Tap to speak"
                        >
                            {isListening ? '🛑' : '🎤'}
                        </button>

                        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder={isListening ? "Listening..." : "Ask about crops..."} style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '20px', outline: 'none' }} />
                        <button type="submit" style={{ background: '#2ecc71', color: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', marginLeft: '10px', cursor: 'pointer' }}>➤</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Chatbot;