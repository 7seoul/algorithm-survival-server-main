const scrap = require("../apis/scrap");
const solvedac = require("../apis/solvedac");
const { User } = require("../models/User/User");
const { Group } = require("../models/Group/Group");
const { MemberData } = require("../models/Group/MemberData");
const logger = require("../../logger");
const timer = require("../utils/timer");

const userUpdateByScrap = async (handle) => {
  const label = `[USER UPDATE] "${handle}"`;
  timer.start(label);
  const profile = await scrap.profile(handle);
  timer.end(label, logger);

  if (profile.success === true) {
    try {
      const initial = await User.findOne({ handle: handle });

      let down = 0;
      let newStreak = initial.initialStreak;
      if (initial.initialStreak > profile.streak) {
        down = 1;
        newStreak = profile.streak;
      }

      const saved = await User.findOneAndUpdate(
        { handle: handle },
        {
          $set: {
            initialStreak: newStreak,
            currentStreak: profile.streak,
            currentSolved: profile.solved,
            imgSrc: profile.imgSrc,
            tier: profile.tier,
          },
        },
        { new: true }
      )
        .select("-_id -__v -password -token -verificationCode -isVerified")
        .populate("joinedGroupList", "groupName _id memberData");

      logger.info(`[USER UPDATE] "${handle}" profile updated`);

      const groups = saved.joinedGroupList;
      // 그룹에 유저 업데이트 정보 반영
      for (let group of groups) {
        const member = await MemberData.findOne(
          { handle: handle, _id: { $in: group.memberData } },
          { currentSolved: 1 }
        );

        if (!member) continue;

        const previousSolved = member.currentSolved;
        const solvedIncrease = profile.solved - previousSolved;

        // 유저 정보 업데이트
        await MemberData.findOneAndUpdate(
          { handle: handle, _id: { $in: group.memberData } },
          {
            $set: {
              initialStreak: newStreak,
              currentStreak: profile.streak,
              currentSolved: profile.solved,
            },
            $inc: { downs: down },
          }
        );

        // 그룹 점수 업데이트
        if (solvedIncrease > 0) {
          await Group.findByIdAndUpdate(group._id, {
            $inc: { score: solvedIncrease },
          });
        }

        logger.info(
          `[USER UPDATE] "${handle}" -> 그룹: "${group.groupName}" 점수 증가: ${solvedIncrease}`
        );
      }
      return saved;
    } catch (err) {
      logger.error(`[USER UPDATE] "${handle}" Error updating user:`, err);
    }
  } else {
    logger.info(`[USER UPDATE] "${handle}" FAIL TO SCRAPING.`);
  }
};

const userUpdateBySolvedac = async (handle) => {
  const timerLabel = `[USE SOLVEDAC API] "${handle}" (${process.hrtime.bigint()}) delay`;
  console.time(timerLabel);
  const profile = await solvedac.profile(handle);
  const streak = await solvedac.grass(handle);
  console.timeEnd(timerLabel);

  if (profile && streak !== undefined) {
    try {
      const initial = await User.findOne({ handle: handle });

      let down = 0;
      let newStreak = initial.initialStreak;
      if (initial.initialStreak > streak) {
        down = 1;
        newStreak = streak;
      }

      const saved = await User.findOneAndUpdate(
        { handle: handle },
        {
          $set: {
            initialStreak: newStreak,
            currentStreak: streak,
            currentSolved: profile.solvedCount,
            imgSrc: profile.profileImageUrl,
            tier: profile.tier,
          },
        },
        { new: true }
      )
        .select("-__v -password -token -verificationCode -isVerified")
        .populate("joinedGroupList", "groupName _id memberData");

      logger.info(`[USE SOLVEDAC API] "${handle}" profile updated`);

      const groups = saved.joinedGroupList;
      // 그룹에 유저 업데이트 정보 반영
      for (let group of groups) {
        const member = await MemberData.findOne(
          { handle: handle, _id: { $in: group.memberData } },
          { currentSolved: 1 }
        );

        if (!member) continue;

        const previousSolved = member.currentSolved;
        const solvedIncrease = profile.solvedCount - previousSolved;

        // 유저 정보 업데이트
        await MemberData.findOneAndUpdate(
          { handle: handle, _id: { $in: group.memberData } },
          {
            $set: {
              initialStreak: newStreak,
              currentStreak: streak,
              currentSolved: profile.solvedCount,
            },
            $inc: { downs: down },
          }
        );

        // 그룹 점수 업데이트
        if (solvedIncrease > 0) {
          await Group.findByIdAndUpdate(group._id, {
            $inc: { score: solvedIncrease },
          });
        }

        logger.info(
          `[USE SOLVEDAC API] "${handle}" -> 그룹: "${group.groupName}" 점수 증가: ${solvedIncrease}`
        );
      }
      return saved;
    } catch (err) {
      logger.error(`[USE SOLVEDAC API] "${handle}" Error updating user:`, err);
    }
  } else {
    logger.info(`[USE SOLVEDAC API] "${handle}" FAIL TO SCRAPING.`);
  }
};

module.exports = {
  userUpdateByScrap,
  userUpdateBySolvedac,
};
