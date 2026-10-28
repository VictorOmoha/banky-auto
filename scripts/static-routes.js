// GitHub Pages only has a real file for the home page, so every other address
// used to come back as a 404 (rescued by the 404.html redirect). Copy the app
// shell to <route>.html so these pages load directly with a normal response.
// Keep this list in step with the routes in src/App.js. Vehicle pages still go
// through 404.html, since a vehicles/ folder would clash with vehicles.html.
const fs = require('fs');
const path = require('path');

const routes = ['vehicles', 'financing', 'how-it-works', 'about', 'contact', 'faq', 'help', 'careers', 'admin'];

const build = path.join(__dirname, '..', 'build');
const shell = fs.readFileSync(path.join(build, 'index.html'));

routes.forEach((route) => fs.writeFileSync(path.join(build, `${route}.html`), shell));
console.log(`Wrote ${routes.length} static route pages.`);
