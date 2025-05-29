import './HelpCenter.css';

function HelpCenter() {
  return (
    <div className="help-center-page">
      <div className="hero">
        <h1>Help Center</h1>
        <p>We're here to assist you</p>
      </div>
      <div className="help-content">
        <div className="help-section">
          <h2>Getting Started</h2>
          <ul>
            <li>How to browse our inventory</li>
            <li>Understanding vehicle conditions</li>
            <li>Scheduling a test drive</li>
            <li>Financing options</li>
          </ul>
        </div>
        <div className="help-section">
          <h2>Contact Support</h2>
          <p>Need immediate assistance? Our support team is available:</p>
          <ul>
            <li>Phone: (555) 123-4567</li>
            <li>Email: support@bankyauto.com</li>
            <li>Hours: Mon-Sat, 9AM-6PM</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default HelpCenter;