const { handler, readBody, send, gh, BRANCH, CONTENT_FILES, PHOTO_PATH, ApiError } = require('../lib/shared');

/**
 * Saves several changes as one commit on the content branch.
 * files: [{ path, text }]  content JSON (must be one of the site's content files)
 *        [{ path, sha }]   a photo previously uploaded via /api/blob
 *        [{ path, remove: true }]  delete a photo
 */
async function commit(message, files, author, attempt = 0) {
  const ref = await gh(`/git/ref/heads/${BRANCH}`);
  const parentSha = ref.object.sha;
  const parent = await gh(`/git/commits/${parentSha}`);
  const tree = await Promise.all(
    files.map(async (f) => {
      if (f.remove) return { path: f.path, mode: '100644', type: 'blob', sha: null };
      if (f.sha) return { path: f.path, mode: '100644', type: 'blob', sha: f.sha };
      const blob = await gh('/git/blobs', { method: 'POST', body: { content: f.text, encoding: 'utf-8' } });
      return { path: f.path, mode: '100644', type: 'blob', sha: blob.sha };
    })
  );
  const newTree = await gh('/git/trees', { method: 'POST', body: { base_tree: parent.tree.sha, tree } });
  const created = await gh('/git/commits', {
    method: 'POST',
    body: {
      message,
      tree: newTree.sha,
      parents: [parentSha],
      author: { name: 'Banky Auto Admin', email: author },
    },
  });
  try {
    await gh(`/git/refs/heads/${BRANCH}`, { method: 'PATCH', body: { sha: created.sha, force: false } });
  } catch (err) {
    if (err.status === 409 && attempt < 1) return commit(message, files, author, attempt + 1);
    throw err;
  }
  return created.sha;
}

module.exports = handler(async (req, res, user) => {
  if (req.method !== 'POST') return send(res, 405, { error: 'Method not allowed' });
  const { message, files } = await readBody(req);
  if (!Array.isArray(files) || !files.length || files.length > 60) throw new ApiError(400, 'Nothing to save.');

  files.forEach((f) => {
    const isContent = CONTENT_FILES.includes(f.path);
    const isPhoto = PHOTO_PATH.test(f.path || '');
    if (isContent) {
      if (typeof f.text !== 'string' || f.remove || f.sha) throw new ApiError(400, 'Invalid content update.');
      try {
        JSON.parse(f.text);
      } catch {
        throw new ApiError(400, 'Invalid content update.');
      }
    } else if (isPhoto) {
      if (!f.remove && !/^[a-f0-9]{40}$/.test(f.sha || '')) throw new ApiError(400, 'Invalid photo.');
    } else {
      throw new ApiError(400, 'That file can’t be changed from the admin.');
    }
  });

  const cleanMessage = `${String(message || 'Update site content').slice(0, 120)}\n\nSaved from the admin portal by ${user.email}`;
  const sha = await commit(cleanMessage, files, user.email);
  return send(res, 200, { sha });
});
