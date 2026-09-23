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
        <div className="vcard__badges">
          {vehicle.titleStatus && <span className="chip chip--glass">{vehicle.titleStatus} title</span>}
          {vehicle.photos.length > 1 && (
            <span className="chip chip--glass">
              <Icon name="camera" size={14} /> {vehicle.photos.length}
            </span>
          )}
        </div>
      </div>
      <div className="vcard__body">
        <div className="vcard__title">
          <h3>{name}</h3>
          <p>
            {vehicle.trim} · {vehicle.body}
          </p>
        </div>
        <ul className="vcard__specs">
          <li>
            <Icon name="gauge" size={16} /> {formatMiles(vehicle.mileage)}
          </li>
          <li>
            <Icon name="cog" size={16} /> {vehicle.transmission}
          </li>
          {vehicle.drivetrain && (
            <li>
              <Icon name="car" size={16} /> {vehicle.drivetrain}
            </li>
          )}
        </ul>
        <div className="vcard__foot">
          <span className="vcard__price">{formatPrice(vehicle.price)}</span>
          <span className="vcard__go" aria-hidden="true">
            <Icon name="arrowRight" size={18} />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default VehicleCard;
