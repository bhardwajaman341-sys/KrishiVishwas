require('dotenv').config();
// 1. Import the necessary tools (Dependencies)
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { GoogleGenAI } = require('@google/genai'); 
const { clerkMiddleware } = require('@clerk/express');

const cropRoutes = require('./routes/cropRoutes'); 
const expenseRoutes = require('./routes/expenseRoutes');
const videoRoutes = require("./routes/videoRoutes");
const authRoutes = require('./routes/authRoutes');
const climateRoutes = require('./routes/climateRoutes');

// 2. Initialize the AI with your secret key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }); 

// 3. Initialize the Express application
const app = express();
const PORT = process.env.PORT || 5000;

// 4. Middlewares
// UPDATED: Explicitly allow the frontend to send the Clerk Authorization token
// Updated CORS to allow both Local and Live Frontend
app.use(cors({
    origin: ['http://localhost:5173', 'https://krishi-vishwas.vercel.app'], 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json()); 
app.use(clerkMiddleware()); // Clerk watches the door

// Import Routes
app.use('/api/climate', climateRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/expenses', expenseRoutes);
app.use("/api", videoRoutes);

// --- AI Chatbot Route ---
app.post('/api/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;
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
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Local MongoDB Connected!");
  })
  .catch((err) => {
    console.log("❌ Local Connection Error: ", err);
  });

// 6. Home Route
app.get('/', (req, res) => {
  res.send('KrishiVishwas Server is officially Running and Connected!');
});

// 7. Start the Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});