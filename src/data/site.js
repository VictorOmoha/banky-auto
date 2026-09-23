// Business details shared across the site. Update these in one place.
export const site = {
  name: 'Banky Auto',
  legalName: 'Banky Auto Sales Inc',
  tagline: 'Honest cars. Fair prices. Raleigh, NC.',
  phone: '+1 (919) 123-4567',
  phoneHref: 'tel:+19191234567',
  email: 'info@bankyauto.com',
  salesEmail: 'sales@bankyauto.com',
  careersEmail: 'info@bankyauto.com',
  address: {
    line1: '301 Circle Ln',
    city: 'Raleigh',
    region: 'NC',
    zip: '27603',
  },
  hours: [
    { days: 'Mon – Sat', time: '9:00 AM – 6:00 PM' },
    { days: 'Sunday', time: 'Closed' },
  ],
  founded: 2020,
  socials: [
    { label: 'Instagram', href: 'https://instagram.com/bankyauto' },
    { label: 'Facebook', href: 'https://facebook.com/bankyauto' },
    { label: 'X / Twitter', href: 'https://twitter.com/bankyauto' },
  ],
};

export const fullAddress = `${site.address.line1}, ${site.address.city}, ${site.address.region} ${site.address.zip}`;

export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;

// Map embed located by address, so the pin follows any address change.
export const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(fullAddress)}&z=15&output=embed`;

// Opens the visitor's email app with a pre-filled message. The site has no
// backend, so forms hand off to email instead of pretending to submit.
export function mailto(to, subject, body) {
  const params = new URLSearchParams({ subject, body });
  return `mailto:${to}?${params.toString().replace(/\+/g, '%20')}`;
}
