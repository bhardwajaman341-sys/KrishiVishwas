import React from 'react';
import Dashboard from './components/Dashboard';
import Chatbot from './components/Chatbot'; // Fixed the spelling from Chatbox to Chatbot

function App() {
  return (
    <div className="App">
      <Dashboard />
      
      {/* Rendering the chatbot so it floats above the dashboard */}
      <Chatbot />
    </div>
  );
}

export default App;