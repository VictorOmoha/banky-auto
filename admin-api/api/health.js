const { send } = require('../lib/shared');

// Lets the admin check the server is reachable and fully configured.
module.exports = (req, res) => {
  const missing = ['GITHUB_TOKEN', 'ADMIN_EMAIL', 'ADMIN_PASSWORD'].filter((k) => !process.env[k]);
  send(res, 200, { ok: missing.length === 0, missing });
};
