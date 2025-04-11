const { Group } = require("../models/Group/Group");

const checkRole = async (groupId, userId) => {
  if (userId === -1) {
    return { success: true, role: "none" };
  }

  const group = await Group.findOne(
    { _id: groupId },
    "admin applications memberData"
  ).populate("memberData", "user");

  if (!group) {
    return { success: false };
  }

  // 어드민 확인
  if (group.admin.toString() === userId.toString()) {
    return { success: true, role: "admin" };
  }

  // 멤버 여부 확인
  const isMember = group.memberData.some(
    (member) => member.user.toString() === userId.toString()
  );

  if (isMember) {
    return { success: true, role: "member" };
  }

  // 가입 신청 여부 확인
  const isApplicant = group.applications.some(
    (applicant) => applicant.toString() === userId.toString()
  );

  if (isApplicant) {
    return { success: true, role: "applicant" };
  }

  // 멤버가 아닌 경우
  return { success: true, role: "none" };
};

module.exports = {
  checkRole,
};
