const { handler, readBody, send, gh, ApiError } = require('../lib/shared');

const MAX_BYTES = 3 * 1024 * 1024;

// Uploads one photo to GitHub (not yet committed); returns its blob id.
module.exports = handler(async (req, res) => {
  if (req.method !== 'POST') return send(res, 405, { error: 'Method not allowed' });
  const { base64 } = await readBody(req);
  if (typeof base64 !== 'string' || !/^[A-Za-z0-9+/=\s]+$/.test(base64)) throw new ApiError(400, 'That photo couldn’t be read.');
  const bytes = Buffer.from(base64, 'base64');
  if (bytes.length > MAX_BYTES) throw new ApiError(413, 'That photo is too large. Please use one under 3 MB.');
  const isImage =
    (bytes[0] === 0xff && bytes[1] === 0xd8) || // JPEG
    (bytes[0] === 0x89 && bytes[1] === 0x50) || // PNG
    bytes.slice(8, 12).toString() === 'WEBP';
  if (!isImage) throw new ApiError(400, 'Only JPG, PNG or WebP photos can be uploaded.');
  const blob = await gh('/git/blobs', { method: 'POST', body: { content: base64, encoding: 'base64' } });
  return send(res, 201, { sha: blob.sha });
});
