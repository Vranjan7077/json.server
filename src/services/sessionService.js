const { generateMockToken } = require("./tokenService");

function createSessionService(ttlSeconds) {
  const sessions = new Map();

  function createSession(user) {
    const token = generateMockToken(user);
    const expiresAt = Date.now() + ttlSeconds * 1000;

    sessions.set(token, { userId: user.id, expiresAt });

    return {
      token,
      expiresIn: ttlSeconds,
    };
  }

  function getSession(token) {
    const session = sessions.get(token);

    if (!session) {
      return null;
    }

    if (Date.now() > session.expiresAt) {
      sessions.delete(token);
      return null;
    }

    return session;
  }

  function removeSession(token) {
    sessions.delete(token);
  }

  return {
    createSession,
    getSession,
    removeSession,
  };
}

module.exports = {
  createSessionService,
};