import React from 'react';
import './About.css';

function About() {
  return (
    <div className="about-page">
      <div className="hero">
        <h1>About Banky Auto</h1>
        <p>Your trusted source for quality rebuilt vehicles</p>
      </div>

      <div className="story-section">
        <h2>Our Story</h2>
        <p>Founded in 2020, Banky Auto has become a leading provider of rebuilt and salvage vehicles in the region. Our mission is to make quality vehicles accessible to everyone while promoting sustainable auto practices.</p>
        
        <div className="stats">
          <div className="stat-item">
            <h3>1000+</h3>
            <p>Vehicles Sold</p>
          </div>
          <div className="stat-item">
            <h3>98%</h3>
            <p>Customer Satisfaction</p>
          </div>
          <div className="stat-item">
            <h3>50+</h3>
            <p>Expert Staff</p>
          </div>
        </div>
      </div>

      <div className="team-section">
        <h2>Our Team</h2>
        <div className="team-grid">
          <div className="team-member">
            <img 
              src="/cars/founder.jpg" 
              alt="Bankole John Oladimeji"
              className="member-photo"
              onError={(e) => {
                console.error('Image failed to load:', e);
                e.target.style.backgroundColor = '#ddd';
              }}
            />
            <h3>Bankole John Oladimeji</h3>
            <p>Founder & CEO</p>
          </div>
        </div>
      </div>

      <div className="values-section">
        <h2>Our Values</h2>
        <div className="values-grid">
          <div className="value-card">
            <div className="value-icon">🎯</div>
            <h3>Quality First</h3>
            <p>We never compromise on the quality of our vehicles and service.</p>
          </div>
          <div className="value-card">
            <div className="value-icon">🤝</div>
            <h3>Transparency</h3>
            <p>Clear communication and honest dealings in everything we do.</p>
          </div>
          <div className="value-card">
            <div className="value-icon">💪</div>
            <h3>Reliability</h3>
            <p>Consistent quality and service you can count on.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;