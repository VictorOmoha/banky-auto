import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import VehicleCard from '../components/VehicleCard';
import CtaBand from '../components/CtaBand';
import SearchSuggest from '../components/SearchSuggest';
import { vehicles, formatPrice, vehicleName, pickVehicles } from '../data/vehicles';
import { reviews } from '../data/reviews';
import { steps } from '../data/process';
import { lotPhotos } from '../data/lot';
import { site, fullAddress, directionsUrl } from '../data/site';
import './Home.css';

const showcase = pickVehicles(['pilot2021', 'camry2023', 'civic2022'], 3);
const whyCar = pickVehicles(['accord2020'], 1)[0];
const featured = vehicles.filter((v) => v.featured).slice(0, 6);
const count = (fn) => vehicles.filter(fn).length;

const categories = [
  { icon: 'car', label: 'SUVs', to: '/vehicles?body=SUV', meta: `${count((v) => v.body === 'SUV')} available` },
  { icon: 'car', label: 'Sedans', to: '/vehicles?body=Sedan', meta: `${count((v) => v.body === 'Sedan')} available` },
  { icon: 'sparkle', label: 'Under $15k', to: '/vehicles?max=15000', meta: `${count((v) => v.price <= 15000)} available` },
  { icon: 'calendar', label: 'Newest first', to: '/vehicles?sort=year-desc', meta: 'Latest model years' },
];

const quickSearches = ['Honda', 'Toyota', 'Pilot', 'Accord'];

const promises = [
  { icon: 'shield', title: 'Inspected & documented', text: 'Every car is checked over and photographed inside and out before it’s listed.' },
  { icon: 'file', title: 'Upfront pricing', text: 'The price you see is the price. No surprise fees and no pressure.' },
  { icon: 'key', title: 'Many cars paid off', text: 'No lender payoff to wait on, so you can drive home sooner.' },
  { icon: 'handshake', title: 'Local & personal', text: 'Deal directly with the owner, from first question to handover.' },
];

function Stars({ size = 16 }) {
  return (
    <span className="stars" aria-label="5 out of 5 stars">
      {[0, 1, 2, 3, 4].map((i) => (
        <Icon key={i} name="star" size={size} filled strokeWidth={0} />
      ))}
    </span>
  );
}

