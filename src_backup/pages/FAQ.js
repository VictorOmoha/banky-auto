import './FAQ.css';

function FAQ() {
  return (
    <div className="faq-page">
      <div className="hero">
        <h1>Frequently Asked Questions</h1>
        <p>Find answers to common questions about our services</p>
      </div>
      <div className="faq-content">
        <div className="faq-item">
          <h3>What types of vehicles do you offer?</h3>
          <p>We specialize in quality rebuilt and salvage vehicles, including sedans, SUVs, trucks, and luxury vehicles.</p>
        </div>
        <div className="faq-item">
          <h3>How does the buying process work?</h3>
          <p>Our buying process is simple: browse our inventory, schedule a test drive, get financing approval, and drive home in your new vehicle.</p>
        </div>
        <div className="faq-item">
          <h3>Do you offer financing?</h3>
          <p>Yes, we work with multiple lenders to provide competitive financing options for all credit situations.</p>
        </div>
        <div className="faq-item">
          <h3>What warranties do you offer?</h3>
          <p>We offer various warranty options to protect your investment. Each vehicle comes with different coverage options.</p>
        </div>
      </div>
    </div>
  );
}

export default FAQ;