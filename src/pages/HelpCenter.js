import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Icon from '../components/Icon';
import { ContactLink } from '../components/ContactSheet';
import { site } from '../data/site';
import './Pages.css';

const topics = [
  { icon: 'search', title: 'Browsing our inventory', text: 'Search, filter and compare every car on the lot.', to: '/vehicles' },
  { icon: 'file', title: 'Understanding title status', text: 'Clean, salvage and rebuilt titles, explained.', to: '/faq#title-status' },
  { icon: 'calendar', title: 'Scheduling a test drive', text: 'Book a time right from any vehicle page.', to: '/faq' },
  { icon: 'key', title: 'The buying process', text: 'What happens from first look to handover.', to: '/how-it-works' },
  { icon: 'briefcase', title: 'Financing options', text: 'We work with multiple lenders. Ask us how.', to: '/faq' },
  { icon: 'message', title: 'Contact support', text: 'Talk to a real person about anything else.', to: '/contact' },
];

function HelpCenter() {
  return (
    <>
      <PageHeader eyebrow="Help center" title="How can we help?" lead="Guides and answers for every step of buying your next car." />

      <section className="section">
        <div className="container">
          <div className="topic-grid">
            {topics.map((t) => (
              <Link key={t.title} to={t.to} className="topic card">
                <span className="icon-tile">
                  <Icon name={t.icon} size={22} />
                </span>
                <h2 className="h3">{t.title}</h2>
                <p className="muted">{t.text}</p>
                <span className="topic__go">
                  Learn more <Icon name="arrowRight" size={16} />
                </span>
              </Link>
            ))}
          </div>

          <div className="support-strip card">
            <div>
              <h2 className="h3">Need a hand right now?</h2>
              <p className="muted">
                {site.hours.map((h) => `${h.days}: ${h.time}`).join(' · ')}
              </p>
            </div>
            <div className="support-strip__actions">
              <ContactLink type="call" className="btn btn--accent">
                <Icon name="phone" size={16} /> {site.phone}
              </ContactLink>
              <ContactLink type="email" className="btn btn--ghost">
                <Icon name="mail" size={16} /> {site.email}
              </ContactLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default HelpCenter;
