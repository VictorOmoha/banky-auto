const { handler, readBody, send, issueSession, safeEqual } = require('../lib/shared');

// Best-effort brute-force protection (per server instance).
const attempts = new Map();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 8;

module.exports = handler(
  async (req, res) => {
    if (req.method !== 'POST') return send(res, 405, { error: 'Method not allowed' });
    const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
    const now = Date.now();
    const recent = (attempts.get(ip) || []).filter((t) => now - t < WINDOW_MS);
    if (recent.length >= MAX_ATTEMPTS) {
      return send(res, 429, { error: 'Too many sign-in attempts. Please wait 15 minutes and try again.' });
    }

    const { email = '', password = '' } = await readBody(req);
    const ok =
      safeEqual(String(email).trim().toLowerCase(), String(process.env.ADMIN_EMAIL).trim().toLowerCase()) &&
      safeEqual(password, process.env.ADMIN_PASSWORD);

    if (!ok) {
      attempts.set(ip, [...recent, now]);
      await new Promise((r) => setTimeout(r, 700));
      return send(res, 401, { error: 'That email and password don’t match. Please try again.' });
    }
    attempts.delete(ip);
    return send(res, 200, {
      token: issueSession(process.env.ADMIN_EMAIL),
      user: { email: process.env.ADMIN_EMAIL, name: process.env.ADMIN_NAME || 'Owner' },
    });
  },
  { auth: false }
);
