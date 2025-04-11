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
  const memberDatas = await MemberData.find({});

  console.log(memberDatas);

  let updatedCount = 0;

  for (const member of memberDatas) {
    const handle = member.handle;

    const user = await User.findOne({ handle });

    if (!user) {
      console.warn(`[WARN] 사용자 ${handle} 찾을 수 없음`);
      continue;
    }

    await MemberData.updateOne(
      { _id: member._id },
      {
        $set: { user: user._id },
        $unset: { handle: "", name: "" },
      },
      { strict: false }
    );

    updatedCount++;
  }

  logger.info(`[MIGRATION] ${updatedCount}개의 MemberData 업데이트 완료`);
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
