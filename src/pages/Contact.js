import React, { useState, useEffect, useRef } from 'react';
import './Contact.css';

function Contact() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }
    if (!formData.subject.trim()) errors.subject = 'Subject is required';
    if (!formData.message.trim()) errors.message = 'Message is required';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);
      try {
        // Here you would typically send the form data to your backend
        console.log('Form submitted:', formData);
        alert('Thank you for your message. We will get back to you soon!');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } catch (error) {
        alert('There was an error submitting the form. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prevErrors => ({
        ...prevErrors,
        [name]: ''
      }));
    }
  };

  useEffect(() => {
    // Add Leaflet CSS if not already present
    if (!document.querySelector('link[href*="leaflet.css"]')) {
      const linkElement = document.createElement('link');
      linkElement.rel = 'stylesheet';
      linkElement.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(linkElement);
    }

    // Add Leaflet JS if not already present
    const loadMap = () => {
      if (!window.L) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.async = true;
        document.head.appendChild(script);
        script.onload = initializeMap;
      } else {
        initializeMap();
      }
    };

    const initializeMap = () => {
      if (mapInstanceRef.current) {
        return; // Map already initialized
      }

      const leaflet = window.L;
      if (!leaflet || !mapRef.current) return;

      // Initialize the map
      mapInstanceRef.current = leaflet.map(mapRef.current).setView([35.8544, -78.5800], 15);

      // Add OpenStreetMap tiles
      leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current);

      // Add marker for Banky Auto Sales Inc
      leaflet.marker([35.8544, -78.5800])
        .addTo(mapInstanceRef.current)
        .bindPopup('<b>Banky Auto Sales Inc</b><br>5847 McHines pl Ste D<br>Raleigh, NC 27616')
        .openPopup();
    };

    loadMap();

    return () => {
      // Cleanup
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="contact-page">
      <div className="hero">
        <h1>Contact Banky Auto Sales Inc</h1>
        <p>We're here to help with any questions you may have</p>
      </div>

      <div className="contact-container">
        <div className="contact-info">
          <div className="info-card">
            <div className="info-icon">📍</div>
            <h3>Visit Us</h3>
            <p>Banky Auto Sales Inc</p>
            <p>5847 McHines pl Ste D</p>
            <p>Raleigh, NC 27616</p>
          </div>
          <div className="info-card">
            <div className="info-icon">📞</div>
            <h3>Call Us</h3>
            <p>+1 (919) 123-4567</p>
            <p>Mon - Sat: 9:00 AM - 6:00 PM</p>
            <p>Sunday: Closed</p>
          </div>
          <div className="info-card">
            <div className="info-icon">✉️</div>
            <h3>Email Us</h3>
            <p>info@bankyauto.com</p>
            <p>sales@bankyauto.com</p>
          </div>
        </div>

        <div className="form-container">
          <h2>Send Us a Message</h2>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
              />
              {formErrors.name && <span className="error-message">{formErrors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your email address"
              />
              {formErrors.email && <span className="error-message">{formErrors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone (Optional)</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Your phone number"
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject *</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="What is this regarding?"
              />
              {formErrors.subject && <span className="error-message">{formErrors.subject}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your message"
                rows="5"
              />
              {formErrors.message && <span className="error-message">{formErrors.message}</span>}
            </div>

            <button 
              type="submit" 
              className="submit-btn" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>

      <div ref={mapRef} className="map-container"></div>
    </div>
  );
}

export default Contact;