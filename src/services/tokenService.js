const crypto = require("crypto");

function generateMockToken(user) {
  const payload = `${user.id}:${user.role}:${Date.now()}:${crypto.randomBytes(8).toString("hex")}`;
  return Buffer.from(payload).toString("base64url");
}

function parseBearerToken(req) {
  const authHeader = String(req.headers.authorization || "");
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return null;
  }

  return token;
}

module.exports = {
  generateMockToken,
  parseBearerToken,
};