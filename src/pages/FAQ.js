import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Icon from '../components/Icon';
import { ContactLink } from '../components/ContactSheet';
import { site } from '../data/site';
import './Pages.css';

export const faqs = [
  {
    q: 'What types of vehicles do you offer?',
    a: 'We specialize in quality used and rebuilt vehicles, including sedans, SUVs, trucks and luxury vehicles. See what’s on the lot right now in our inventory.',
  },
  {
    id: 'title-status',
    q: 'What’s the difference between a clean, salvage and rebuilt title?',
    a: 'A salvage title is issued when an insurer declares a vehicle a total loss, often because repair costs exceeded a share of its value. Once repaired and inspected by the state, it can be retitled as rebuilt (sometimes called reconstructed). These cars usually cost much less than clean-title equivalents. Rules vary by state, and some insurers and lenders treat these titles differently, so check with yours before you buy. We always show the title status and known damage history on the listing.',
  },
  {
    q: 'How does the buying process work?',
    a: 'Browse our inventory, ask us anything about a car you like, schedule a test drive, and finalize the paperwork when you’re ready. Our How it works page walks through each step.',
    link: { to: '/how-it-works', label: 'How it works' },
  },
  {
    q: 'Can I have a car inspected before I buy it?',
    a: 'Yes. We encourage it. Schedule an in-person inspection and feel free to bring your own mechanic.',
  },
  {
    q: 'How do I schedule a test drive?',
    a: `Open any vehicle and choose “Schedule a test drive”, or call us at ${site.phone}. We’ll confirm a time that works for you.`,
  },
  {
    q: 'Do you offer financing?',
    a: 'Yes, we work with multiple lenders to provide competitive financing options for all credit situations. Contact us to talk through your options.',
  },
  {
    q: 'What warranties do you offer?',
    a: 'We offer various warranty options to protect your investment. Coverage varies by vehicle, so ask us about the car you’re interested in.',
  },
];

function FAQ() {
  // Expand the answer a link points to (e.g. /faq#title-status), not just the first one.
  const target = useLocation().hash.slice(1);
  return (
    <>
      <PageHeader eyebrow="FAQ" title="Questions, answered." lead="Everything you need to know about buying from Banky Auto." />

      <section className="section">
        <div className="container faq">
          <div className="faq__list">
            {faqs.map((f, i) => (
              <details key={f.q} id={f.id} className="faq__item" open={target ? f.id === target : i === 0}>
                <summary>
                  <span>{f.q}</span>
                  <Icon name="chevronDown" size={20} />
                </summary>
                <div className="faq__answer">
                  <p>{f.a}</p>
                  {f.link && (
                    <Link to={f.link.to} className="text-link">
                      {f.link.label} <Icon name="arrowRight" size={16} />
                    </Link>
                  )}
                </div>
              </details>
            ))}
          </div>

          <aside className="faq__aside card">
            <span className="icon-tile">
              <Icon name="message" size={22} />
            </span>
            <h2 className="h3">Still have questions?</h2>
            <p className="muted">We’re happy to help. Reach out and talk to a real person.</p>
            <ContactLink type="call" className="btn btn--accent btn--block">
              <Icon name="phone" size={16} /> {site.phone}
            </ContactLink>
            <Link to="/contact" className="btn btn--ghost btn--block">
              Send a message
            </Link>
          </aside>
        </div>
      </section>
    </>
  );
}

export default FAQ;
