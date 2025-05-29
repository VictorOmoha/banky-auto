import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Company Info</h3>
          <ul>
            <li><a href="/about">About Us</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/careers">Careers</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Customer Support</h3>
          <ul>
            <li><a href="/faq">FAQs</a></li>
            <li><a href="/help">Help Center</a></li>
            <li>
              <a 
                href="javascript:void(0)" 
                className="live-chat"
                onClick={(e) => {
                  e.preventDefault();
                  // Add your live chat functionality here
                  console.log('Live chat clicked');
                }}
              >
                Live Chat
              </a>
            </li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Legal</h3>
          <ul>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/terms">Terms & Conditions</a></li>
            <li><a href="/disclaimer">Salvage Title Disclaimer</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Connect With Us</h3>
          <div className="social-icons">
            <a href="https://twitter.com/bankyauto" target="_blank" rel="noopener noreferrer" className="social-icon">🐦</a>
            <a href="https://instagram.com/bankyauto" target="_blank" rel="noopener noreferrer" className="social-icon">📸</a>
            <a href="https://facebook.com/bankyauto" target="_blank" rel="noopener noreferrer" className="social-icon">👥</a>
            <a href="https://linkedin.com/company/bankyauto" target="_blank" rel="noopener noreferrer" className="social-icon">💼</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 Banky Auto. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;