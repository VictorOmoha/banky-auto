// The admin portal talks to a small API on Vercel (see admin-api/), which
// holds the GitHub key and commits changes to this branch. The "Deploy site"
// GitHub Action then rebuilds the live site.
export const apiBase = (process.env.REACT_APP_ADMIN_API || 'https://banky-auto-admin-api.vercel.app').replace(/\/$/, '');

export const repo = {
  owner: 'VictorOmoha',
  name: 'banky-auto',
  branch: 'main',
};

export const paths = {
  vehicles: 'src/content/vehicles.json',
  site: 'src/content/site.json',
  reviews: 'src/content/reviews.json',
  photos: 'public/cars',
};
