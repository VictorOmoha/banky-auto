const { handler, send, gh, BRANCH, CONTENT_FILES, ApiError } = require('../lib/shared');

// Returns one of the site's content files as JSON, straight from GitHub.
module.exports = handler(async (req, res) => {
  const path = new URL(req.url, 'http://x').searchParams.get('path');
  if (!CONTENT_FILES.includes(path)) throw new ApiError(400, 'Unknown file.');
  const file = await gh(`/contents/${path}?ref=${encodeURIComponent(BRANCH)}`);
  const text = Buffer.from(file.content, 'base64').toString('utf8');
  send(res, 200, { data: JSON.parse(text) });
});
