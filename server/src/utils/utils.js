const { Group } = require("../models/Group/Group"); // Group 모델 가져오기

const tierList = {
  Unrated: 0,
  "Bronze V": 1,
  "Bronze IV": 2,
  "Bronze III": 3,
  "Bronze II": 4,
  "Bronze I": 5,
  "Silver V": 6,
  "Silver IV": 7,
  "Silver III": 8,
  "Silver II": 9,
  "Silver I": 10,
  "Gold V": 11,
  "Gold IV": 12,
  "Gold III": 13,
  "Gold II": 14,
  "Gold I": 15,
  "Platinum V": 16,
  "Platinum IV": 17,
  "Platinum III": 18,
  "Platinum II": 19,
  "Platinum I": 20,
  "Diamond V": 21,
  "Diamond IV": 22,
  "Diamond III": 23,
  "Diamond II": 24,
  "Diamond I": 25,
  "Ruby V": 26,
  "Ruby IV": 27,
  "Ruby III": 28,
  "Ruby II": 29,
  "Ruby I": 30,
  Master: 31,
};

const checkGroupRole = async (groupId, userId) => {
  const group = await Group.findOne({ _id: groupId });

  if (!group) {
    return { success: false };
  }

  // 어드민 확인
  if (group.admin.toString() === userId.toString()) {
    return { success: true, role: "admin", group };
  }

  // 멤버 여부 확인
  const isMember = group.members.some(member => member.toString() === userId.toString());

  if (isMember) {
    return { success: true, role: "member", group };
  }

  // 가입 신청 여부 확인
  const isApplicant = group.applications.some(applicant => applicant.toString() === userId.toString());

  if (isApplicant) {
    return { success: true, role: "applicant", group };
  }

  // 멤버가 아닌 경우
  return { success: true, role: "none", group };
};

module.exports = {
  tierList,
  checkGroupRole,
};
