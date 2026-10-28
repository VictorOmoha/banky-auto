import React from 'react';
import PageHeader from '../components/PageHeader';
import Icon from '../components/Icon';
import { ContactLink } from '../components/ContactSheet';
import { site } from '../data/site';
import './Pages.css';

// Secure credit application hosted by DealerCenter. Their form refuses to load
// inside other sites, so it opens in its own tab.
const creditAppUrl =
  'https://dwssecuredforms.dealercenter.net/CreditApplication/index/29017421?themecolor=568dd9&formtype=l&frameId=dws_frame_0&standalone=true&ls=Our%20Website';

const needs = [
  { icon: 'users', text: 'Your name, address and contact details' },
  { icon: 'briefcase', text: 'Employment and income information' },
  { icon: 'shield', text: 'Submitted over a secure, encrypted connection' },
];

function Financing() {
  return (
    <>
      <PageHeader
        eyebrow="Financing"
        title="Apply for financing online."
        lead="Fill out our secure credit application and we’ll work with our lenders to find an option that fits you. All credit situations are welcome."
      />

      <section className="section">
        <div className="container">
          <div className="credit-app card">
            <h2 className="h3">What you’ll need</h2>
            <ul className="credit-app__list">
              {needs.map((n) => (
                <li key={n.text}>
                  <span className="icon-tile">
                    <Icon name={n.icon} size={20} />
                  </span>
                  {n.text}
                </li>
              ))}
            </ul>
            {/* No "noreferrer": DealerCenter rejects visits that don't say they came from our site. */}
            {/* eslint-disable-next-line react/jsx-no-target-blank */}
            <a
              href={creditAppUrl}
              target="_blank"
              rel="noopener"
              referrerPolicy="no-referrer-when-downgrade"
              className="btn btn--accent btn--lg btn--block"
            >
              Start your credit application <Icon name="external" size={18} />
            </a>
            <p className="credit-app__note muted">
              The application opens in a new tab. Questions?{' '}
              <ContactLink type="call">Call us at {site.phone}</ContactLink>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default Financing;
