import React from 'react';
import { Link } from 'react-router-dom';
import { FaSun, FaMoon, FaImage, FaCog, FaQuestionCircle } from 'react-icons/fa';
import './Header.css';

const Header = ({ toggleTheme, theme }) => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <Link to="/" className="logo-link">
            <FaImage className="logo-icon" />
            <span className="logo-text">Image Crop Tool</span>
          </Link>
        </div>
        
        <nav className="nav">
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/" className="nav-link">Editor</Link>
            </li>
            <li className="nav-item">
              <Link to="/batch" className="nav-link">Batch Process</Link>
            </li>
            <li className="nav-item">
              <Link to="/settings" className="nav-link">
                <FaCog className="nav-icon" />
                <span className="nav-text">Settings</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/help" className="nav-link">
                <FaQuestionCircle className="nav-icon" />
                <span className="nav-text">Help</span>
              </Link>
            </li>
            <li className="nav-item">
              <button 
                onClick={toggleTheme} 
                className="theme-toggle" 
                aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              >
                {theme === 'light' ? <FaMoon /> : <FaSun />}
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header; 