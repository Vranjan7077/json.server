const { parseBearerToken } = require("../services/tokenService");

function createAuthRequired(sessionService) {
  return function authRequired(req, res, next) {
    const token = parseBearerToken(req);

    if (!token) {
      return res.status(401).json({
        message: "missing or invalid authorization header",
      });
    }

    const session = sessionService.getSession(token);

    if (!session) {
      return res.status(401).json({ message: "invalid or expired token" });
    }

    req.auth = { token, userId: session.userId };
    return next();
  };
}

module.exports = {
  createAuthRequired,
};