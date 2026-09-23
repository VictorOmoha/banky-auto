import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import VehicleCard from '../components/VehicleCard';
import CtaBand from '../components/CtaBand';
import { vehicles, formatPrice, vehicleName } from '../data/vehicles';
import { reviews } from '../data/reviews';
import { steps } from '../data/process';
import './Home.css';

const heroCar = vehicles.find((v) => v.id === 'camry2023');
const featured = vehicles.filter((v) => v.featured).slice(0, 6);
const lowestPrice = Math.min(...vehicles.map((v) => v.price));

const quickLinks = [
  { label: 'SUVs', to: '/vehicles?body=SUV' },
  { label: 'Sedans', to: '/vehicles?body=Sedan' },
  { label: 'Honda', to: '/vehicles?make=Honda' },
  { label: 'Under $15k', to: '/vehicles?max=15000' },
];

const promises = [
  { icon: 'shield', title: 'Inspected & documented', text: 'Every car is checked over and photographed inside and out before it’s listed.' },
  { icon: 'file', title: 'Upfront pricing', text: 'The price you see is the price. No surprise fees or pressure at the lot.' },
  { icon: 'key', title: 'Paid off & ready', text: 'Many of our cars are paid off, so there’s no lender payoff to wait on.' },
  { icon: 'handshake', title: 'Local & personal', text: 'You deal directly with the owner, from your first question to the handover.' },
];

function Home() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const onSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/vehicles?q=${encodeURIComponent(q)}` : '/vehicles');
  };

  const counts = {
    SUV: vehicles.filter((v) => v.body === 'SUV').length,
    Sedan: vehicles.filter((v) => v.body === 'Sedan').length,
  };

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="container hero__grid">
          <div className="hero__copy">
            <span className="eyebrow rise">Raleigh, NC · Since 2020</span>
            <h1 className="h1 rise rise-2">
              Honest cars.
              <br />
              <span className="hero__accent">Fair prices.</span>
            </h1>
            <p className="lead rise rise-3">
              Quality used and rebuilt vehicles, inspected and photographed in detail, with upfront prices from{' '}
              {formatPrice(lowestPrice)}.
            </p>

            <form className="hero__search rise rise-4" onSubmit={onSearch} role="search">
              <Icon name="search" size={20} className="hero__search-icon" />
              <label htmlFor="hero-search" className="sr-only">
                Search inventory
              </label>
              <input
                id="hero-search"
                type="search"
                placeholder="Search make, model or year"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button type="submit" className="btn btn--accent">
                Search
              </button>
            </form>

            <div className="hero__quick rise rise-4">
              {quickLinks.map((q) => (
                <Link key={q.label} to={q.to} className="chip hero__chip">
                  {q.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="hero__visual rise rise-3">
            <div className="hero__frame">
              <img src={heroCar.photos[0]} alt={`${vehicleName(heroCar)} ${heroCar.trim}`} />
            </div>
            <Link to={`/vehicles/${heroCar.id}`} className="hero__float hero__float--car">
              <span className="muted">Featured</span>
              <strong>
                {vehicleName(heroCar)} {heroCar.trim}
              </strong>
              <span className="hero__float-row">
                <span className="hero__float-price">{formatPrice(heroCar.price)}</span>
                <span className="chip">{heroCar.mileage.toLocaleString()} mi</span>
              </span>
            </Link>
            <div className="hero__float hero__float--rating">
              <span className="hero__stars" aria-hidden="true">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Icon key={i} name="star" size={16} filled strokeWidth={0} />
                ))}
              </span>
              <span>
                <strong>5.0</strong> from {reviews.length} customer reviews
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Promises */}
      <section className="promises">
        <div className="container promises__grid">
          {promises.map((p) => (
            <div key={p.title} className="promise">
              <span className="icon-tile">
                <Icon name={p.icon} size={22} />
              </span>
              <div>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured inventory */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Featured inventory</span>
              <h2 className="h2">Ready to drive home</h2>
            </div>
            <Link to="/vehicles" className="text-link">
              View all {vehicles.length} vehicles <Icon name="arrowRight" size={16} />
            </Link>
          </div>
          <div className="vgrid">
            {featured.map((v) => (
              <VehicleCard key={v.id} vehicle={v} />
            ))}
          </div>
        </div>
      </section>

      {/* Browse by type */}
      <section className="section--tight">
        <div className="container">
          <div className="types">
            <Link to="/vehicles?body=SUV" className="type type--suv">
              <img src={vehicles.find((v) => v.id === 'pilot2021').photos[0]} alt="" />
              <div className="type__label">
                <span className="chip chip--glass">{counts.SUV} available</span>
                <h3>SUVs</h3>
                <span className="type__go">
                  Shop SUVs <Icon name="arrowRight" size={16} />
                </span>
              </div>
            </Link>
            <Link to="/vehicles?body=Sedan" className="type type--sedan">
              <img src={vehicles.find((v) => v.id === 'civic2022').photos[0]} alt="" />
              <div className="type__label">
                <span className="chip chip--glass">{counts.Sedan} available</span>
                <h3>Sedans</h3>
                <span className="type__go">
                  Shop sedans <Icon name="arrowRight" size={16} />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section section--ink home-steps">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">How it works</span>
              <h2 className="h2">Buying a car shouldn’t be complicated</h2>
            </div>
            <Link to="/how-it-works" className="btn btn--outline-light">
              Learn more <Icon name="arrowRight" size={16} className="icon-slide" />
            </Link>
          </div>
          <ol className="steps">
            {steps.map((s, i) => (
              <li key={s.title} className="step">
                <span className="step__num">{String(i + 1).padStart(2, '0')}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Reviews */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Customer reviews</span>
              <h2 className="h2">Don’t just take our word for it</h2>
            </div>
            <div className="rating-summary">
              <span className="rating-summary__score">5.0</span>
              <span>
                <span className="hero__stars" aria-label="5 out of 5 stars">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Icon key={i} name="star" size={16} filled strokeWidth={0} />
                  ))}
                </span>
                <span className="muted">{reviews.length} customer reviews</span>
              </span>
            </div>
          </div>
          <div className="reviews">
            {reviews.map((r) => (
              <figure key={r.name} className="review">
                <span className="hero__stars" aria-label="5 out of 5 stars">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Icon key={i} name="star" size={15} filled strokeWidth={0} />
                  ))}
                </span>
                <blockquote>“{r.content}”</blockquote>
                <figcaption>
                  <span className="review__avatar" aria-hidden="true">
                    {r.name[0]}
                  </span>
                  <span>
                    <strong>{r.name}</strong>
                    <span className="muted">{r.date}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}

export default Home;
