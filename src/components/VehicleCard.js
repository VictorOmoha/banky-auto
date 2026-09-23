import React from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon';
import { formatMiles, formatPrice, vehicleName } from '../data/vehicles';
import './VehicleCard.css';

function VehicleCard({ vehicle, layout = 'grid' }) {
  const name = vehicleName(vehicle);

  return (
    <Link to={`/vehicles/${vehicle.id}`} className={`vcard vcard--${layout}`}>
      <div className="vcard__media">
        <img src={vehicle.photos[0]} alt={`${name} ${vehicle.trim}`} loading="lazy" />
        {vehicle.titleStatus && <span className="chip chip--glass vcard__flag">{vehicle.titleStatus} title</span>}
        {vehicle.photos.length > 1 && (
          <span className="chip chip--glass vcard__photos">
            <Icon name="camera" size={14} /> {vehicle.photos.length}
          </span>
        )}
      </div>
      <div className="vcard__body">
        <div>
          <h3 className="vcard__name">{name}</h3>
          <p className="vcard__trim">
            {vehicle.trim} · {vehicle.exteriorColor}
          </p>
        </div>
        <ul className="vcard__specs">
          <li>{formatMiles(vehicle.mileage)}</li>
          <li>{vehicle.body}</li>
          {vehicle.drivetrain && <li>{vehicle.drivetrain}</li>}
        </ul>
        <div className="vcard__foot">
          <span className="vcard__price">{formatPrice(vehicle.price)}</span>
          <span className="vcard__cta">
            View car <Icon name="arrowRight" size={16} />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default VehicleCard;
