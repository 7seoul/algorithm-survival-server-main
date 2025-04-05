const { Group } = require("./src/models/Group/Group");
const { User } = require("./src/models/User/User");
const logger = require("./logger");

const migrateGroups = async () => {
  const result = await Group.updateMany(
    {
      $or: [
        { todaySolvedMembers: { $exists: false } },
        { todayAllSolved: { $exists: false } },
        { maxStreak: { $exists: false } },
      ],
    },
    {
      $set: {
        todaySolvedMembers: [],
        todayAllSolved: false,
        maxStreak: 0,
      },
    }
  );

  logger.info(
    `[MIGRATION] 그룹 필드 초기화 완료: ${result.modifiedCount}개 그룹 업데이트`
  );
};

const migrateUsers = async () => {
  const result = await User.updateMany(
    {
      $or: [{ maxStreak: { $exists: false } }],
    },
    {
      $set: {
        maxStreak: 0,
      },
    }
  );

  logger.info(
    `[MIGRATION] 유저 필드 초기화 완료: ${result.modifiedCount}개 유저 업데이트`
  );
};

module.exports = { migrateGroups, migrateUsers };
