function toInt(value) {
  const n = Number(value);
  return Number.isInteger(n) ? n : null;
}

module.exports = {
  toInt,
};
