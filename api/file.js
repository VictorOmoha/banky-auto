// Vercel serves this repo's top-level api/ folder as serverless functions, so the
// admin API works without setting the project's Root Directory. The code lives
// in admin-api/api/.
module.exports = require('../admin-api/api/file.js');
