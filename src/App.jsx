import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';







import './styles/App.css';
import MessageIndexPage from './pages/message/MessageIndexPage.jsx';
import MessageDetailPage from './pages/message/MessageDetailPage.jsx';
import { Routes, Route, Navigate } from 'react-router-dom';



function App() {
  const [activeTab, setActiveTab] = useState('pages');  // Default to the pages tab
  const [lastActive, setLastActive] = useState(null);
  
  // Store the active tab in localStorage
  useEffect(() => {
    const savedTab = localStorage.getItem('tymout-active-tab');
    if (savedTab) {
      setActiveTab(savedTab);
    }
  }, []);
  
  const handleTabChange = (tab) => {
    setLastActive(activeTab);
    setActiveTab(tab);
    localStorage.setItem('tymout-active-tab', tab);
  };
  
  return (
    <BrowserRouter>
      <div className="app-container">
        <header className="app-header">
        <div className="header-content">
          <h1>Tymout Messaging</h1>
          

        </div>
      </header>
      
      <main className="app-content">
        <Routes>
          <Route path="/messages" element={<MessageIndexPage />} />
          <Route path="/messages/:threadId" element={<MessageDetailPage />} />
          <Route path="*" element={<Navigate to="/messages" replace />} />
        </Routes>
      </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
