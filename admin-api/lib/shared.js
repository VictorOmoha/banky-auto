// Shared helpers for the Banky Auto admin API (Vercel serverless functions).
// The GitHub token lives only here, in Vercel environment variables; the
// owner signs in with an email and password instead.
const crypto = require('crypto');

const REPO = process.env.GITHUB_REPO || 'VictorOmoha/banky-auto';
const BRANCH = process.env.GITHUB_BRANCH || 'main';
const SESSION_DAYS = 14;

const DEFAULT_ORIGINS = [
  'https://victoromoha.github.io',
  'https://bankyauto.com',
  'https://www.bankyauto.com',
  'http://localhost:3000',
];

const CONTENT_FILES = ['src/content/vehicles.json', 'src/content/site.json', 'src/content/reviews.json'];
const PHOTO_PATH = /^public\/cars\/[A-Za-z0-9][A-Za-z0-9_-]{0,80}\.(jpe?g|png|webp)$/i;

const missingConfig = () => ['GITHUB_TOKEN', 'ADMIN_EMAIL', 'ADMIN_PASSWORD'].filter((k) => !process.env[k]);

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

// CORS: only the website itself may call this API from a browser.
function cors(req, res) {
  const allowed = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .concat(DEFAULT_ORIGINS);
  const origin = req.headers.origin;
  if (origin && allowed.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Max-Age', '600');
  }
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return true;
  }
  return false;
}

async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

// ── Sessions: an HMAC-signed token. Changing ADMIN_PASSWORD signs everyone out.
const signingKey = () =>
  crypto.createHash('sha256').update(`${process.env.GITHUB_TOKEN}|${process.env.ADMIN_PASSWORD}|banky-admin`).digest();

const b64url = (buf) => Buffer.from(buf).toString('base64url');

function issueSession(email) {
  const payload = b64url(JSON.stringify({ e: email, exp: Date.now() + SESSION_DAYS * 864e5 }));
  const sig = b64url(crypto.createHmac('sha256', signingKey()).update(payload).digest());
  return `${payload}.${sig}`;
}

function readSession(req) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return null;
  const expected = b64url(crypto.createHmac('sha256', signingKey()).update(payload).digest());
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!data.exp || data.exp < Date.now()) return null;
    if (String(data.e).toLowerCase() !== String(process.env.ADMIN_EMAIL).toLowerCase()) return null;
    return { email: data.e, name: process.env.ADMIN_NAME || 'Owner' };
  } catch {
    return null;
  }
}

const safeEqual = (x, y) => {
  const a = crypto.createHash('sha256').update(String(x)).digest();
  const b = crypto.createHash('sha256').update(String(y)).digest();
  return crypto.timingSafeEqual(a, b);
};

// Wraps a handler with CORS, config checks and (optionally) sign-in checks.
function handler(fn, { auth = true } = {}) {
  return async (req, res) => {
    try {
      if (cors(req, res)) return;
      const missing = missingConfig();
      if (missing.length) {
        send(res, 503, { error: `The admin isn’t set up yet. Missing settings: ${missing.join(', ')}.`, code: 'not_configured' });
        return;
      }
      let user = null;
      if (auth) {
        user = readSession(req);
        if (!user) {
          send(res, 401, { error: 'Your session has ended. Please sign in again.', code: 'signed_out' });
          return;
        }
      }
      await fn(req, res, user);
    } catch (err) {
      send(res, err.status || 500, { error: err.expose ? err.message : 'Something went wrong. Please try again.' });
      if (!err.expose) console.error(err);
    }
  };
}

class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.expose = true;
  }
}

// ── GitHub
async function gh(path, { method = 'GET', body } = {}) {
  const res = await fetch(`https://api.github.com/repos/${REPO}${path}`, {
    method,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'banky-auto-admin',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    let message = '';
    try {
      message = (await res.json()).message;
    } catch {
      /* ignore */
    }
    console.error('GitHub', method, path, res.status, message);
    if (res.status === 401 || res.status === 403) {
      throw new ApiError(502, 'The website’s GitHub connection needs attention. Please contact your web developer.');
    }
    if (res.status === 409 || res.status === 422) throw new ApiError(409, 'The site changed while you were saving. Please try again.');
    throw new ApiError(502, 'Couldn’t reach GitHub. Please try again in a moment.');
  }
  return res.status === 204 ? null : res.json();
}

module.exports = {
  REPO,
  BRANCH,
  CONTENT_FILES,
  PHOTO_PATH,
  ApiError,
  send,
  readBody,
  handler,
  issueSession,
  safeEqual,
  gh,
};
