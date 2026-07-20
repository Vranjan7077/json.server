// Minimal, deterministic dataset for tests. Kept separate from db.json so
// test runs never read or write the real development database.
function buildFixture() {
  return {
    users: [
      { id: 1, name: "Ava Johnson", email: "ava@example.com", role: "admin", active: true },
      { id: 2, name: "Liam Patel", email: "liam@example.com", role: "editor", active: true },
      { id: 3, name: "Noah Kim", email: "noah@example.com", role: "viewer", active: false },
    ],
    projects: [
      { id: 1, name: "Website Redesign", ownerId: 1, status: "in-progress", budget: 12000 },
      { id: 2, name: "Mobile App MVP", ownerId: 2, status: "planned", budget: 18000 },
    ],
    tasks: [
      { id: 1, projectId: 1, assigneeId: 2, title: "Build landing page", status: "todo", priority: "high" },
      { id: 2, projectId: 1, assigneeId: 2, title: "Accessibility review", status: "in-progress", priority: "medium" },
      { id: 3, projectId: 2, assigneeId: null, title: "Define auth flow", status: "todo", priority: "low" },
    ],
    projectMembers: [],
    taskComments: [],
    attachments: [],
  };
}

module.exports = {
  buildFixture,
};
