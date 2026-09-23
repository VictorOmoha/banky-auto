import React, { useState } from 'react';
import Icon from '../../components/Icon';
import { useAdmin } from '../AdminContext';

const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

function Business() {
  const { content, save } = useAdmin();
  const [form, setForm] = useState(() => JSON.parse(JSON.stringify(content.site)));
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ busy: false, error: '', note: '' });

  const set = (path) => (e) => {
    const value = e.target.value;
    setForm((f) => {
      const next = { ...f };
      if (path.includes('.')) {
        const [a, b] = path.split('.');
        next[a] = { ...next[a], [b]: value };
      } else next[path] = value;
      return next;
    });
    setStatus((s) => ({ ...s, note: '' }));
  };

  const setListItem = (list, index, key) => (e) => {
    const value = e.target.value;
    setForm((f) => ({ ...f, [list]: f[list].map((item, i) => (i === index ? { ...item, [key]: value } : item)) }));
    setStatus((s) => ({ ...s, note: '' }));
  };

  const addItem = (list, item) => setForm((f) => ({ ...f, [list]: [...f[list], item] }));
  const removeItem = (list, index) => setForm((f) => ({ ...f, [list]: f[list].filter((_, i) => i !== index) }));

  const onSubmit = async (e) => {
    e.preventDefault();
    const found = {};
    if (!form.name.trim()) found.name = 'Required';
    if (!form.phone.replace(/\D/g, '').match(/^\d{10,11}$/)) found.phone = 'Enter a 10-digit phone number';
    ['email', 'salesEmail', 'careersEmail'].forEach((k) => {
      if (!emailOk(form[k] || '')) found[k] = 'Enter a valid email';
    });
    if (!form.address.line1.trim() || !form.address.city.trim()) found.address = 'Enter the street and city';
    setErrors(found);
    if (Object.keys(found).length) {
      setStatus({ busy: false, error: 'Please fix the highlighted fields.', note: '' });
      return;
    }
    const clean = {
      ...form,
      founded: Number(form.founded) || form.founded,
      hours: form.hours.filter((h) => h.days.trim() || h.time.trim()),
      socials: form.socials.filter((s) => s.label.trim() && s.href.trim()),
    };
    setStatus({ busy: true, error: '', note: '' });
    try {
      await save({ key: 'site', message: 'Update business info', mutate: () => clean });
      setForm(clean);
      setStatus({ busy: false, error: '', note: 'Saved.' });
    } catch (err) {
      setStatus({ busy: false, error: err.message, note: '' });
    }
  };

  const input = (id, label, path, props = {}) => {
    const value = path.includes('.') ? form[path.split('.')[0]][path.split('.')[1]] : form[path];
    return (
      <div className={`field ${props.wide ? 'admin-span-2' : ''}`}>
        <label htmlFor={id}>{label}</label>
        <input id={id} className="input" value={value ?? ''} onChange={set(path)} aria-invalid={!!errors[path]} {...props.attrs} />
        {errors[path] && <span className="field-error">{errors[path]}</span>}
      </div>
    );
  };

  return (
    <form className="admin-page" onSubmit={onSubmit} noValidate>
      <div className="admin-head">
        <div>
          <h1 className="admin-title">Business info</h1>
          <p className="muted">Shown in the header, footer, Contact page and on every Call and Email button.</p>
        </div>
      </div>

      <div className="admin-stack">
        <section className="card admin-panel">
          <h2>Name &amp; contact</h2>
          <div className="admin-form-grid">
            {input('b-name', 'Business name', 'name')}
            {input('b-legal', 'Legal name', 'legalName')}
            {input('b-phone', 'Phone', 'phone', { attrs: { type: 'tel', placeholder: '+1 (919) 123-4567' } })}
            {input('b-founded', 'Year founded', 'founded', { attrs: { inputMode: 'numeric' } })}
            {input('b-email', 'General email', 'email', { attrs: { type: 'email' } })}
            {input('b-sales', 'Sales email', 'salesEmail', { attrs: { type: 'email' } })}
            {input('b-careers', 'Careers email', 'careersEmail', { attrs: { type: 'email' } })}
            {input('b-tagline', 'Tagline', 'tagline')}
          </div>
        </section>

        <section className="card admin-panel">
          <h2>Address</h2>
          <div className="admin-form-grid">
            {input('b-line1', 'Street', 'address.line1', { wide: true })}
            {input('b-city', 'City', 'address.city')}
            {input('b-region', 'State', 'address.region')}
            {input('b-zip', 'ZIP', 'address.zip', { attrs: { inputMode: 'numeric' } })}
          </div>
          {errors.address && <p className="field-error">{errors.address}</p>}
          <p className="muted admin-panel__lead">The map and directions on the Contact page follow this address automatically.</p>
        </section>

        <section className="card admin-panel">
          <h2>Opening hours</h2>
          <div className="admin-rows">
            {form.hours.map((h, i) => (
              <div key={i} className="admin-row">
                <label className="sr-only" htmlFor={`h-days-${i}`}>
                  Days
                </label>
                <input id={`h-days-${i}`} className="input" placeholder="Mon – Fri" value={h.days} onChange={setListItem('hours', i, 'days')} />
                <label className="sr-only" htmlFor={`h-time-${i}`}>
                  Hours
                </label>
                <input
                  id={`h-time-${i}`}
                  className="input"
                  placeholder="9:00 AM – 6:00 PM"
                  value={h.time}
                  onChange={setListItem('hours', i, 'time')}
                />
                <button type="button" className="admin-icon-btn" onClick={() => removeItem('hours', i)} aria-label="Remove row">
                  <Icon name="close" size={16} />
                </button>
              </div>
            ))}
          </div>
          <button type="button" className="btn btn--soft" onClick={() => addItem('hours', { days: '', time: '' })}>
            Add hours row
          </button>
        </section>

        <section className="card admin-panel">
          <h2>Social links</h2>
          <div className="admin-rows">
            {form.socials.map((s, i) => (
              <div key={i} className="admin-row">
                <label className="sr-only" htmlFor={`s-label-${i}`}>
                  Network
                </label>
                <input id={`s-label-${i}`} className="input" placeholder="Instagram" value={s.label} onChange={setListItem('socials', i, 'label')} />
                <label className="sr-only" htmlFor={`s-href-${i}`}>
                  Link
                </label>
                <input
                  id={`s-href-${i}`}
                  className="input"
                  type="url"
                  placeholder="https://instagram.com/…"
                  value={s.href}
                  onChange={setListItem('socials', i, 'href')}
                />
                <button type="button" className="admin-icon-btn" onClick={() => removeItem('socials', i)} aria-label="Remove link">
                  <Icon name="close" size={16} />
                </button>
              </div>
            ))}
          </div>
          <button type="button" className="btn btn--soft" onClick={() => addItem('socials', { label: '', href: '' })}>
            Add social link
          </button>
        </section>

        <div className="admin-savebar">
          {status.error && (
            <span className="field-error" role="alert">
              {status.error}
            </span>
          )}
          {status.note && <span className="admin-note">{status.note}</span>}
          <button type="submit" className="btn btn--accent btn--lg" disabled={status.busy}>
            {status.busy ? 'Saving…' : 'Save business info'}
          </button>
        </div>
      </div>
    </form>
  );
}

export default Business;
