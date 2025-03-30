const request = require("supertest");
const app = require("../app");
const { User } = require("../src/models/User/User");

const testUserHandle = "gonudayo";

describe("Users API", () => {
  afterAll(async () => {
    try {
      await User.deleteOne({ handle: testUserHandle });
    } catch (error) {
      console.error("삭제 중 오류 발생:", error);
    }
  });

  it("GET /api/v2/users - 모든 사용자 조회", async () => {
    const res = await request(app).get("/api/v2/users");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.users)).toBe(true);
  });

  it("GET /api/v2/users/:handle - 특정 사용자 조회", async () => {
    const res = await request(app).get(`/api/v2/users/${testUserHandle}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.user).toHaveProperty("handle", testUserHandle);
  });

  it("PATCH /api/v2/users/:handle - 사용자 정보 수정", async () => {
    const res = await request(app)
      .patch(`/api/v2/users/${testUserHandle}`)
      .send({ name: "테스트 유저123" });

    expect(res.statusCode).toBe(200);
    expect(res.body.user).toHaveProperty("name", "테스트 유저123");
  });
});
