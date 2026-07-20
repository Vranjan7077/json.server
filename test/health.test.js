const request = require("supertest");
const { buildTestApp } = require("./helpers/buildTestApp");

describe("GET /health", () => {
  it("reports ok", async () => {
    const { server } = buildTestApp();

    const res = await request(server).get("/health");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });
});
