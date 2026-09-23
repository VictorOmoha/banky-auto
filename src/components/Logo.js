import React from 'react';

function Logo({ light = false }) {
  return (
    <span className={`logo ${light ? 'logo--light' : ''}`}>
      <svg className="logo__mark" width="36" height="36" viewBox="0 0 36 36" aria-hidden="true">
        <defs>
          <linearGradient id="logo-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#5ec2ff" />
            <stop offset="1" stopColor="#1f5eff" />
          </linearGradient>
        </defs>
        <rect width="36" height="36" rx="12" fill="url(#logo-grad)" />
        <path
          d="M8 22.5c0-1.2.8-2.2 2-2.5l2.2-.6 2.6-3.6c.6-.8 1.5-1.3 2.5-1.3h3.6c1 0 1.9.5 2.5 1.2l2.7 3.7 1.6.5c1.2.4 2.1 1.4 2.1 2.7V24a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-1.5Z"
          fill="#fff"
        />
        <circle cx="13" cy="25" r="2.6" fill="#1f5eff" stroke="#fff" strokeWidth="1.6" />
        <circle cx="23" cy="25" r="2.6" fill="#1f5eff" stroke="#fff" strokeWidth="1.6" />
      </svg>
      <span className="logo__word">
        Banky<span>Auto</span>
      </span>
    </span>
  );
}

export default Logo;
