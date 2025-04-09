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
      const initUser = await User.findOne({ handle: handle });

      let down = 0;
      let newStreak = initUser.initialStreak;
      if (initUser.initialStreak > profile.streak) {
        down = 1;
        newStreak = profile.streak;
      }

      const updateFields = {
        initialStreak: newStreak,
        currentStreak: profile.streak,
        currentSolved: profile.solved,
        score: profile.solved - initUser.initialSolved,
        imgSrc: profile.imgSrc,
        tier: profile.tier,
      };

      // maxStreak 갱신 조건
      if (
        !initUser.maxStreak ||
        profile.streak - initUser.initialStreak > initUser.maxStreak
      ) {
        updateFields.maxStreak = profile.streak - initUser.initialStreak;
      }

      const saved = await User.findOneAndUpdate(
        { handle: handle },
        { $set: updateFields },
        { new: true }
      )
        .select("-_id -__v -password -token -verificationCode")
        .populate("joinedGroupList", "groupName _id memberData");

      logger.info(`[USER UPDATE] "${handle}" profile updated`);

      const groups = saved.joinedGroupList;
      // 그룹에 유저 업데이트 정보 반영
      for (let group of groups) {
        const member = await MemberData.findOne({
          handle,
          _id: { $in: group.memberData },
        });

        if (!member) continue;

        const solvedIncrease = profile.solved - member.currentSolved;
        if (solvedIncrease <= 0) continue;

        // 유저 정보 업데이트
        const memberUpdateResult = await MemberData.updateOne(
          {
            _id: member._id,
            currentSolved: member.currentSolved,
          },
          {
            $set: {
              initialStreak: newStreak,
              currentStreak: profile.streak,
              currentSolved: profile.solved,
              score: profile.solved - member.initialSolved,
              downs: member.downs + down,
            },
          }
        );

        // 그룹 점수 업데이트
        if (memberUpdateResult.modifiedCount > 0) {
          const updatedGroup = await Group.findByIdAndUpdate(
            group._id,
            {
              $set: {
                score: group.score + solvedIncrease,
              },
              $addToSet: { todaySolvedMembers: initUser._id },
            },
            { new: true }
          ).select(
            "todayAllSolved todaySolvedMembers members currentStreak maxStreak size"
          );

          const totalMembers = updatedGroup.size;
          const solvedCount = updatedGroup.todaySolvedMembers.length;

          if (solvedCount === totalMembers && !updatedGroup.todayAllSolved) {
            // streak 증가
            const newGroupStreak = updatedGroup.currentStreak + 1;

            await Group.findByIdAndUpdate(group._id, {
              $set: {
                currentStreak: newGroupStreak,
                maxStreak: Math.max(newGroupStreak, updatedGroup.maxStreak),
                todayAllSolved: true,
              },
            });

            logger.info(`[USER UPDATE] 그룹 "${group.groupName}" streak 증가`);
          }
        }

        logger.info(
          `[USER UPDATE] "${handle}" -> 그룹: "${group.groupName}" 점수 증가: ${solvedIncrease}`
        );
      }
      return saved;
    } catch (error) {
      logger.error(`[USER UPDATE] "${handle}" Error updating user:`, error);
    }
  } else {
    logger.warn(`[USER UPDATE] "${handle}" FAIL TO SCRAPING.`);
  }
};

const userUpdateBySolvedac = async (handle) => {
  const label = `[USE SOLVEDAC API] "${handle}"`;
  timer.start(label);
  const profile = await solvedac.profile(handle);
  const streak = await solvedac.grass(handle);
  timer.end(label, logger);

  if (profile && streak !== undefined) {
    try {
      const initUser = await User.findOne({ handle: handle });

      let down = 0;
      let newStreak = initUser.initialStreak;
      if (initUser.initialStreak > streak) {
        down = 1;
        newStreak = streak;
      }

      const updateFields = {
        initialStreak: newStreak,
        currentStreak: streak,
        currentSolved: profile.solvedCount,
        score: profile.solvedCount - initUser.initialSolved,
        imgSrc: profile.profileImageUrl,
        tier: profile.tier,
      };

      // maxStreak 갱신 조건
      if (
        !initUser.maxStreak ||
        streak - initUser.initialStreak > initUser.maxStreak
      ) {
        updateFields.maxStreak = streak - initUser.initialStreak;
      }

      const saved = await User.findOneAndUpdate(
        { handle: handle },
        { $set: updateFields },
        { new: true }
      )
        .select("-_id -__v -password -token -verificationCode")
        .populate("joinedGroupList", "groupName _id memberData");

      logger.info(`[USER UPDATE] "${handle}" profile updated`);

      const groups = saved.joinedGroupList;
      // 그룹에 유저 업데이트 정보 반영
      for (let group of groups) {
        const member = await MemberData.findOne({
          handle,
          _id: { $in: group.memberData },
        });

        if (!member) continue;

        const solvedIncrease = profile.solvedCount - member.currentSolved;
        if (solvedIncrease <= 0) continue;

        // 유저 정보 업데이트
        const memberUpdateResult = await MemberData.updateOne(
          {
            _id: member._id,
            currentSolved: member.currentSolved,
          },
          {
            $set: {
              initialStreak: newStreak,
              currentStreak: streak,
              currentSolved: profile.solvedCount,
              score: profile.solvedCount - member.initialSolved,
              downs: member.downs + down,
            },
          }
        );

        // 그룹 점수 업데이트
        if (memberUpdateResult.modifiedCount > 0) {
          const updatedGroup = await Group.findByIdAndUpdate(
            group._id,
            {
              $set: {
                score: group.score + solvedIncrease,
              },
              $addToSet: { todaySolvedMembers: initUser._id },
            },
            { new: true }
          ).select(
            "todayAllSolved todaySolvedMembers members currentStreak maxStreak size"
          );

          const totalMembers = updatedGroup.size;
          const solvedCount = updatedGroup.todaySolvedMembers.length;

          if (solvedCount === totalMembers && !updatedGroup.todayAllSolved) {
            // streak 증가
            const newGroupStreak = updatedGroup.currentStreak + 1;

            await Group.findByIdAndUpdate(group._id, {
              $set: {
                currentStreak: newGroupStreak,
                maxStreak: Math.max(newGroupStreak, updatedGroup.maxStreak),
                todayAllSolved: true,
              },
            });

            logger.info(`[USER UPDATE] 그룹 "${group.groupName}" streak 증가`);
          }
        }

        logger.info(
          `[USER UPDATE] "${handle}" -> 그룹: "${group.groupName}" 점수 증가: ${solvedIncrease}`
        );
      }
      return saved;
    } catch (error) {
      logger.error(
        `[USE SOLVEDAC API] "${handle}" Error updating user:`,
        error
      );
    }
  } else {
    logger.warn(`[USE SOLVEDAC API] "${handle}" FAIL TO SCRAPING.`);
  }
};

module.exports = {
  userUpdateByScrap,
  userUpdateBySolvedac,
};
