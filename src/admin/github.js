import { repo } from './config';

const API = 'https://api.github.com';

export class GitHubError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

const friendly = (status, fallback) => {
  if (status === 401) return 'GitHub rejected the access token. It may be mistyped, expired or revoked.';
  if (status === 403) return 'This token doesn’t have permission for that. Make sure it has “Contents: Read and write” access to the banky-auto repository.';
  if (status === 404) return 'GitHub couldn’t find the repository or file. Check the token has access to the banky-auto repository.';
  if (status === 409 || status === 422) return 'The site changed while you were saving. Please try again.';
  return fallback || `GitHub returned an error (${status}).`;
};

async function request(token, path, { method = 'GET', body } = {}) {
  let res;
  try {
    res = await fetch(`${API}${path}`, {
      method,
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28',
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      cache: 'no-store',
    });
  } catch {
    throw new GitHubError('Couldn’t reach GitHub. Check your internet connection and try again.', 0);
  }
  if (!res.ok) {
    let detail = '';
    try {
      detail = (await res.json()).message;
    } catch {
      /* ignore */
    }
    throw new GitHubError(friendly(res.status, detail), res.status);
  }
  return res.status === 204 ? null : res.json();
}

const repoPath = `/repos/${repo.owner}/${repo.name}`;

// UTF-8 safe base64 helpers (atob/btoa only handle Latin-1).
export const encodeBase64 = (text) => {
  const bytes = new TextEncoder().encode(text);
  let bin = '';
  bytes.forEach((b) => {
    bin += String.fromCharCode(b);
  });
  return btoa(bin);
};

const decodeBase64 = (b64) => {
  const bin = atob(b64.replace(/\s/g, ''));
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
};

// Confirms the token works and can write to the repository.
export async function verifyToken(token) {
  const [user, info] = await Promise.all([request(token, '/user'), request(token, repoPath)]);
  if (info.permissions && !info.permissions.push) {
    throw new GitHubError(`The GitHub account “${user.login}” can view but not edit this repository.`, 403);
  }
  return { login: user.login, avatar: user.avatar_url, name: user.name || user.login };
}

export async function readJson(token, path) {
  const file = await request(token, `${repoPath}/contents/${path}?ref=${encodeURIComponent(repo.branch)}`);
  return JSON.parse(decodeBase64(file.content));
}

/**
 * Commits several file changes as one commit on the content branch.
 * files: [{ path, text }] | [{ path, base64 }] | [{ path, remove: true }]
 */
export async function commitFiles(token, message, files, attempt = 0) {
  const ref = await request(token, `${repoPath}/git/ref/heads/${repo.branch}`);
  const parentSha = ref.object.sha;
  const parent = await request(token, `${repoPath}/git/commits/${parentSha}`);

  const tree = await Promise.all(
    files.map(async (f) => {
      if (f.remove) return { path: f.path, mode: '100644', type: 'blob', sha: null };
      const blob = await request(token, `${repoPath}/git/blobs`, {
        method: 'POST',
        body: f.base64 !== undefined ? { content: f.base64, encoding: 'base64' } : { content: f.text, encoding: 'utf-8' },
      });
      return { path: f.path, mode: '100644', type: 'blob', sha: blob.sha };
    })
  );

  const newTree = await request(token, `${repoPath}/git/trees`, {
    method: 'POST',
    body: { base_tree: parent.tree.sha, tree },
  });
  const commit = await request(token, `${repoPath}/git/commits`, {
    method: 'POST',
    body: { message, tree: newTree.sha, parents: [parentSha] },
  });
  try {
    await request(token, `${repoPath}/git/refs/heads/${repo.branch}`, {
      method: 'PATCH',
      body: { sha: commit.sha, force: false },
    });
  } catch (err) {
    // Someone else committed in between: rebuild on top of the new head once.
    if ((err.status === 422 || err.status === 409) && attempt < 1) return commitFiles(token, message, files, attempt + 1);
    throw err;
  }
  return commit.sha;
}

// Latest run of the deploy workflow, used to show publishing progress.
export async function latestDeploy(token) {
  const data = await request(
    token,
    `${repoPath}/actions/workflows/deploy.yml/runs?branch=${encodeURIComponent(repo.branch)}&per_page=1`
  );
  const run = data.workflow_runs?.[0];
  if (!run) return null;
  return {
    status: run.status,
    conclusion: run.conclusion,
    url: run.html_url,
    sha: run.head_sha,
    createdAt: run.created_at,
  };
}
