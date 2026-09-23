import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import PageHeader from '../components/PageHeader';
import CtaBand from '../components/CtaBand';
import { steps } from '../data/process';
import { pickVehicles, vehicleName } from '../data/vehicles';
import './Pages.css';

const showcase = pickVehicles(['accord2020'], 1)[0];

const details = [
  { icon: 'camera', title: 'Full photo sets', text: 'Up to 15 photos per car, inside and out, so you know what you’re looking at before you visit.' },
  { icon: 'file', title: 'Clear title information', text: 'Salvage or rebuilt titles are disclosed upfront on the listing, with the damage history explained.' },
  { icon: 'users', title: 'Bring a second opinion', text: 'Pre-purchase inspections are welcome. Bring your own mechanic to look the car over.' },
  { icon: 'message', title: 'Straight answers', text: 'Questions get a real reply from the person selling the car, not a call center.' },
];

function HowItWorks() {
  return (
    <>
      <PageHeader
        eyebrow="How it works"
        title="From first look to keys in hand, in four steps."
        lead="We keep buying simple and transparent: honest listings, open inspections and no pressure."
      >
        <div className="page-header__actions rise rise-4">
          <Link to="/vehicles" className="btn btn--accent btn--lg">
            Start browsing <Icon name="arrowRight" size={18} className="icon-slide" />
          </Link>
        </div>
      </PageHeader>

      <section className="section">
        <div className="container">
          <ol className="timeline">
            {steps.map((s, i) => (
              <li key={s.title} className="timeline__item">
                <span className="timeline__num">{i + 1}</span>
                <div className="timeline__card card">
                  <span className="icon-tile">
                    <Icon name={s.icon} size={22} />
                  </span>
                  <div>
                    <h2 className="h3">{s.title}</h2>
                    <p className="muted">{s.text}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section--surface">
        <div className="container split">
          <div className="split__media">
            {showcase && <img src={showcase.photos[0]} alt={`${vehicleName(showcase)} ${showcase.trim}`} loading="lazy" />}
          </div>
          <div>
            <span className="eyebrow">What you can expect</span>
            <h2 className="h2">Every listing, done properly</h2>
            <div className="feature-list">
              {details.map((d) => (
                <div key={d.title} className="feature">
                  <span className="icon-tile">
                    <Icon name={d.icon} size={20} />
                  </span>
                  <div>
                    <h3>{d.title}</h3>
                    <p className="muted">{d.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CtaBand title="Ready to find your car?" text="Browse the lot online, then come see your favorite in person." />
    </>
  );
}

export default HowItWorks;
