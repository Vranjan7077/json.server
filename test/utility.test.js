const request = require("supertest");
const { buildTestApp } = require("./helpers/buildTestApp");

describe("GET /stats", () => {
  it("summarizes totals and breakdowns", async () => {
    const { server } = buildTestApp();

    const res = await request(server).get("/stats");

    expect(res.status).toBe(200);
    expect(res.body.totals).toEqual({ users: 3, projects: 2, tasks: 3 });
    expect(res.body.tasksByStatus.todo).toBe(2);
  });
});

describe("GET /search", () => {
  it("requires a query", async () => {
    const { server } = buildTestApp();

    const res = await request(server).get("/search");

    expect(res.status).toBe(400);
  });

  it("finds matches across collections", async () => {
    const { server } = buildTestApp();

    const res = await request(server).get("/search").query({ q: "ava" });

    expect(res.status).toBe(200);
    expect(res.body.users).toHaveLength(1);
    expect(res.body.users[0].email).toBe("ava@example.com");
  });
});

describe("delay and failure simulation", () => {
  it("returns 500 when fail=true", async () => {
    const { server } = buildTestApp();

    const res = await request(server).get("/tasks").query({ fail: "true" });

    expect(res.status).toBe(500);
  });

  it("honors a short delay without failing", async () => {
    const { server } = buildTestApp();

    const res = await request(server).get("/tasks").query({ delay: "50" });

    expect(res.status).toBe(200);
  });
});
