const { Group } = require("../models/Group/Group");

const checkRole = async (groupId, userId) => {
  if (userId === -1) {
    return { success: true, role: "none" };
  }

  const group = await Group.findOne({ _id: groupId });

  if (!group) {
    return { success: false };
  }

  // 어드민 확인
  if (group.admin.toString() === userId.toString()) {
    return { success: true, role: "admin", group };
  }

  // 멤버 여부 확인
  const isMember = group.members.some(
    (member) => member.toString() === userId.toString()
  );

  if (isMember) {
    return { success: true, role: "member", group };
  }

  // 가입 신청 여부 확인
  const isApplicant = group.applications.some(
    (applicant) => applicant.toString() === userId.toString()
  );

  if (isApplicant) {
    return { success: true, role: "applicant", group };
  }

  // 멤버가 아닌 경우
  return { success: true, role: "none", group };
};

module.exports = {
  checkRole,
};
