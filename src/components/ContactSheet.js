import React, { createContext, useCallback, useContext, useState } from 'react';
import Icon from './Icon';
import Modal from './Modal';
import { site, mailto, gmailUrl, outlookUrl } from '../data/site';
import './ContactSheet.css';

const ContactContext = createContext(() => {});

// Copies text, falling back to a hidden textarea where the Clipboard API is
// unavailable or blocked (older browsers, sandboxed frames).
async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const el = document.createElement('textarea');
    el.value = text;
    el.setAttribute('readonly', '');
    el.style.position = 'fixed';
    el.style.opacity = '0';
    document.body.appendChild(el);
    el.select();
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch {
      ok = false;
    }
    document.body.removeChild(el);
    return ok;
  }
}

function CopyButton({ text, label }) {
  const [state, setState] = useState('idle');
  const onClick = async () => {
    setState((await copyText(text)) ? 'done' : 'failed');
    setTimeout(() => setState('idle'), 2200);
  };
  return (
    <button type="button" className="btn btn--ghost btn--block" onClick={onClick}>
      <Icon name={state === 'done' ? 'check' : 'file'} size={16} />
      {state === 'done' ? 'Copied!' : state === 'failed' ? 'Press Ctrl+C to copy' : label}
    </button>
  );
}

function CallPanel() {
  return (
    <div className="csheet">
      <div className="csheet__hero">
        <span className="icon-tile">
          <Icon name="phone" size={22} />
        </span>
        <span>
          <span className="csheet__label">Call us</span>
          <strong className="csheet__value">{site.phone}</strong>
        </span>
      </div>
      <div className="csheet__actions">
        <a href={site.phoneHref} className="btn btn--accent btn--lg btn--block">
          <Icon name="phone" size={18} /> Call now
        </a>
        <CopyButton text={site.phone} label="Copy number" />
      </div>
      <ul className="csheet__hours">
        {site.hours.map((h) => (
          <li key={h.days}>
            <span>{h.days}</span>
            <span>{h.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function EmailPanel({ to = site.email, subject = '', body = '', intro }) {
  return (
    <div className="csheet">
      {intro && <p className="csheet__intro">{intro}</p>}
      <div className="csheet__hero">
        <span className="icon-tile">
          <Icon name="mail" size={22} />
        </span>
        <span>
          <span className="csheet__label">Email us at</span>
          <strong className="csheet__value csheet__value--email">{to}</strong>
        </span>
      </div>

      {body && (
        <div className="csheet__draft">
          <span className="csheet__label">Your message{subject && `: ${subject}`}</span>
          <pre>{body}</pre>
        </div>
      )}

      <div className="csheet__grid">
        <a href={gmailUrl(to, subject, body)} target="_blank" rel="noopener noreferrer" className="btn btn--accent btn--block">
          <Icon name="external" size={16} /> Open in Gmail
        </a>
        <a href={outlookUrl(to, subject, body)} target="_blank" rel="noopener noreferrer" className="btn btn--accent btn--block">
          <Icon name="external" size={16} /> Open in Outlook
        </a>
        <a href={mailto(to, subject, body)} className="btn btn--ghost btn--block">
          <Icon name="mail" size={16} /> Use my email app
        </a>
        <CopyButton text={body ? `To: ${to}\nSubject: ${subject}\n\n${body}` : to} label={body ? 'Copy message' : 'Copy address'} />
      </div>
    </div>
  );
}

// Wrap the app once; any component can then open the call or email sheet.
export function ContactProvider({ children }) {
  const [sheet, setSheet] = useState(null);
  const close = useCallback(() => setSheet(null), []);
  const open = useCallback((type, options = {}) => setSheet({ type, ...options }), []);

  const title = sheet?.title || (sheet?.type === 'call' ? 'Call Banky Auto' : 'Email Banky Auto');

  return (
    <ContactContext.Provider value={open}>
      {children}
      <Modal open={!!sheet} onClose={close} title={title} labelledBy="contact-sheet-title">
        {sheet?.type === 'call' && <CallPanel />}
        {sheet?.type === 'email' && <EmailPanel {...sheet} />}
      </Modal>
    </ContactContext.Provider>
  );
}

export const useContact = () => useContext(ContactContext);

// A real tel:/mailto: link (so right-click and screen readers still work)
// that opens the contact sheet instead of relying on an installed app.
export function ContactLink({ type, email, subject, body, children, ...rest }) {
  const openSheet = useContact();
  const href = type === 'call' ? site.phoneHref : mailto(email || site.email, subject, body);
  const onClick = (e) => {
    e.preventDefault();
    openSheet(type, type === 'email' ? { to: email || site.email, subject, body } : {});
  };
  return (
    <a href={href} onClick={onClick} {...rest}>
      {children}
    </a>
  );
}
