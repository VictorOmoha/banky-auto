import React, { useState } from 'react';
import Icon from '../components/Icon';
import { ContactLink, useContact } from '../components/ContactSheet';
import PageHeader from '../components/PageHeader';
import LocationMap from '../components/LocationMap';
import { site, fullAddress, mapsUrl } from '../data/site';
import { lotPhotos } from '../data/lot';
import './Pages.css';

const empty = { name: '', email: '', phone: '', subject: '', message: '' };

function validate(data) {
  const errors = {};
  if (!data.name.trim()) errors.name = 'Please enter your name';
  if (!data.email.trim()) errors.email = 'Please enter your email';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = 'That email doesn’t look right';
  if (!data.subject.trim()) errors.subject = 'Please add a subject';
  if (!data.message.trim()) errors.message = 'Please write a message';
  return errors;
}

function Contact() {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const openContact = useContact();

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) {
      document.getElementById(`c-${Object.keys(found)[0]}`)?.focus();
      return;
    }
    const body = [form.message, '', `— ${form.name}`, form.email, form.phone].filter(Boolean).join('\n');
    openContact('email', {
      title: 'Send your message',
      intro: 'Your message is ready. Send it with any option below.',
      to: site.email,
      subject: form.subject,
      body,
    });
  };

  const field = (name, label, props = {}) => (
    <div className={`field ${props.wide ? 'span-2' : ''}`}>
      <label htmlFor={`c-${name}`}>
        {label} {props.optional && <span className="hint">(optional)</span>}
      </label>
      {props.textarea ? (
        <textarea
          id={`c-${name}`}
          name={name}
          rows="5"
          className="textarea"
          value={form[name]}
          onChange={onChange}
          aria-invalid={!!errors[name]}
          aria-describedby={errors[name] ? `c-${name}-err` : undefined}
        />
      ) : (
        <input
          id={`c-${name}`}
          name={name}
          type={props.type || 'text'}
          autoComplete={props.autoComplete}
          className="input"
          value={form[name]}
          onChange={onChange}
          aria-invalid={!!errors[name]}
          aria-describedby={errors[name] ? `c-${name}-err` : undefined}
        />
      )}
      {errors[name] && (
        <span id={`c-${name}-err`} className="field-error">
          {errors[name]}
        </span>
      )}
    </div>
  );

  return (
    <>
      <PageHeader eyebrow="Contact" title="Let’s talk cars." lead="Questions about a vehicle, a test drive, or anything else? We’re here to help." />

      <section className="section">
        <div className="container contact">
          <div className="contact__info">
            <ContactLink type="call" className="contact-card card">
              <span className="icon-tile">
                <Icon name="phone" size={20} />
              </span>
              <div>
                <h2>Call us</h2>
                <p>{site.phone}</p>
              </div>
              <Icon name="arrowRight" size={18} className="contact-card__go" />
            </ContactLink>
            <ContactLink type="email" className="contact-card card">
              <span className="icon-tile">
                <Icon name="mail" size={20} />
              </span>
              <div>
                <h2>Email</h2>
                <p>{site.email}</p>
                {site.salesEmail !== site.email && <p>{site.salesEmail}</p>}
              </div>
              <Icon name="arrowRight" size={18} className="contact-card__go" />
            </ContactLink>
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="contact-card card">
              <span className="icon-tile">
                <Icon name="pin" size={20} />
              </span>
              <div>
                <h2>Visit</h2>
                <p>{site.legalName}</p>
                <p>{fullAddress}</p>
              </div>
              <Icon name="external" size={18} className="contact-card__go" />
            </a>
            <div className="contact-card card">
              <span className="icon-tile">
                <Icon name="clock" size={20} />
              </span>
              <div>
                <h2>Hours</h2>
                {site.hours.map((h) => (
                  <p key={h.days} className="hours-row">
                    <span>{h.days}</span>
                    <span>{h.time}</span>
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div className="contact__form card">
            <h2 className="h3">Send us a message</h2>
            <p className="muted contact__form-lead">Tell us what you’re looking for and we’ll get back to you.</p>
            <form className="form-grid" onSubmit={onSubmit} noValidate>
              {field('name', 'Name', { autoComplete: 'name' })}
              {field('email', 'Email', { type: 'email', autoComplete: 'email' })}
              {field('phone', 'Phone', { type: 'tel', autoComplete: 'tel', optional: true })}
              {field('subject', 'Subject')}
              {field('message', 'Message', { textarea: true, wide: true })}
              <div className="span-2">
                <button type="submit" className="btn btn--accent btn--lg">
                  Send message <Icon name="arrowRight" size={18} className="icon-slide" />
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="container">
          <figure className="photo-band photo-band--entrance">
            <img src={lotPhotos.entrance.src} alt={lotPhotos.entrance.alt} loading="lazy" />
            <figcaption>Drive in through the gate. The cars are parked right inside.</figcaption>
          </figure>
          <LocationMap />
        </div>
      </section>
    </>
  );
}

export default Contact;
