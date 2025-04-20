import React from 'react';
import { FaGithub, FaTwitter, FaEnvelope } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-copyright">
          &copy; {currentYear} Image Crop Tool. All rights reserved.
        </div>
        
        <div className="footer-links">
          <a href="#privacy" className="footer-link">Privacy Policy</a>
          <a href="#terms" className="footer-link">Terms of Service</a>
          <a href="#contact" className="footer-link">Contact</a>
        </div>
        
        <div className="footer-social">
          <a href="https://github.com" className="social-link" aria-label="GitHub" target="_blank" rel="noopener noreferrer">
            <FaGithub />
          </a>
          <a href="https://twitter.com" className="social-link" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
            <FaTwitter />
          </a>
          <a href="mailto:contact@imagecrop.tool" className="social-link" aria-label="Email">
            <FaEnvelope />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 