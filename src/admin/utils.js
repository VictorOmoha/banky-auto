import { repo, paths } from './config';

export const slugify = (text) =>
  String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const uniqueId = (base, taken) => {
  const root = slugify(base) || 'car';
  let id = root;
  let n = 2;
  while (taken.includes(id)) {
    id = `${root}-${n}`;
    n += 1;
  }
  return id;
};

// Photos not yet on the live site (just uploaded) are shown from GitHub.
export const rawPhotoUrl = (file) =>
  `https://raw.githubusercontent.com/${repo.owner}/${repo.name}/${repo.branch}/${paths.photos}/${file}`;

export const livePhotoUrl = (file) => `${process.env.PUBLIC_URL}/cars/${file}`;

export const money = (n) =>
  Number(n || 0).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

export const timeAgo = (iso) => {
  if (!iso) return '—';
  const s = Math.round((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.round(s / 60)} min ago`;
  if (s < 86400) return `${Math.round(s / 3600)} h ago`;
  if (s < 86400 * 30) return `${Math.round(s / 86400)} days ago`;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// Shrinks an uploaded photo to at most 1600px wide as a JPEG so the repo and
// site stay fast. Resolves to { dataUrl, base64 }.
export function prepareImage(file, maxSize = 1600, quality = 0.85) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error(`${file.name} isn’t an image.`));
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      const dataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve({ dataUrl, base64: dataUrl.split(',')[1] });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Couldn’t read ${file.name}. Try a JPG or PNG.`));
    };
    img.src = url;
  });
}
