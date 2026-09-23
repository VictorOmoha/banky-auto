import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import './Pages.css';

function NotFound({ title = 'This page took a wrong turn', text = 'The page you’re looking for doesn’t exist or has moved.' }) {
  return (
    <section className="section">
      <div className="container notfound">
        <span className="notfound__code">404</span>
        <h1 className="h2">{title}</h1>
        <p className="lead">{text}</p>
        <div className="notfound__actions">
          <Link to="/vehicles" className="btn btn--accent btn--lg">
            Browse inventory <Icon name="arrowRight" size={18} className="icon-slide" />
          </Link>
          <Link to="/" className="btn btn--ghost btn--lg">
            Back to home
          </Link>
        </div>
      </div>
    </section>
  );
}

export default NotFound;
