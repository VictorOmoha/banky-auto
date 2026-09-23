// Where the admin portal reads and saves content. Saving commits to this
// branch; the "Deploy site" GitHub Action then rebuilds the live site.
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

export const repoUrl = `https://github.com/${repo.owner}/${repo.name}`;

// Pre-filled form for creating a token that can only edit this repository.
export const newTokenUrl = 'https://github.com/settings/personal-access-tokens/new';
