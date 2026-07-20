const request = require("supertest");
const { buildTestApp } = require("./helpers/buildTestApp");

describe("users validation", () => {
  it("rejects a create with missing fields", async () => {
    const { server } = buildTestApp();

    const res = await request(server).post("/users").send({ name: "New User" });

    expect(res.status).toBe(400);
  });

  it("rejects an invalid role", async () => {
    const { server } = buildTestApp();

    const res = await request(server)
      .post("/users")
      .send({ name: "New User", email: "new@example.com", role: "owner" });

    expect(res.status).toBe(400);
  });

  it("rejects a duplicate email", async () => {
    const { server } = buildTestApp();

    const res = await request(server)
      .post("/users")
      .send({ name: "Duplicate", email: "ava@example.com", role: "viewer" });

    expect(res.status).toBe(409);
  });

  it("creates a valid user and stamps timestamps", async () => {
    const { server } = buildTestApp();

    const res = await request(server)
      .post("/users")
      .send({ name: "New User", email: "New@Example.com", role: "viewer" });

    expect(res.status).toBe(201);
    expect(res.body.email).toBe("new@example.com");
    expect(res.body.createdAt).toEqual(expect.any(String));
    expect(res.body.updatedAt).toEqual(expect.any(String));
  });
});

describe("projects validation", () => {
  it("rejects an ownerId that does not reference a real user", async () => {
    const { server } = buildTestApp();

    const res = await request(server)
      .post("/projects")
      .send({ name: "New Project", ownerId: 999, status: "planned", budget: 1000 });

    expect(res.status).toBe(400);
  });

  it("rejects a negative budget", async () => {
    const { server } = buildTestApp();

    const res = await request(server)
      .post("/projects")
      .send({ name: "New Project", ownerId: 1, status: "planned", budget: -5 });

    expect(res.status).toBe(400);
  });

  it("creates a valid project", async () => {
    const { server } = buildTestApp();

    const res = await request(server)
      .post("/projects")
      .send({ name: "New Project", ownerId: 1, status: "planned", budget: 1000 });

    expect(res.status).toBe(201);
    expect(res.body.ownerId).toBe(1);
    expect(res.body.budget).toBe(1000);
  });
});

describe("tasks validation", () => {
  it("rejects an unknown projectId", async () => {
    const { server } = buildTestApp();

    const res = await request(server)
      .post("/tasks")
      .send({ title: "New Task", projectId: 999, status: "todo", priority: "low" });

    expect(res.status).toBe(400);
  });

  it("rejects an invalid status", async () => {
    const { server } = buildTestApp();

    const res = await request(server)
      .post("/tasks")
      .send({ title: "New Task", projectId: 1, status: "blocked", priority: "low" });

    expect(res.status).toBe(400);
  });

  it("rejects an unknown assigneeId", async () => {
    const { server } = buildTestApp();

    const res = await request(server)
      .post("/tasks")
      .send({ title: "New Task", projectId: 1, assigneeId: 999, status: "todo", priority: "low" });

    expect(res.status).toBe(400);
  });

  it("creates a valid task", async () => {
    const { server } = buildTestApp();

    const res = await request(server)
      .post("/tasks")
      .send({ title: "New Task", projectId: 1, assigneeId: 2, status: "todo", priority: "low" });

    expect(res.status).toBe(201);
    expect(res.body.projectId).toBe(1);
  });
});
