import React from 'react';
import './HowItWorks.css';
import { useNavigate } from 'react-router-dom';

function HowItWorks() {
  const navigate = useNavigate();

  return (
    <div className="how-it-works-page">
      <div className="hero-section">
        <div className="hero-content">
          <div className="process-showcase">
            <img src="/cars/civic2022.jpeg" alt="Process Overview" />
            <div className="process-badge">
              <span className="process-label">Simple Steps</span>
              <span className="process-count">4 Easy Steps</span>
            </div>
          </div>
          <div className="process-info">
            <h1>HOW BANKY AUTO WORKS</h1>
            <p>Your journey to a quality salvage vehicle starts here.<br />Simple, transparent, and detailed documentation of every vehicle.</p>
            <button 
              className="start-journey-btn"
              onClick={() => navigate('/inventory')}
            >
              Start Your Journey
            </button>
          </div>
        </div>
      </div>

      <div className="process-steps-section">
        <h2>Your Path to Your Next Vehicle</h2>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Browse & Select</h3>
            <p>Explore our inventory of salvage vehicles. Each listing includes detailed damage history and repair documentation.</p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h3>Vehicle History Review</h3>
            <p>Review comprehensive damage assessment, repair documentation, and current vehicle condition reports.</p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h3>Inspection Options</h3>
            <p>Schedule an in-person inspection or review our detailed virtual inspection report with high-resolution photos.</p>
          </div>
          <div className="step-card">
            <div className="step-number">4</div>
            <h3>Complete Purchase</h3>
            <p>Finalize your purchase with all necessary salvage title documentation and schedule delivery or pickup.</p>
          </div>
        </div>
      </div>

      <div className="unlock-section">
        <div className="unlock-content">
          <h2>Ready to find your perfect salvage vehicle?</h2>
          <p>Browse our selection of quality rebuilt salvage cars</p>
          <button 
            className="browse-inventory-btn"
            onClick={() => navigate('/inventory')}
          >
            Browse Inventory
          </button>
        </div>
        <div className="car-samples">
          <img src="/cars/camry.jpeg" alt="Car Sample 1" />
          <img src="/cars/pilot2021.jpeg" alt="Car Sample 2" />
          <img src="/cars/civic2022.jpeg" alt="Car Sample 3" />
        </div>
      </div>
    </div>
  );
}

export default HowItWorks;