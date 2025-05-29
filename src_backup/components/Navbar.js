import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Banky Auto
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/inventory" className="nav-link">Browse Inventory</Link>
          </li>
          <li className="nav-item">
            <Link to="/how-it-works" className="nav-link">How It Works</Link>
          </li>
          <li className="nav-item">
            <Link to="/about" className="nav-link">About Us</Link>
          </li>
          <li className="nav-item">
            <Link to="/contact" className="nav-link">Contact</Link>
          </li>
        </ul>
        <div className="nav-user-actions">
          <Link to="/login" className="nav-link">Login</Link>
          <a href="tel:1234567890" className="phone-icon">📞</a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;