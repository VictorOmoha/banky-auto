import React from 'react';
import Icon from '../components/Icon';
import PageHeader from '../components/PageHeader';
import CtaBand from '../components/CtaBand';
import { site } from '../data/site';
import './Pages.css';

const stats = [
  { value: '1,000+', label: 'Vehicles sold' },
  { value: '98%', label: 'Customer satisfaction' },
  { value: '50+', label: 'Expert staff' },
];

const values = [
  { icon: 'shield', title: 'Quality first', text: 'We never compromise on the quality of our vehicles or our service.' },
  { icon: 'handshake', title: 'Transparency', text: 'Clear communication and honest dealing in everything we do, including the car’s history.' },
  { icon: 'check', title: 'Reliability', text: 'Consistent quality and service you can count on, before and after you buy.' },
];

function About() {
  return (
    <>
      <PageHeader
        eyebrow="About us"
        title="Quality cars, honest dealing, and people treated right."
        lead={`${site.legalName} has been helping Raleigh drivers find quality used and rebuilt vehicles since ${site.founded}.`}
      />

      <section className="section">
        <div className="container split split--top">
          <div>
            <span className="eyebrow">Our story</span>
            <h2 className="h2">Quality cars, accessible to everyone</h2>
          </div>
          <div className="prose">
            <p className="lead">
              Founded in {site.founded}, Banky Auto has become a trusted source of rebuilt and used vehicles in the region.
            </p>
            <p>
              Our mission is to make quality vehicles accessible to everyone while promoting sustainable auto practices. Giving a
              well-repaired car a second life keeps it on the road and out of the scrapyard, and saves you money.
            </p>
            <p>
              When you buy from us, you deal directly with the people who know the car. Ask anything; we’ll give you a straight
              answer.
            </p>
          </div>
        </div>

        <div className="container">
          <dl className="stats">
            {stats.map((s) => (
              <div key={s.label} className="stat">
                <dt>{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section section--surface">
        <div className="container split">
          <div className="founder">
            <img src={`${process.env.PUBLIC_URL}/cars/founder.jpg`} alt="Bankole John Oladimeji, founder of Banky Auto" loading="lazy" />
          </div>
          <div>
            <span className="eyebrow">Meet the founder</span>
            <h2 className="h2">Bankole John Oladimeji</h2>
            <p className="muted founder__role">Founder &amp; CEO</p>
            <blockquote className="founder__quote">
              “He was very patient and answered all my questions, as well as addressed all my concerns.”
              <cite>Carlton, Banky Auto customer</cite>
            </blockquote>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Our values</span>
              <h2 className="h2">What we stand for</h2>
            </div>
          </div>
          <div className="value-grid">
            {values.map((v) => (
              <div key={v.title} className="card value">
                <span className="icon-tile">
                  <Icon name={v.icon} size={22} />
                </span>
                <h3 className="h3">{v.title}</h3>
                <p className="muted">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}

export default About;
