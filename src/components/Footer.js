import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import Icon from './Icon';
import { ContactLink } from './ContactSheet';
import { site, fullAddress, mapsUrl } from '../data/site';
import './Footer.css';

const columns = [
  {
    title: 'Shop',
    links: [
      { to: '/vehicles', label: 'All inventory' },
      { to: '/vehicles?body=Sedan', label: 'Sedans' },
      { to: '/vehicles?body=SUV', label: 'SUVs' },
      { to: '/how-it-works', label: 'How it works' },
    ],
  },
  {
    title: 'Company',
    links: [
      { to: '/about', label: 'About us' },
      { to: '/careers', label: 'Careers' },
      { to: '/contact', label: 'Contact' },
    ],
  },
  {
    title: 'Support',
    links: [
      { to: '/faq', label: 'FAQ' },
      { to: '/help', label: 'Help center' },
      { to: '/faq#title-status', label: 'Title status explained' },
    ],
  },
];

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <Logo />
            <p>{site.tagline} Every car is inspected, photographed in detail and priced upfront.</p>
            <div className="footer__contact">
              <ContactLink type="call">
                <Icon name="phone" size={16} /> {site.phone}
              </ContactLink>
              <ContactLink type="email">
                <Icon name="mail" size={16} /> {site.email}
              </ContactLink>
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
                <Icon name="pin" size={16} /> {fullAddress}
              </a>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title} className="footer__col">
              <h3>{col.title}</h3>
              <ul>
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer__bottom">
          <p>
            © {year} {site.legalName}. All rights reserved.
          </p>
          <ul className="footer__social">
            {site.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
