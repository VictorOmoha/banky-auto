import React, { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Icon from '../components/Icon';
import Modal from '../components/Modal';
import VehicleCard from '../components/VehicleCard';
import NotFound from './NotFound';
import { getVehicle, vehicles, vehicleName, formatPrice, formatMiles } from '../data/vehicles';
import { ContactLink, useContact } from '../components/ContactSheet';
import { site } from '../data/site';
import './VehicleDetail.css';

const emptyForm = { name: '', email: '', phone: '', date: '', time: '', comments: '' };

function Gallery({ photos, name }) {
  const [index, setIndex] = useState(0);
  const count = photos.length;
  const go = useCallback((delta) => setIndex((i) => (i + delta + count) % count), [count]);

  useEffect(() => setIndex(0), [photos]);

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') go(1);
    if (e.key === 'ArrowLeft') go(-1);
  };

  return (
    <div className="gallery">
      <div
        className="gallery__stage"
        tabIndex={count > 1 ? 0 : -1}
        onKeyDown={onKeyDown}
        aria-roledescription="carousel"
        aria-label={`${name} photos`}
      >
        <img src={photos[index]} alt={`${name}, view ${index + 1} of ${count}`} />
        {count > 1 && (
          <>
            <button type="button" className="gallery__nav gallery__nav--prev" onClick={() => go(-1)} aria-label="Previous photo">
              <Icon name="chevronLeft" size={22} />
            </button>
            <button type="button" className="gallery__nav gallery__nav--next" onClick={() => go(1)} aria-label="Next photo">
              <Icon name="chevronRight" size={22} />
            </button>
            <span className="chip chip--glass gallery__count" aria-live="polite">
              <Icon name="camera" size={14} /> {index + 1} / {count}
            </span>
          </>
        )}
      </div>
      {count > 1 && (
        <div className="gallery__thumbs" role="list">
          {photos.map((src, i) => (
            <button
              key={src}
              type="button"
              role="listitem"
              className={`gallery__thumb ${i === index ? 'is-active' : ''}`}
              onClick={() => setIndex(i)}
              aria-label={`Show photo ${i + 1}`}
              aria-current={i === index}
            >
              <img src={src} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function VehicleDetail() {
  const { id } = useParams();
  const vehicle = getVehicle(id);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const closeModal = useCallback(() => setModalOpen(false), []);
  const openContact = useContact();

  useEffect(() => {
    if (vehicle) document.title = `${vehicleName(vehicle)} ${vehicle.trim} · ${site.name}`;
    return () => {
      document.title = `${site.name} · Quality used cars in Raleigh, NC`;
    };
  }, [vehicle]);

  if (!vehicle) return <NotFound title="We couldn’t find that car" text="It may have sold already. Take a look at what’s available now." />;

  const name = vehicleName(vehicle);
  const fullName = `${name} ${vehicle.trim}`;
  const related = vehicles.filter((v) => v.id !== vehicle.id).sort((a, b) => (b.body === vehicle.body) - (a.body === vehicle.body)).slice(0, 3);

  const specs = [
    ['Year', vehicle.year],
    ['Make', vehicle.make],
    ['Model', vehicle.model],
    ['Trim', vehicle.trim],
    ['Body style', vehicle.body],
    ['Mileage', formatMiles(vehicle.mileage)],
    ['Transmission', vehicle.transmission],
    ['Drivetrain', vehicle.drivetrain],
    ['Fuel', vehicle.fuelType],
    ['Exterior', vehicle.exteriorColor],
    ['Interior', vehicle.interiorColor],
    ['Title', vehicle.titleStatus],
    ['Safety', vehicle.safetyRating],
    ['VIN', vehicle.vin],
  ].filter(([, value]) => value);


  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    const body = [
      `Test drive request: ${fullName} (${formatPrice(vehicle.price)})`,
      '',
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      `Phone: ${form.phone}`,
      `Preferred date: ${form.date}`,
      `Preferred time: ${form.time}`,
      ...(form.comments ? ['', 'Comments:', form.comments] : []),
    ].join('\n');
    setModalOpen(false);
    openContact('email', {
      title: 'Send your test drive request',
      intro: 'Your request is ready. Send it with any option below and we’ll confirm your time by phone or email.',
      to: site.salesEmail,
      subject: `Test drive request: ${fullName}`,
      body,
    });
  };

  const openModal = () => setModalOpen(true);

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="vdetail">
      <div className="container">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link to="/vehicles">
            <Icon name="arrowLeft" size={16} /> All inventory
          </Link>
        </nav>

        <div className="vdetail__grid">
          <div className="vdetail__media">
            <Gallery photos={vehicle.photos} name={fullName} />
          </div>

          <aside className="vdetail__panel">
            <div className="buybox card">
              <div className="buybox__tags">
                <span className="chip">{vehicle.body}</span>
                {vehicle.titleStatus && <span className="chip chip--warn">{vehicle.titleStatus} title</span>}
              </div>
              <h1 className="buybox__title">{name}</h1>
              <p className="buybox__trim">{vehicle.trim}</p>
              <p className="buybox__price">{formatPrice(vehicle.price)}</p>

              <ul className="buybox__facts">
                <li>
                  <Icon name="gauge" size={18} />
                  <span>
                    <strong>{vehicle.mileage.toLocaleString()}</strong> miles
                  </span>
                </li>
                <li>
                  <Icon name="cog" size={18} />
                  <span>{vehicle.transmission}</span>
                </li>
                <li>
                  <Icon name="fuel" size={18} />
                  <span>{vehicle.fuelType}</span>
                </li>
                <li>
                  <Icon name="palette" size={18} />
                  <span>{vehicle.exteriorColor}</span>
                </li>
              </ul>

              <div className="buybox__actions">
                <button type="button" className="btn btn--accent btn--lg btn--block" onClick={openModal}>
                  <Icon name="calendar" size={18} /> Schedule a test drive
                </button>
                <div className="buybox__row">
                  <ContactLink type="call" className="btn btn--ghost btn--block">
                    <Icon name="phone" size={16} /> Call
                  </ContactLink>
                  <ContactLink
                    type="email"
                    email={site.salesEmail}
                    subject={`Question about the ${fullName}`}
                    body={`Hi, I'm interested in the ${fullName} listed at ${formatPrice(vehicle.price)}.\n\n`}
                    className="btn btn--ghost btn--block"
                  >
                    <Icon name="mail" size={16} /> Email
                  </ContactLink>
                </div>
              </div>

              <ul className="buybox__assure">
                <li>
                  <Icon name="check" size={16} /> Inspection welcome, so bring your mechanic
                </li>
                <li>
                  <Icon name="check" size={16} /> Detailed photos &amp; honest description
                </li>
              </ul>
            </div>
          </aside>
        </div>

        <div className="vdetail__info">
          <section className="vdetail__section">
            <h2 className="h3">Overview</h2>
            <p className="lead">{vehicle.description}</p>
            {vehicle.highlights?.length > 0 && (
              <ul className="highlights">
                {vehicle.highlights.map((h) => (
                  <li key={h}>
                    <span className="highlights__dot">
                      <Icon name="check" size={14} strokeWidth={2.5} />
                    </span>
                    {h}
                  </li>
                ))}
              </ul>
            )}
          </section>

          {vehicle.damageHistory && (
            <section className="vdetail__section">
              <div className="disclosure">
                <Icon name="shield" size={22} />
                <div>
                  <h3>Damage history disclosure</h3>
                  <p>
                    {vehicle.damageHistory}. This vehicle carries a {vehicle.titleStatus?.toLowerCase()} title.{' '}
                    <Link to="/faq#title-status">What does that mean?</Link>
                  </p>
                </div>
              </div>
            </section>
          )}

          <section className="vdetail__section">
            <h2 className="h3">Specifications</h2>
            <dl className="specs">
              {specs.map(([label, value]) => (
                <div key={label} className="specs__row">
                  <dt>{label}</dt>
                  <dd className={label === 'VIN' ? 'specs__mono' : ''}>{value}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </div>

      <section className="section section--surface vdetail__related">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Keep looking</span>
              <h2 className="h2">You might also like</h2>
            </div>
            <Link to="/vehicles" className="text-link">
              See all inventory <Icon name="arrowRight" size={16} />
            </Link>
          </div>
          <div className="vgrid">
            {related.map((v) => (
              <VehicleCard key={v.id} vehicle={v} />
            ))}
          </div>
        </div>
      </section>

      <Modal open={modalOpen} onClose={closeModal} title="Schedule a test drive">
          <form className="form-grid" onSubmit={onSubmit}>
            <p className="span-2 muted">
              {fullName} · {formatPrice(vehicle.price)}
            </p>
            <div className="field span-2">
              <label htmlFor="td-name">Full name</label>
              <input id="td-name" name="name" className="input" autoComplete="name" required value={form.name} onChange={onChange} />
            </div>
            <div className="field">
              <label htmlFor="td-email">Email</label>
              <input id="td-email" name="email" type="email" className="input" autoComplete="email" required value={form.email} onChange={onChange} />
            </div>
            <div className="field">
              <label htmlFor="td-phone">Phone</label>
              <input id="td-phone" name="phone" type="tel" className="input" autoComplete="tel" required value={form.phone} onChange={onChange} />
            </div>
            <div className="field">
              <label htmlFor="td-date">Preferred date</label>
              <input id="td-date" name="date" type="date" min={today} className="input" required value={form.date} onChange={onChange} />
            </div>
            <div className="field">
              <label htmlFor="td-time">Preferred time</label>
              <input id="td-time" name="time" type="time" min="09:00" max="18:00" className="input" required value={form.time} onChange={onChange} />
            </div>
            <div className="field span-2">
              <label htmlFor="td-comments">
                Comments <span className="hint">(optional)</span>
              </label>
              <textarea id="td-comments" name="comments" rows="3" className="textarea" value={form.comments} onChange={onChange} />
            </div>
            <div className="span-2">
              <button type="submit" className="btn btn--accent btn--lg btn--block">
                Send request
              </button>
              <p className="form-note muted">Next, you’ll choose how to send it: Gmail, Outlook, your email app, or copy it.</p>
            </div>
          </form>
      </Modal>
    </div>
  );
}

export default VehicleDetail;
