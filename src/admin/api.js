import { apiBase } from './config';

export class ApiError extends Error {
  constructor(message, status, code) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

async function request(path, { method = 'GET', body, session } = {}) {
  let res;
  try {
    res = await fetch(`${apiBase}${path}`, {
      method,
      headers: {
        ...(session ? { Authorization: `Bearer ${session}` } : {}),
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      cache: 'no-store',
    });
  } catch {
    throw new ApiError('Couldn’t connect. Check your internet connection and try again.', 0, 'offline');
  }
  let data = {};
  try {
    data = await res.json();
  } catch {
    /* empty body */
  }
  if (!res.ok) throw new ApiError(data.error || `Something went wrong (${res.status}).`, res.status, data.code);
  return data;
}

export const login = (email, password) => request('/api/login', { method: 'POST', body: { email, password } });

export const me = (session) => request('/api/me', { session }).then((d) => d.user);

export const readJson = (session, path) =>
  request(`/api/file?path=${encodeURIComponent(path)}`, { session }).then((d) => d.data);

export const uploadPhoto = (session, base64) =>
  request('/api/blob', { method: 'POST', body: { base64 }, session }).then((d) => d.sha);

/**
 * Saves several changes as one commit.
 * files: [{ path, text }] | [{ path, base64 }] | [{ path, remove: true }]
 * Photos are uploaded one at a time first to stay under request size limits.
 */
export async function commitFiles(session, message, files) {
  const prepared = [];
  for (const f of files) {
    if (f.base64 !== undefined) {
      // eslint-disable-next-line no-await-in-loop
      prepared.push({ path: f.path, sha: await uploadPhoto(session, f.base64) });
    } else prepared.push(f);
  }
  return request('/api/commit', { method: 'POST', body: { message, files: prepared }, session }).then((d) => d.sha);
}

export const latestDeploy = (session) => request('/api/deploy-status', { session }).then((d) => d.run);
