const { handler, send, gh, BRANCH } = require('../lib/shared');

// Latest run of the "Deploy site" GitHub Action, to show publishing progress.
module.exports = handler(async (req, res) => {
  let data;
  try {
    data = await gh(`/actions/workflows/deploy.yml/runs?branch=${encodeURIComponent(BRANCH)}&per_page=1`);
  } catch {
    return send(res, 200, { run: null });
  }
  const run = data.workflow_runs && data.workflow_runs[0];
  return send(res, 200, {
    run: run
      ? { status: run.status, conclusion: run.conclusion, url: run.html_url, sha: run.head_sha, createdAt: run.created_at }
      : null,
  });
});
