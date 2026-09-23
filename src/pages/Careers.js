import React from 'react';
import PageHeader from '../components/PageHeader';
import Icon from '../components/Icon';
import { site, mailto } from '../data/site';
import './Pages.css';

const perks = [
  { icon: 'briefcase', title: 'Competitive pay', text: 'Compensation that rewards great work.' },
  { icon: 'sparkle', title: 'Room to grow', text: 'Professional growth and learning opportunities.' },
  { icon: 'users', title: 'Inclusive team', text: 'A respectful, welcoming place to work.' },
  { icon: 'shield', title: 'Health & wellness', text: 'Benefits that look after you.' },
];

const roles = [
  { title: 'Sales Representative', type: 'Raleigh, NC', text: 'Help customers find their perfect vehicle while meeting sales goals.' },
  { title: 'Auto Technician', type: 'Raleigh, NC', text: 'Join our team of skilled mechanics working on vehicle restoration.' },
];

function Careers() {
  return (
    <>
      <PageHeader eyebrow="Careers" title="Build your career with Banky Auto." lead="We’re a team that cares about cars and the people who drive them." />

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Why join us</span>
              <h2 className="h2">Good people, good cars</h2>
            </div>
          </div>
          <div className="perk-grid">
            {perks.map((p) => (
              <div key={p.title} className="perk">
                <span className="icon-tile">
                  <Icon name={p.icon} size={22} />
                </span>
                <h3>{p.title}</h3>
                <p className="muted">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--surface">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Open positions</span>
              <h2 className="h2">Join the team</h2>
            </div>
          </div>
          <div className="roles">
            {roles.map((r) => (
              <div key={r.title} className="role card">
                <div>
                  <h3 className="h3">{r.title}</h3>
                  <p className="role__type">{r.type}</p>
                  <p className="muted">{r.text}</p>
                </div>
                <a
                  href={mailto(site.careersEmail, `Application: ${r.title}`, `Hi Banky Auto team,\n\nI'd like to apply for the ${r.title} position.\n\n`)}
                  className="btn btn--accent"
                >
                  Apply now <Icon name="arrowRight" size={16} className="icon-slide" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Careers;
