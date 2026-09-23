import content from '../content/site.json';

// Business details live in src/content/site.json, which the admin portal edits.
// Turns "+1 (919) 123-4567" into "tel:+19191234567".
export const toTelHref = (phone) => {
  const digits = String(phone).replace(/[^\d+]/g, '');
  return `tel:${digits.startsWith('+') ? digits : `+1${digits}`}`;
};

export const site = { ...content, phoneHref: toTelHref(content.phone) };

export const fullAddress = `${site.address.line1}, ${site.address.city}, ${site.address.region} ${site.address.zip}`;

export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;

export const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddress)}`;

// Map embed located by address, so the pin follows any address change.
export const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(fullAddress)}&z=15&output=embed`;

const query = (params) =>
  Object.entries(params)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&');

export function mailto(to, subject = '', body = '') {
  const q = query({ subject, body });
  return `mailto:${to}${q ? `?${q}` : ''}`;
}

// Web-mail compose links work even when the visitor has no email app set up.
export const gmailUrl = (to, subject = '', body = '') =>
  `https://mail.google.com/mail/?${query({ view: 'cm', fs: '1', to, su: subject, body })}`;

export const outlookUrl = (to, subject = '', body = '') =>
  `https://outlook.live.com/mail/0/deeplink/compose?${query({ to, subject, body })}`;
