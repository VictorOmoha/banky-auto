import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/Icon';
import AdminPhoto from '../AdminPhoto';
import { useAdmin } from '../AdminContext';
import { money, timeAgo } from '../utils';

const filters = [
  { key: 'all', label: 'All' },
  { key: 'available', label: 'For sale' },
  { key: 'sold', label: 'Sold' },
];

function Cars() {
  const { content, save } = useAdmin();
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('all');
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState('');

  const cars = useMemo(() => {
    const term = q.trim().toLowerCase();
    return content.vehicles.filter((v) => {
      const status = v.status === 'sold' ? 'sold' : 'available';
      if (filter !== 'all' && status !== filter) return false;
      if (!term) return true;
      return `${v.year} ${v.make} ${v.model} ${v.trim} ${v.vin || ''} ${v.exteriorColor}`.toLowerCase().includes(term);
    });
  }, [content.vehicles, q, filter]);

  const quickUpdate = async (car, patch, message) => {
    setBusyId(car.id);
    setError('');
    try {
      await save({
        key: 'vehicles',
        message,
        mutate: (list) =>
          list.map((v) => (v.id === car.id ? { ...v, ...patch, updatedAt: new Date().toISOString() } : v)),
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const name = (v) => `${v.year} ${v.make} ${v.model}`;

  return (
    <div className="admin-page">
      <div className="admin-head">
        <div>
          <h1 className="admin-title">Cars</h1>
          <p className="muted">
            {content.vehicles.filter((v) => v.status !== 'sold').length} for sale ·{' '}
            {content.vehicles.filter((v) => v.status === 'sold').length} sold
          </p>
        </div>
        <Link to="/admin/cars/new" className="btn btn--accent">
          <Icon name="car" size={18} /> Add a car
        </Link>
      </div>

      <div className="admin-toolbar">
        <div className="admin-search">
          <Icon name="search" size={18} />
          <label htmlFor="car-search" className="sr-only">
            Search cars
          </label>
          <input
            id="car-search"
            className="input"
            placeholder="Search by make, model, year or VIN"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="segmented" role="group" aria-label="Filter by status">
          {filters.map((f) => (
            <button key={f.key} type="button" aria-pressed={filter === f.key} onClick={() => setFilter(f.key)}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="admin-alert">{error}</div>}

      {cars.length ? (
        <ul className="admin-cars">
          {cars.map((v) => {
            const sold = v.status === 'sold';
            const busy = busyId === v.id;
            return (
              <li key={v.id} className={`admin-car card ${sold ? 'is-sold' : ''}`}>
                <Link to={`/admin/cars/${v.id}`} className="admin-car__main">
                  <AdminPhoto file={v.photos?.[0]} className="admin-car__img" alt="" />
                  <span className="admin-car__text">
                    <strong>
                      {name(v)} <span className="muted">{v.trim}</span>
                    </strong>
                    <span className="admin-car__meta">
                      <span className="admin-car__price">{money(v.price)}</span>
                      <span>{Number(v.mileage || 0).toLocaleString()} mi</span>
                      <span>
                        {v.photos?.length || 0} {v.photos?.length === 1 ? 'photo' : 'photos'}
                      </span>
                      <span>Updated {timeAgo(v.updatedAt)}</span>
                    </span>
                    <span className="admin-car__chips">
                      {sold ? <span className="chip chip--sold">Sold</span> : <span className="chip chip--good">For sale</span>}
                      {!v.photos?.length && <span className="chip chip--warn">No photos · hidden</span>}
                    </span>
                  </span>
                </Link>
                <div className="admin-car__actions">
                  <button
                    type="button"
                    className="btn btn--ghost"
                    disabled={busy}
                    onClick={() =>
                      quickUpdate(v, { status: sold ? 'available' : 'sold' }, `${sold ? 'Relist' : 'Mark sold'}: ${name(v)}`)
                    }
                  >
                    {busy ? 'Saving…' : sold ? 'Relist' : 'Mark sold'}
                  </button>
                  {!sold && (
                    <button
                      type="button"
                      className="btn btn--ghost"
                      disabled={busy}
                      aria-pressed={!!v.featured}
                      onClick={() =>
                        quickUpdate(v, { featured: !v.featured }, `${v.featured ? 'Unfeature' : 'Feature'}: ${name(v)}`)
                      }
                    >
                      <Icon name="star" size={16} filled={!!v.featured} strokeWidth={v.featured ? 0 : 1.75} />
                      {v.featured ? 'Featured' : 'Feature'}
                    </button>
                  )}
                  <Link to={`/admin/cars/${v.id}`} className="btn btn--soft">
                    Edit
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="card admin-empty">
          <p>{content.vehicles.length ? 'No cars match your search.' : 'No cars yet. Add your first one.'}</p>
        </div>
      )}
    </div>
  );
}

export default Cars;
