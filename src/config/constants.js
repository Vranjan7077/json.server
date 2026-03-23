const PORT = Number(process.env.PORT) || 3000;
const MOCK_LOGIN_PASSWORD = process.env.MOCK_LOGIN_PASSWORD || "demo123";
const TOKEN_TTL_SECONDS = 3600;

const USER_ROLES = new Set(["admin", "editor", "viewer"]);
const PROJECT_STATUS = new Set(["planned", "in-progress", "done"]);
const TASK_STATUS = new Set(["todo", "in-progress", "done"]);
const TASK_PRIORITY = new Set(["low", "medium", "high"]);

module.exports = {
  PORT,
  MOCK_LOGIN_PASSWORD,
  TOKEN_TTL_SECONDS,
  USER_ROLES,
  PROJECT_STATUS,
  TASK_STATUS,
  TASK_PRIORITY,
};
