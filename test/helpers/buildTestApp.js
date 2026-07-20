const { createApp } = require("../../src/app");
const { buildFixture } = require("../fixtures/db");

function buildTestApp(overrides = {}) {
  const dbSource = overrides.dbSource || buildFixture();
  return createApp({ dbSource });
}

module.exports = {
  buildTestApp,
};
