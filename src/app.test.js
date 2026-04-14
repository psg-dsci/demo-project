const request = require("supertest");
const app = require("../src/app");

describe("API Endpoints", () => {
  test("GET / returns welcome message", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toContain("Hello from EC2");
  });

  test("GET /health returns ok status", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("ok");
    expect(res.body).toHaveProperty("uptime");
  });

  test("GET /info returns node info", async () => {
    const res = await request(app).get("/info");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("node");
    expect(res.body).toHaveProperty("platform");
  });
});
