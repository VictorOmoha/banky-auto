import './Careers.css';

function Careers() {
  return (
    <div className="careers-page">
      <div className="hero">
        <h1>Join Our Team</h1>
        <p>Build your career with Banky Auto</p>
      </div>
      <div className="careers-content">
        <div className="why-us-section">
          <h2>Why Work With Us?</h2>
          <ul>
            <li>Competitive compensation</li>
            <li>Professional growth opportunities</li>
            <li>Inclusive work environment</li>
            <li>Health and wellness benefits</li>
          </ul>
        </div>
        <div className="open-positions">
          <h2>Open Positions</h2>
          <div className="position-card">
            <h3>Sales Representative</h3>
            <p>Help customers find their perfect vehicle while meeting sales goals.</p>
            <button className="apply-btn">Apply Now</button>
          </div>
          <div className="position-card">
            <h3>Auto Technician</h3>
            <p>Join our team of skilled mechanics working on vehicle restoration.</p>
            <button className="apply-btn">Apply Now</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Careers;