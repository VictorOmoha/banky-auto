import React, { useEffect, useState } from 'react';
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import Icon from '../components/Icon';
import Logo from '../components/Logo';
import { AdminProvider, useAdmin } from './AdminContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Cars from './pages/Cars';
import CarEditor from './pages/CarEditor';
import Business from './pages/Business';
import Reviews from './pages/Reviews';
import './admin.css';

const nav = [
  { to: '/admin', label: 'Dashboard', icon: 'gauge', end: true },
  { to: '/admin/cars', label: 'Cars', icon: 'car' },
  { to: '/admin/business', label: 'Business info', icon: 'briefcase' },
  { to: '/admin/reviews', label: 'Reviews', icon: 'star' },
];

function PublishBanner() {
  const { deploy } = useAdmin();
  if (!deploy) return null;
  const text = {
    queued: ['Saved. Publishing to your live site…', 'Usually takes 1–3 minutes.'],
    publishing: ['Saved. Publishing to your live site…', 'Usually takes 1–3 minutes.'],
    success: ['Published! Your changes are live.', 'Refresh the live site to see them.'],
    failure: ['Saved, but publishing failed.', 'Your change is safe on GitHub. Open the build log to see why.'],
    unknown: ['Saved.', 'Your live site updates automatically in a few minutes.'],
  }[deploy.state];
  const busy = deploy.state === 'queued' || deploy.state === 'publishing';
  return (
    <div className={`publish publish--${deploy.state}`} role="status">
      <span className={`publish__dot ${busy ? 'is-busy' : ''}`} aria-hidden="true">
        <Icon name={deploy.state === 'failure' ? 'close' : busy ? 'clock' : 'check'} size={16} strokeWidth={2.4} />
      </span>
      <span>
        <strong>{text[0]}</strong> {text[1]}
      </span>
      {deploy.url && (
        <a href={deploy.url} target="_blank" rel="noopener noreferrer" className="publish__link">
          Details <Icon name="external" size={14} />
        </a>
      )}
    </div>
  );
}

function Shell() {
  const { phase, error, user, signOut, reload } = useAdmin();
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    document.title = 'Admin · Banky Auto';
    const robots = document.createElement('meta');
    robots.name = 'robots';
    robots.content = 'noindex';
    document.head.appendChild(robots);
    return () => {
      document.head.removeChild(robots);
      document.title = 'Banky Auto · Quality used cars in Raleigh, NC';
    };
  }, []);

  if (phase === 'checking') {
    return (
      <div className="admin-center">
        <span className="admin-spinner" aria-label="Loading" />
      </div>
    );
  }

  if (phase === 'signed-out') return <Login />;

  return (
    <div className={`admin ${menuOpen ? 'admin--menu' : ''}`}>
      <aside className="admin__side">
        <div className="admin__brand">
          <Link to="/admin" aria-label="Admin dashboard">
            <Logo />
          </Link>
          <span className="admin__tag">Admin</span>
        </div>
        <nav className="admin__nav" aria-label="Admin">
          {nav.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className="admin__link">
              <Icon name={n.icon} size={18} /> {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="admin__side-foot">
          <a href={`${process.env.PUBLIC_URL}/`} target="_blank" rel="noopener noreferrer" className="admin__link">
            <Icon name="external" size={18} /> View live site
          </a>
          {user && (
            <div className="admin__user">
              <img src={user.avatar} alt="" />
              <span>
                <strong>{user.name}</strong>
                <span>@{user.login}</span>
              </span>
            </div>
          )}
          <button type="button" className="btn btn--ghost btn--block" onClick={signOut}>
            Sign out
          </button>
        </div>
      </aside>

      <div className="admin__main">
        <header className="admin__top">
          <button
            type="button"
            className="admin__menu-btn"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <Icon name={menuOpen ? 'close' : 'menu'} size={22} />
          </button>
          <Link to="/admin" className="admin__top-brand">
            <Logo /> <span className="admin__tag">Admin</span>
          </Link>
        </header>

        <PublishBanner />

        {phase === 'loading' && (
          <div className="admin-center admin-center--page">
            <span className="admin-spinner" aria-label="Loading" />
            <p className="muted">Loading your site content from GitHub…</p>
          </div>
        )}
        {phase === 'error' && (
          <div className="admin-page">
            <div className="admin-alert">
              <strong>Couldn’t load your content.</strong> {error}
              <div className="admin-alert__actions">
                <button type="button" className="btn btn--accent" onClick={reload}>
                  Try again
                </button>
                <button type="button" className="btn btn--ghost" onClick={signOut}>
                  Use a different token
                </button>
              </div>
            </div>
          </div>
        )}
        {phase === 'ready' && (
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="cars" element={<Cars />} />
            <Route path="cars/new" element={<CarEditor />} />
            <Route path="cars/:id" element={<CarEditor />} />
            <Route path="business" element={<Business />} />
            <Route path="reviews" element={<Reviews />} />
            <Route
              path="*"
              element={
                <div className="admin-page">
                  <p>
                    Page not found. <Link to="/admin">Back to dashboard</Link>
                  </p>
                </div>
              }
            />
          </Routes>
        )}
      </div>
    </div>
  );
}

function AdminApp() {
  return (
    <AdminProvider>
      <Shell />
    </AdminProvider>
  );
}

export default AdminApp;
