import React, { useState } from 'react';
import Icon from './Icon';
import { site, fullAddress, mapsUrl, mapEmbedUrl, directionsUrl } from '../data/site';
import './LocationMap.css';

// Hosts that frame the site (previews, sandboxes) often block third-party
// map embeds, which leaves a broken box. Only embed the live map when the
// site is the top-level page; otherwise show a self-contained map card.
const isFramed = () => {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
};

function LocationMap() {
  const [embed] = useState(() => !isFramed());

  return (
    <div className={`locmap card ${embed ? 'locmap--live' : 'locmap--static'}`}>
      {embed ? (
        <iframe title={`Map showing ${site.legalName}`} src={mapEmbedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      ) : (
        <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="locmap__art" aria-label={`Open ${fullAddress} in Google Maps`}>
          <span className="locmap__road locmap__road--a" />
          <span className="locmap__road locmap__road--b" />
          <span className="locmap__road locmap__road--c" />
          <span className="locmap__park" />
          <span className="locmap__pin">
            <span className="locmap__pulse" />
            <Icon name="pin" size={28} strokeWidth={2} />
          </span>
        </a>
      )}

      <div className="locmap__info">
        <span className="icon-tile">
          <Icon name="pin" size={20} />
        </span>
        <div className="locmap__text">
          <strong>{site.legalName}</strong>
          <span>{fullAddress}</span>
        </div>
        <div className="locmap__actions">
          <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="btn btn--accent">
            <Icon name="car" size={16} /> Get directions
          </a>
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn--ghost">
            <Icon name="external" size={16} /> Open in Google Maps
          </a>
        </div>
      </div>
    </div>
  );
}

export default LocationMap;
