import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/Icon';
import AdminPhoto from '../AdminPhoto';
import { useAdmin } from '../AdminContext';
import { money, timeAgo } from '../utils';

function Dashboard() {
  const { content, user } = useAdmin();
  const cars = content.vehicles;
  const available = cars.filter((v) => v.status !== 'sold');
  const sold = cars.filter((v) => v.status === 'sold');
  const value = available.reduce((sum, v) => sum + (Number(v.price) || 0), 0);
  const avg = available.length ? value / available.length : 0;
  const noPhotos = available.filter((v) => !v.photos?.length);
  const recent = [...cars].sort((a, b) => String(b.updatedAt || '').localeCompare(String(a.updatedAt || ''))).slice(0, 5);

  const stats = [
    { label: 'Cars for sale', value: available.length, icon: 'car' },
    { label: 'Inventory value', value: money(value), icon: 'briefcase' },
    { label: 'Average price', value: money(avg), icon: 'gauge' },
    { label: 'Marked sold', value: sold.length, icon: 'check' },
  ];

  return (
    <div className="admin-page">
      <div className="admin-head">
        <div>
          <h1 className="admin-title">Welcome back{user?.name && user.name !== 'Owner' ? `, ${user.name.split(' ')[0]}` : ''}</h1>
          <p className="muted">Here’s what’s on your lot right now.</p>
        </div>
        <Link to="/admin/cars/new" className="btn btn--accent">
          <Icon name="car" size={18} /> Add a car
        </Link>
      </div>

      <div className="admin-stats">
        {stats.map((s) => (
          <div key={s.label} className="admin-stat card">
            <span className="icon-tile">
              <Icon name={s.icon} size={20} />
            </span>
            <span className="admin-stat__label">{s.label}</span>
            <strong className="admin-stat__value">{s.value}</strong>
          </div>
        ))}
      </div>

      {noPhotos.length > 0 && (
        <div className="admin-alert admin-alert--warn">
          <strong>
            {noPhotos.length} {noPhotos.length === 1 ? 'car has' : 'cars have'} no photos
          </strong>{' '}
          and won’t appear on the website until you add at least one.{' '}
          <Link to={`/admin/cars/${noPhotos[0].id}`}>Add photos</Link>
        </div>
      )}

      <div className="admin-grid-2">
        <section className="card admin-panel">
          <div className="admin-panel__head">
            <h2>Recently updated</h2>
            <Link to="/admin/cars" className="text-link">
              All cars <Icon name="arrowRight" size={14} />
            </Link>
          </div>
          {recent.length ? (
            <ul className="admin-mini-list">
              {recent.map((v) => (
                <li key={v.id}>
                  <Link to={`/admin/cars/${v.id}`}>
                    <AdminPhoto file={v.photos?.[0]} className="admin-mini-list__img" />
                    <span className="admin-mini-list__text">
                      <strong>
                        {v.year} {v.make} {v.model}
                      </strong>
                      <span className="muted">
                        {money(v.price)} · updated {timeAgo(v.updatedAt)}
                      </span>
                    </span>
                    {v.status === 'sold' ? <span className="chip chip--sold">Sold</span> : v.featured ? <span className="chip chip--blue">Featured</span> : null}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">No cars yet.</p>
          )}
        </section>

        <section className="card admin-panel">
          <div className="admin-panel__head">
            <h2>Quick actions</h2>
          </div>
          <div className="admin-actions">
            <Link to="/admin/cars/new" className="admin-action">
              <span className="icon-tile">
                <Icon name="car" size={20} />
              </span>
              <span>
                <strong>Add a car</strong>
                <span className="muted">Details, price and photos</span>
              </span>
            </Link>
            <Link to="/admin/cars" className="admin-action">
              <span className="icon-tile">
                <Icon name="check" size={20} />
              </span>
              <span>
                <strong>Mark a car sold</strong>
                <span className="muted">Hides it from the website</span>
              </span>
            </Link>
            <Link to="/admin/business" className="admin-action">
              <span className="icon-tile">
                <Icon name="phone" size={20} />
              </span>
              <span>
                <strong>Update business info</strong>
                <span className="muted">Phone, email, address, hours</span>
              </span>
            </Link>
            <Link to="/admin/reviews" className="admin-action">
              <span className="icon-tile">
                <Icon name="star" size={20} />
              </span>
              <span>
                <strong>Manage reviews</strong>
                <span className="muted">{content.reviews.length} on the home page</span>
              </span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
