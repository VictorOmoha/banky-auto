import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import Icon from './Icon';
import { ContactLink } from './ContactSheet';
import Logo from './Logo';
import { site } from '../data/site';
import './Navbar.css';

const links = [
  { to: '/vehicles', label: 'Inventory' },
  { to: '/how-it-works', label: 'How it works' },
  { to: '/about', label: 'About' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contact', label: 'Contact' },
];

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''} ${open ? 'nav--open' : ''}`}>
      <div className="container nav__inner">
        <Link to="/" className="nav__brand" aria-label={`${site.name} home`}>
          <Logo />
        </Link>

        <nav className="nav__links" aria-label="Main">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className="nav__link">
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="nav__actions">
          <ContactLink type="call" className="nav__phone">
            <Icon name="phone" size={16} />
            <span>{site.phone}</span>
          </ContactLink>
          <Link to="/vehicles" className="btn btn--accent nav__cta">
            Shop cars
          </Link>
          <button
            type="button"
            className="nav__toggle"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <Icon name={open ? 'close' : 'menu'} size={22} />
          </button>
        </div>
      </div>

      <div id="mobile-menu" className="nav__sheet" hidden={!open}>
        <nav className="container nav__sheet-links" aria-label="Mobile">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className="nav__sheet-link">
              {l.label}
              <Icon name="arrowRight" size={20} />
            </NavLink>
          ))}
          <div className="nav__sheet-actions">
            <Link to="/vehicles" className="btn btn--accent btn--lg btn--block">
              Shop all cars
            </Link>
            <ContactLink type="call" className="btn btn--ghost btn--lg btn--block">
              <Icon name="phone" size={18} /> Call {site.phone}
            </ContactLink>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