function Home() {
  const reviewsRef = useRef(null);

  const scrollReviews = (dir) => {
    const el = reviewsRef.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: 'smooth' });
  };

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="container hero__inner">
          <span className="eyebrow rise">
            <Stars size={14} /> 5.0 from {reviews.length} customer reviews
          </span>
          <h1 className="h1 rise rise-2">
            Find a car you’ll love,
            <br />
            at a price that’s <span className="hero__hl">fair</span>.
          </h1>
          <p className="lead rise rise-3">
            Quality used and rebuilt cars in Raleigh, NC. Inspected, photographed in detail and priced upfront, with
            options for every budget.
          </p>

          <SearchSuggest className="hero__suggest rise rise-4" />

          <div className="hero__popular rise rise-4">
            <span>Popular:</span>
            {quickSearches.map((q) => (
              <Link key={q} to={`/vehicles?q=${q}`} className="hero__tag">
                {q}
              </Link>
            ))}
          </div>
        </div>

        <div className="container">
          <div className="showcase rise rise-4">
            {showcase.map((v, i) => (
              <Link key={v.id} to={`/vehicles/${v.id}`} className={`showcase__item showcase__item--${i}`}>
                <img src={v.photos[0]} alt={`${vehicleName(v)} ${v.trim}`} />
                <span className="showcase__tag">
                  <strong>{vehicleName(v)}</strong>
                  <span>{formatPrice(v.price)}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section--tight">
        <div className="container">
          <div className="cats">
            {categories.map((c) => (
              <Link key={c.label} to={c.to} className="cat">
                <span className="icon-tile">
                  <Icon name={c.icon} size={22} />
                </span>
                <span className="cat__text">
                  <strong>{c.label}</strong>
                  <span>{c.meta}</span>
                </span>
                <Icon name="chevronRight" size={20} className="cat__go" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured inventory */}
      <section className="section home-featured">
        <div className="container">
          <div className="section-head section-head--center">
            <div>
              <span className="eyebrow">Featured cars</span>
              <h2 className="h2">Ready for their next owner</h2>
            </div>
          </div>
          <div className="vgrid">
            {featured.map((v) => (
              <VehicleCard key={v.id} vehicle={v} />
            ))}
          </div>
          <div className="center-action">
            <Link to="/vehicles" className="btn btn--ghost btn--lg">
              See all {vehicles.length} cars <Icon name="arrowRight" size={18} className="icon-slide" />
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section section--blue">
        <div className="container">
          <div className="section-head section-head--center">
            <div>
              <span className="eyebrow">How it works</span>
              <h2 className="h2">Four easy steps to your next car</h2>
            </div>
          </div>
          <ol className="steps">
            {steps.map((s, i) => (
              <li key={s.title} className="step">
                <span className="step__num">{i + 1}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
          <div className="center-action">
            <Link to="/how-it-works" className="btn btn--light btn--lg">
              Learn more about buying <Icon name="arrowRight" size={18} className="icon-slide" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="section">
        <div className="container why">
          <div className="why__media">
            {whyCar && <img src={whyCar.photos[0]} alt={`${vehicleName(whyCar)} ${whyCar.trim}`} loading="lazy" />}
            <div className="why__badge">
              <span className="icon-tile">
                <Icon name="camera" size={20} />
              </span>
              <span>
                <strong>Full photo galleries</strong>
                <span className="muted">on most listings</span>
              </span>
            </div>
          </div>
          <div>
            <span className="eyebrow">Why Banky Auto</span>
            <h2 className="h2">Car buying that feels good</h2>
            <p className="lead why__lead">No pushy sales, no hidden fees. Just good cars and straight answers.</p>
            <ul className="why__list">
              {promises.map((p) => (
                <li key={p.title}>
                  <span className="icon-tile">
                    <Icon name={p.icon} size={22} />
                  </span>
                  <span>
                    <strong>{p.title}</strong>
                    <span className="muted">{p.text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Visit the lot */}
      <section className="section section--surface">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Visit the lot</span>
              <h2 className="h2">Come see them in person</h2>
              <p className="lead lot__lead">
                Every car we list is parked on our lot in Raleigh. Stop by, take a good look and bring your mechanic.
              </p>
            </div>
            <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="btn btn--accent">
              <Icon name="pin" size={18} /> Get directions
            </a>
          </div>
          <div className="lot">
            {[lotPhotos.frontRow, lotPhotos.acuraMaxima, lotPhotos.maximaAltima].map((p, i) => (
              <figure key={p.src} className={`lot__item lot__item--${i}`}>
                <img src={p.src} alt={p.alt} loading="lazy" />
                {i === 0 && (
                  <figcaption className="lot__tag">
                    <span className="icon-tile">
                      <Icon name="pin" size={18} />
                    </span>
                    <span>
                      <strong>{site.name}</strong>
                      <span>{fullAddress}</span>
                    </span>
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Customer reviews</span>
              <h2 className="h2">Our customers say it best</h2>
            </div>
            <div className="reviews__nav">
              <button type="button" className="round-btn" onClick={() => scrollReviews(-1)} aria-label="Previous reviews">
                <Icon name="chevronLeft" size={20} />
              </button>
              <button type="button" className="round-btn" onClick={() => scrollReviews(1)} aria-label="Next reviews">
                <Icon name="chevronRight" size={20} />
              </button>
            </div>
          </div>
          <div className="reviews" ref={reviewsRef} tabIndex={0} aria-label="Customer reviews">
            {reviews.map((r) => (
              <figure key={r.id || r.name} className="review">
                <Stars />
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
