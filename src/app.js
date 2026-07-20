const path = require("path");
const jsonServer = require("json-server");

const { PORT, TOKEN_TTL_SECONDS } = require("./config/constants");
const { createSessionService } = require("./services/sessionService");
const { createAuthRequired } = require("./middleware/authRequired");
const { withDelayAndFailure } = require("./middleware/withDelayAndFailure");
const { withTimestamps } = require("./middleware/withTimestamps");
const { createValidatePayload } = require("./middleware/validatePayload");
const { registerCustomRoutes } = require("./routes/customRoutes");

function createApp(options = {}) {
  const rootDir = path.join(__dirname, "..");

  const dbSource = options.dbSource || path.join(rootDir, "db.json");
  const routes = options.routes || require(path.join(rootDir, "routes.json"));

  const server = jsonServer.create();
  const router = jsonServer.router(dbSource);
  const middlewares = jsonServer.defaults();
  const rewriter = jsonServer.rewriter(routes);

  const sessionService = createSessionService(TOKEN_TTL_SECONDS);
  const authRequired = createAuthRequired(sessionService);
  const validatePayload = createValidatePayload(router);

  server.use(middlewares);
  server.use(jsonServer.bodyParser);
  server.use(withDelayAndFailure);
  server.use(rewriter);
  server.use(withTimestamps);

  registerCustomRoutes(server, router, authRequired, sessionService);

  server.use(validatePayload);
  server.use(router);

  return {
    server,
    router,
    port: options.port || PORT,
  };
}

module.exports = {
  createApp,
};
