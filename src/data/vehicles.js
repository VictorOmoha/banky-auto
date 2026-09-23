import content from '../content/vehicles.json';

// Inventory lives in src/content/vehicles.json, which the admin portal edits.
// Photos are file names inside public/cars/.
export const photoUrl = (file) => (/^(https?:|data:|blob:)/.test(file) ? file : `${process.env.PUBLIC_URL}/cars/${file}`);

export const allVehicles = content.map((v) => ({ ...v, photos: (v.photos || []).map(photoUrl) }));

// Sold cars are hidden from listings but their pages still load (marked sold).
export const vehicles = allVehicles.filter((v) => v.status !== 'sold' && v.photos.length > 0);

// Prefer the named cars, then fill any gaps with other listed cars, so pages
// keep working when the owner sells or removes one.
export const pickVehicles = (ids, count = ids.length) => {
  const picked = ids.map((id) => vehicles.find((v) => v.id === id)).filter(Boolean);
  const rest = vehicles.filter((v) => !picked.includes(v));
  return [...picked, ...rest].slice(0, count);
};

export const vehicleName = (v) => `${v.year} ${v.make} ${v.model}`;

export const formatPrice = (n) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

export const formatMiles = (n) => `${n.toLocaleString('en-US')} mi`;

export const getVehicle = (id) => allVehicles.find((v) => v.id === id);

export const matchesQuery = (v, query) => {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const text = `${v.year} ${v.make} ${v.model} ${v.trim} ${v.body} ${v.exteriorColor}`.toLowerCase();
  // Tolerate simple plurals, so "suvs" or "hondas" still match.
  return q.split(/\s+/).every((word) => text.includes(word) || (word.length > 3 && word.endsWith('s') && text.includes(word.slice(0, -1))));
};
