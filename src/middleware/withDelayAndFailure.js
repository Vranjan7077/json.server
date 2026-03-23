function withDelayAndFailure(req, res, next) {
  const delay = Number(req.query.delay || 0);
  const shouldFail = String(req.query.fail || "false").toLowerCase() === "true";

  if (shouldFail) {
    return res.status(500).json({ message: "Simulated server failure" });
  }

  if (delay > 0 && delay <= 10000) {
    return setTimeout(next, delay);
  }

  return next();
}

module.exports = {
  withDelayAndFailure,
};