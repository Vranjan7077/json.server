function withTimestamps(req, _res, next) {
  if (!["POST", "PUT", "PATCH"].includes(req.method)) {
    return next();
  }

  const now = new Date().toISOString();

  if (req.method === "POST") {
    req.body.createdAt = req.body.createdAt || now;
    req.body.updatedAt = now;
    return next();
  }

  req.body.updatedAt = now;
  return next();
}

module.exports = {
  withTimestamps,
};