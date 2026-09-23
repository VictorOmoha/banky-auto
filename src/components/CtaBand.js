import React from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon';
import { site } from '../data/site';
import './CtaBand.css';

function CtaBand({
  title = 'Found one you like? Come see it in person.',
  text = 'Book a visit or test drive. We’ll have the car ready, and the paperwork too.',
}) {
  return (
    <section className="section--tight">
      <div className="container">
        <div className="cta-band">
          <div>
            <h2 className="h2">{title}</h2>
            <p className="lead">{text}</p>
          </div>
          <div className="cta-band__actions">
            <Link to="/vehicles" className="btn btn--accent btn--lg">
              Browse inventory <Icon name="arrowRight" size={18} className="icon-slide" />
            </Link>
            <a href={site.phoneHref} className="btn btn--outline-light btn--lg">
              <Icon name="phone" size={18} /> {site.phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CtaBand;
