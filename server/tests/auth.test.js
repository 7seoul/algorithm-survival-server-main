const request = require("supertest");
const app = require("../app");
const { User } = require("../src/models/User/User");

describe("Auth API", () => {
  const testUserHandle = "gonudayo";
  let authToken; // 로그인 토큰 저장
  let verifiedHandle; // 인증된 사용자 핸들 저장

  it("POST /api/v2/auth/code - 인증 코드 생성", async () => {
    const res = await request(app)
      .post("/api/v2/auth/code")
      .send({ handle: testUserHandle });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("code");
  });

  it("POST /api/v2/auth/verify - 인증 코드 검증", async () => {
    const res = await request(app)
      .post("/api/v2/auth/verify")
      .send({ handle: testUserHandle });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("handle");
    verifiedHandle = res.body.handle;
  });

  it("POST /api/v2/auth/register - 새 사용자 생성", async () => {
    const res = await request(app).post("/api/v2/auth/register").send(
      {
        name: "테스트 유저",
        handle: testUserHandle,
        password: "testpassword",
      },
      10
    );

    expect(res.statusCode).toBe(200);
    expect(res.body.user).toHaveProperty("handle", testUserHandle);
  });

  it("POST /api/v2/auth/login - 로그인", async () => {
    const res = await request(app)
      .post("/api/v2/auth/login")
      .send({ handle: verifiedHandle, password: "testpassword" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    authToken = res.body.token;
  });

  it("GET /api/v2/auth/me - 로그인한 사용자 정보 조회", async () => {
    const res = await request(app)
      .get("/api/v2/auth/me")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("handle", verifiedHandle);
  });

  it("POST /api/v2/auth/logout - 로그아웃", async () => {
    const res = await request(app)
      .post("/api/v2/auth/logout")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
  });
});

module.exports = { verifiedHandle };
