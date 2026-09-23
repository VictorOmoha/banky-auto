import React, { useState } from 'react';
import Icon from '../components/Icon';
import { livePhotoUrl, rawPhotoUrl } from './utils';

// Shows a car photo from the live site, falling back to GitHub for photos
// saved since the last publish.
function AdminPhoto({ file, src, alt = '', className = '' }) {
  const [stage, setStage] = useState(0);
  if (!file && !src) {
    return (
      <span className={`admin-photo admin-photo--empty ${className}`}>
        <Icon name="camera" size={20} />
      </span>
    );
  }
  const url = src || (stage === 0 ? livePhotoUrl(file) : rawPhotoUrl(file));
  return (
    <img
      src={url}
      alt={alt}
      className={`admin-photo ${className}`}
      loading="lazy"
      onError={() => !src && stage === 0 && setStage(1)}
    />
  );
}

export default AdminPhoto;
