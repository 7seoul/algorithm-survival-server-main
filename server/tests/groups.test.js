const request = require("supertest");
const app = require("../app"); // 서버 파일
const { User } = require("../src/models/User/User");
const { Group } = require("../src/models/Group/Group");

const testGroupId = 0;
const testAdminHandle = "test-admin";
const testMemberHandle = "test-member";

describe("Groups API", () => {
  let adminUser;
  let memberUser;
  let group;

  beforeAll(async () => {
    try {
      // 테스트용 어드민 생성
      adminUser = await User.create({
        name: "테스트 어드민",
        handle: testAdminHandle,
        initialProblemCount: 0,
        dailyCheckpointCount: 50,
        currentProblemCount: 100,
        createdAt: new Date(),
      });

      memberUser = await User.create({
        name: "테스트 멤버",
        handle: testMemberHandle,
        initialProblemCount: 0,
        dailyCheckpointCount: 50,
        currentProblemCount: 100,
        createdAt: new Date(),
      });

      // 테스트용 그룹 생성
      group = await Group.create({
        _id: testGroupId,
        groupName: "Test Group",
        admin: adminUser._id,
        members: [adminUser._id],
        description: "Test group description",
        createdAt: new Date(),
      });

      console.log("생성 완료");
    } catch (error) {
      console.error("생성 중 오류 발생:", error);
    }
  });

  afterAll(async () => {
    try {
      await Group.findByIdAndDelete(testGroupId);
      await User.deleteOne({ handle: testAdminHandle });
      await User.deleteOne({ handle: testMemberHandle });
    } catch (error) {
      console.error("삭제 중 오류 발생:", error);
    }
  });

  test("POST /api/v2/groups - 새 그룹 생성", async () => {
    const res = await request(app)
      .post("/api/v2/groups")
      .send({
        groupName: "Test Group",
        admin: adminUser._id,
      })
      .expect(201);

    expect(res.body.groupName).toBe("New Group");
  });

  test("GET /api/v2/groups - 그룹 목록 조회", async () => {
    const res = await request(app).get("/api/v2/groups").expect(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("GET /api/v2/groups/:groupId - 특정 그룹 정보 조회", async () => {
    const res = await request(app)
      .get(`/api/v2/groups/${group._id}`)
      .expect(200);
    expect(res.body.groupName).toBe("Test Group");
  });

  test("POST /api/v2/groups/:groupId/applications - 그룹 참가 신청", async () => {
    const res = await request(app)
      .post(`/api/v2/groups/${group._id}/applications`)
      .send({ userId: memberUser._id })
      .expect(201);

    expect(res.body.message).toBe("Application submitted");
  });

  test("POST /api/v2/groups/:groupId/applications/:userId/accept - 신청 승인", async () => {
    const res = await request(app)
      .post(`/api/v2/groups/${group._id}/applications/${memberUser._id}/accept`)
      .expect(200);

    expect(res.body.message).toBe("User accepted into the group");
  });

  test("POST /api/v2/groups/:groupId - 그룹 정보 수정", async () => {
    const res = await request(app)
      .post(`/api/v2/groups/${group._id}`)
      .send({ groupName: "Updated Test Group" })
      .expect(200);

    expect(res.body.groupName).toBe("Updated Test Group");
  });

  test("POST /api/v2/groups/:groupId/applications/:userId - 신청 거절", async () => {
    const res = await request(app)
      .post(`/api/v2/groups/${group._id}/applications/${memberUser._id}`)
      .expect(200);

    expect(res.body.message).toBe("Application rejected");
  });
});
