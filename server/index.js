// 1. Import the necessary tools (Dependencies)
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cropRoutes = require('./routes/cropRoutes'); 
const expenseRoutes = require('./routes/expenseRoutes');
const { GoogleGenAI } = require('@google/genai'); // <--- NEW: Import the AI library
const videoRoutes = require("./routes/videoRoutes");
// 2. Load the secrets from your .env file
dotenv.config();

// Initialize the AI with your secret key (Must be after dotenv.config!)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }); // <--- NEW: Setup the AI

// 3. Initialize the Express application
const app = express();
const PORT = process.env.PORT || 5000;

// 4. Middlewares: These help the server process data
app.use(cors()); // Allows your React (Frontend) to talk to this Server (Backend)
app.use(express.json()); // Allows the server to read JSON data sent by the user

// Import Routes
const authRoutes = require('./routes/authRoutes');
const climateRoutes = require('./routes/climateRoutes');
app.use('/api/climate', climateRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/expenses', expenseRoutes);
app.use("/api", videoRoutes);

// --- NEW: AI Chatbot Route ---
app.post('/api/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;
        
        // We give the AI a "System Prompt" so it acts like a farming expert!
        const prompt = `You are Krishi Mitra, an expert Indian agriculture assistant. 
                        Keep your answers short, helpful, and focused on farming, crops, and weather.
                        User asks: ${userMessage}`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        res.json({ reply: response.text });
    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ reply: "Sorry, the network is down. Please try again later." });
    }
});
// -----------------------------

// 5. MongoDB Connection Logic
// This tells the server to connect to the URI you saved in your .env file
// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Local MongoDB Connected!");
  })
  .catch((err) => {
    console.log("❌ Local Connection Error: ", err);
  });

// 6. A simple "Home" route to test the server in your browser
app.get('/', (req, res) => {
  res.send('KrishiVishwas Server is officially Running and Connected!');
});

// 7. Start the Server and keep it listening
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});