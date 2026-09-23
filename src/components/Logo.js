import React from 'react';

function Logo({ light = false }) {
  return (
    <span className={`logo ${light ? 'logo--light' : ''}`}>
      <svg className="logo__mark" width="34" height="34" viewBox="0 0 34 34" aria-hidden="true">
        <rect width="34" height="34" rx="10" fill="var(--accent)" />
        <text x="17" y="23.5" textAnchor="middle" style={{ fontFamily: 'var(--font)' }} fontWeight="800" fontSize="19" fill="#fff">
          B
        </text>
      </svg>
      <span className="logo__word">
        Banky<span>Auto</span>
      </span>
    </span>
  );
}

export default Logo;
