const {
  USER_ROLES,
  PROJECT_STATUS,
  TASK_STATUS,
  TASK_PRIORITY,
} = require("../config/constants");
const { badRequest, conflict } = require("../utils/http");
const { toInt } = require("../utils/numbers");

function createValidatePayload(router) {
  return function validatePayload(req, res, next) {
    const collection = req.path.replace(/^\/+/, "").split("/")[0];

    if (collection === "users") {
      const { name, email, role } = req.body || {};

      if (req.method === "POST" && (!name || !email || !role)) {
        return badRequest(res, "name, email and role are required");
      }

      if (role && !USER_ROLES.has(role)) {
        return badRequest(res, "role must be one of admin, editor, viewer");
      }

      if (email) {
        req.body.email = String(email).toLowerCase().trim();

        const existing = router.db
          .get("users")
          .find({ email: req.body.email })
          .value();

        const routeId = toInt(req.params.id);
        if (existing && existing.id !== routeId) {
          return conflict(res, "email already exists");
        }
      }
    }

    if (collection === "projects") {
      const { name, ownerId, status, budget } = req.body || {};

      if (
        req.method === "POST" &&
        (!name || ownerId == null || !status || budget == null)
      ) {
        return badRequest(res, "name, ownerId, status and budget are required");
      }

      if (status && !PROJECT_STATUS.has(status)) {
        return badRequest(
          res,
          "project status must be planned, in-progress, or done",
        );
      }

      if (ownerId != null) {
        const owner = router.db
          .get("users")
          .find({ id: Number(ownerId) })
          .value();
        if (!owner) {
          return badRequest(res, "ownerId must reference an existing user");
        }
        req.body.ownerId = Number(ownerId);
      }

      if (budget != null) {
        const parsedBudget = Number(budget);
        if (!Number.isFinite(parsedBudget) || parsedBudget < 0) {
          return badRequest(res, "budget must be a non-negative number");
        }
        req.body.budget = parsedBudget;
      }
    }

    if (collection === "tasks") {
      const { title, projectId, assigneeId, status, priority } = req.body || {};

      if (
        req.method === "POST" &&
        (!title || projectId == null || !status || !priority)
      ) {
        return badRequest(
          res,
          "title, projectId, status and priority are required",
        );
      }

      if (status && !TASK_STATUS.has(status)) {
        return badRequest(
          res,
          "task status must be todo, in-progress, or done",
        );
      }

      if (priority && !TASK_PRIORITY.has(priority)) {
        return badRequest(res, "task priority must be low, medium, or high");
      }

      if (projectId != null) {
        const project = router.db
          .get("projects")
          .find({ id: Number(projectId) })
          .value();
        if (!project) {
          return badRequest(
            res,
            "projectId must reference an existing project",
          );
        }
        req.body.projectId = Number(projectId);
      }

      if (assigneeId != null) {
        const assignee = router.db
          .get("users")
          .find({ id: Number(assigneeId) })
          .value();
        if (!assignee) {
          return badRequest(res, "assigneeId must reference an existing user");
        }
        req.body.assigneeId = Number(assigneeId);
      }
    }

    return next();
  };
}

module.exports = {
  createValidatePayload,
};
