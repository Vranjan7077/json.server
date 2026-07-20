const request = require("supertest");
const { buildTestApp } = require("./helpers/buildTestApp");

describe("auth flow", () => {
  it("rejects login with missing credentials", async () => {
    const { server } = buildTestApp();

    const res = await request(server).post("/login").send({ email: "ava@example.com" });

    expect(res.status).toBe(400);
  });

  it("rejects login with wrong password", async () => {
    const { server } = buildTestApp();

    const res = await request(server)
      .post("/login")
      .send({ email: "ava@example.com", password: "wrong" });

    expect(res.status).toBe(401);
  });

  it("rejects login for unknown email", async () => {
    const { server } = buildTestApp();

    const res = await request(server)
      .post("/login")
      .send({ email: "nobody@example.com", password: "demo123" });

    expect(res.status).toBe(404);
  });

  it("rejects login for inactive user", async () => {
    const { server } = buildTestApp();

    const res = await request(server)
      .post("/login")
      .send({ email: "noah@example.com", password: "demo123" });

    expect(res.status).toBe(403);
  });

  it("logs in, fetches the session user, then logs out", async () => {
    const { server } = buildTestApp();

    const login = await request(server)
      .post("/login")
      .send({ email: "ava@example.com", password: "demo123" });

    expect(login.status).toBe(200);
    expect(login.body.token).toEqual(expect.any(String));

    const token = login.body.token;

    const me = await request(server).get("/me").set("Authorization", `Bearer ${token}`);
    expect(me.status).toBe(200);
    expect(me.body.email).toBe("ava@example.com");

    const logout = await request(server).post("/logout").set("Authorization", `Bearer ${token}`);
    expect(logout.status).toBe(204);

    const meAfterLogout = await request(server).get("/me").set("Authorization", `Bearer ${token}`);
    expect(meAfterLogout.status).toBe(401);
  });

  it("rejects /me without a token", async () => {
    const { server } = buildTestApp();

    const res = await request(server).get("/me");

    expect(res.status).toBe(401);
  });
});
