import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import ImageEditor from './components/ImageEditor';
import Footer from './components/Footer';
import BatchProcessing from './components/BatchProcessing';
import Settings from './components/Settings';
import Help from './components/Help';
import './App.css';

function App() {
  const [theme, setTheme] = useState('light');
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.body.className = newTheme;
  };

  return (
    <Router>
      <div className={`app ${theme}`}>
        <Header toggleTheme={toggleTheme} theme={theme} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<ImageEditor />} />
            <Route path="/batch" element={<BatchProcessing />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/help" element={<Help />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App; 