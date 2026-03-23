const { MOCK_LOGIN_PASSWORD } = require("../config/constants");
const { badRequest } = require("../utils/http");

function registerCustomRoutes(server, router, authRequired, sessionService) {
  server.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  server.post("/login", (req, res) => {
    const email = String(req.body?.email || "")
      .toLowerCase()
      .trim();
    const password = String(req.body?.password || "");

    if (!email || !password) {
      return badRequest(res, "email and password are required");
    }

    if (password !== MOCK_LOGIN_PASSWORD) {
      return res.status(401).json({ message: "invalid credentials" });
    }

    const user = router.db.get("users").find({ email }).value();

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    if (!user.active) {
      return res.status(403).json({ message: "user is inactive" });
    }

    const session = sessionService.createSession(user);

    return res.json({
      token: session.token,
      tokenType: "Bearer",
      expiresIn: session.expiresIn,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        active: user.active,
      },
    });
  });

  server.get("/me", authRequired, (req, res) => {
    const user = router.db.get("users").find({ id: req.auth.userId }).value();

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      active: user.active,
    });
  });

  server.post("/logout", authRequired, (req, res) => {
    sessionService.removeSession(req.auth.token);
    return res.status(204).send();
  });

  server.get("/stats", (_req, res) => {
    const db = router.db;
    const users = db.get("users").value() || [];
    const projects = db.get("projects").value() || [];
    const tasks = db.get("tasks").value() || [];

    const projectsByStatus = projects.reduce((acc, project) => {
      acc[project.status] = (acc[project.status] || 0) + 1;
      return acc;
    }, {});

    const tasksByStatus = tasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {});

    const tasksByPriority = tasks.reduce((acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    }, {});

    res.json({
      totals: {
        users: users.length,
        projects: projects.length,
        tasks: tasks.length,
      },
      projectsByStatus,
      tasksByStatus,
      tasksByPriority,
    });
  });

  server.get("/search", (req, res) => {
    const q = String(req.query.q || "")
      .trim()
      .toLowerCase();

    if (!q) {
      return badRequest(res, "query param q is required");
    }

    const db = router.db;
    const users = (db.get("users").value() || []).filter((u) =>
      [u.name, u.email, u.role].some((v) =>
        String(v || "")
          .toLowerCase()
          .includes(q),
      ),
    );

    const projects = (db.get("projects").value() || []).filter((p) =>
      [p.name, p.status].some((v) =>
        String(v || "")
          .toLowerCase()
          .includes(q),
      ),
    );

    const tasks = (db.get("tasks").value() || []).filter((t) =>
      [t.title, t.status, t.priority].some((v) =>
        String(v || "")
          .toLowerCase()
          .includes(q),
      ),
    );

    return res.json({ query: q, users, projects, tasks });
  });
}

module.exports = {
  registerCustomRoutes,
};
