function badRequest(res, message) {
  return res.status(400).json({ message });
}

function conflict(res, message) {
  return res.status(409).json({ message });
}

module.exports = {
  badRequest,
  conflict,
};
