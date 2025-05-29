import React, { useState } from 'react';
import './Financing.css';

function Financing() {
  const [monthlyPayment, setMonthlyPayment] = useState(395);

  return (
    <div className="financing-page">
      <div className="hero-section">
        <div className="hero-content">
          <div className="car-showcase">
            <img src="/cars/camry.jpeg" alt="Featured Car" />
            <div className="payment-badge">
              <span className="payment-label">Monthly Payment*</span>
              <span className="payment-amount">${monthlyPayment}/mo</span>
            </div>
          </div>
          <div className="financing-info">
            <h1>FINANCING MADE EASY</h1>
            <p>Get pre-qualified for a Banky Auto loan today.<br />Quick approval process with competitive rates.</p>
            <button className="get-terms-btn">Get Your Terms</button>
          </div>
        </div>
      </div>

      <div className="why-choose-section">
        <h2>Why choose Banky Auto?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🚗</div>
            <h3>Quality Vehicles</h3>
            <p>All vehicles undergo thorough inspection and reconditioning. Full vehicle history reports available.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🚚</div>
            <h3>Easy Delivery</h3>
            <p>Choose between pickup at our location or convenient delivery right to your doorstep.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>Trade-in Welcome</h3>
            <p>Get top value for your trade-in and apply it to your new purchase. Quick and easy process.</p>
          </div>
        </div>
      </div>

      <div className="unlock-section">
        <div className="unlock-content">
          <h2>Unlock real payments on our entire inventory</h2>
          <p>Fast and easy financing options available</p>
          <button className="shop-vehicles-btn">Shop Vehicles</button>
        </div>
        <div className="car-samples">
          <img src="/cars/civic2022.jpeg" alt="Car Sample 1" />
          <img src="/cars/pilot2021.jpeg" alt="Car Sample 2" />
          <img src="/cars/camry.jpeg" alt="Car Sample 3" />
        </div>
      </div>
    </div>
  );
}

export default Financing;