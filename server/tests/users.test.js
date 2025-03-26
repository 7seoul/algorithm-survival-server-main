const request = require("supertest");
const app = require("../app");
const mongoose = require('mongoose');
const testHandle = "gonudayo";

describe("Users API", () => {

  it("POST /api/v2/users - 새 사용자 생성", async () => {
    const res = await request(app).post("/api/v2/users").send({
      name: "테스트 유저",
      handle: testHandle,
      password: "testpassword",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("handle", testHandle);
  });

  it("GET /api/v2/users - 모든 사용자 조회", async () => {
    const res = await request(app).get("/api/v2/users");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.users)).toBe(true);
  });

  it("GET /api/v2/users/:handle - 특정 사용자 조회", async () => {
    const res = await request(app).get(`/api/v2/users/${testHandle}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("handle", testHandle);
  });

  it("PATCH /api/v2/users/:handle - 사용자 정보 수정", async () => {
    const res = await request(app)
      .patch(`/api/v2/users/${testHandle}`)
      .send({ handle: testHandle });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("handle", testHandle);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});