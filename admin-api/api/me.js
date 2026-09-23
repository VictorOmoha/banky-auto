const { handler, send } = require('../lib/shared');

module.exports = handler(async (req, res, user) => send(res, 200, { user }));
