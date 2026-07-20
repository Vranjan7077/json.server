const {
  USER_ROLES,
  PROJECT_STATUS,
  TASK_STATUS,
  TASK_PRIORITY,
} = require("../config/constants");

// Declarative validation rules per collection. Adding a new collection means
// adding an entry here, not another branch in validatePayload.js.
const schemas = {
  users: {
    requiredOnCreate: {
      fields: ["name", "email", "role"],
      message: "name, email and role are required",
    },
    enums: {
      role: { values: USER_ROLES, message: "role must be one of admin, editor, viewer" },
    },
    normalize: {
      email: (value) => String(value).toLowerCase().trim(),
    },
    unique: {
      email: { message: "email already exists" },
    },
  },

  projects: {
    requiredOnCreate: {
      fields: ["name", "ownerId", "status", "budget"],
      message: "name, ownerId, status and budget are required",
    },
    enums: {
      status: {
        values: PROJECT_STATUS,
        message: "project status must be planned, in-progress, or done",
      },
    },
    refs: {
      ownerId: { collection: "users", message: "ownerId must reference an existing user" },
    },
    numbers: {
      budget: { min: 0, message: "budget must be a non-negative number" },
    },
  },

  tasks: {
    requiredOnCreate: {
      fields: ["title", "projectId", "status", "priority"],
      message: "title, projectId, status and priority are required",
    },
    enums: {
      status: { values: TASK_STATUS, message: "task status must be todo, in-progress, or done" },
      priority: { values: TASK_PRIORITY, message: "task priority must be low, medium, or high" },
    },
    refs: {
      projectId: { collection: "projects", message: "projectId must reference an existing project" },
      assigneeId: { collection: "users", message: "assigneeId must reference an existing user" },
    },
  },
};

module.exports = {
  schemas,
};
