const scrap = require("../apis/scrap");
const { User } = require("../models/User/User");
const { Group } = require("../models/Group/Group");
const { MemberData } = require("../models/Group/MemberData");

const userUpdate = async (handle) => {
  const timerLabel = `[USER UPDATE] "${handle}" (${process.hrtime.bigint()}) delay`;
  console.time(timerLabel);
  const profile = await scrap.profile(handle);
  console.timeEnd(timerLabel);

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
            tier: profile.tier,
          },
        },
        { new: true }
      )
        .select("-_id -__v -password -token -verificationCode -isVerified")
        .populate("joinedGroupList", "groupName _id memberData");

      console.log(`[USER UPDATE] "${handle}" profile updated`);

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

        console.log(
          `[USER UPDATE] "${handle}" -> 그룹: "${group.groupName}" 점수 증가: ${solvedIncrease}`
        );
      }
      return saved;
    } catch (err) {
      console.error(`[USER UPDATE] "${handle}" Error updating user:`, err);
    }
  } else {
    console.log(`[USER UPDATE] "${handle}" FAIL TO SCRAPING.`);
  }
};

module.exports = {
  userUpdate,
};
