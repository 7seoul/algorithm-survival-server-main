const { Group } = require("./src/models/Group/Group");
const { MemberData } = require("./src/models/Group/MemberData");
const { User } = require("./src/models/User/User");
const { UserVerification } = require("./src/models/User/UserVerification");
const logger = require("./logger");

const migrateGroups = async () => {
  const result = await Group.updateMany(
    {
      $or: [{ members: { $exists: true } }],
    },
    {
      $unset: {
        members: "",
      },
    },
    { strict: false }
  );

  logger.info(
    `[MIGRATION] 그룹 마이그레이션 완료: ${result.modifiedCount}개 그룹 업데이트`
  );
};

const migrateMemberDatas = async () => {
  const result = await MemberData.updateMany(
    {
      $or: [
        { currentStreak: { $exists: true } },
        { currentSolved: { $exists: true } },
      ],
    },
    {
      $unset: {
        currentStreak: "",
        currentSolved: "",
      },
    },
    { strict: false }
  );

  logger.info(
    `[MIGRATION] 멤버데이터 마이그레이션 완료: ${result.modifiedCount}개 멤버데이터 업데이트`
  );
};

const migrateUsers = async () => {
  const result = await User.updateMany(
    {
      $or: [
        { verificationCode: { $exists: true } },
        { isVerified: { $exists: true } },
      ],
    },
    {
      $unset: {
        verificationCode: "",
        isVerified: "",
      },
    },
    { strict: false }
  );

  logger.info(
    `[MIGRATION] 유저 마이그레이션 완료: ${result.modifiedCount}개 유저 업데이트`
  );
};

const migrateUserVerifications = async () => {
  const users = await User.find({}, "handle");

  let created = 0;
  for (const user of users) {
    const exists = await UserVerification.findOne({ handle: user.handle });
    if (exists) continue;

    await UserVerification.create({
      handle: user.handle,
      verificationCode: "",
      isVerified: true,
    });

    created++;
  }

  logger.info(`[MIGRATION] UserVerification 생성 완료: ${created}개 생성됨`);
};

module.exports = {
  migrateGroups,
  migrateMemberDatas,
  migrateUsers,
  migrateUserVerifications,
};
