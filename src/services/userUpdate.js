const scrap = require("../apis/scrap");
const { User } = require("../models/User/User");
const { Group } = require("../models/Group/Group");
const { MemberData } = require("../models/Group/MemberData");

const userUpdate = async (user) => {
  const timerLabel = `[USER UPDATE] "${
    user.handle
  }" (${process.hrtime.bigint()}) delay`;
  console.time(timerLabel);
  const profile = await scrap.profile(user.handle);
  console.timeEnd(timerLabel);

  if (profile.success === true) {
    try {
      const initial = await User.findOne({ handle: user.handle });

      let down = 0;
      let newStreak = initial.initialStreak;
      if (initial.initialStreak > profile.streak) {
        down = 1;
        newStreak = profile.streak;
      }

      const saved = await User.findOneAndUpdate(
        { handle: user.handle },
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
        .select("-_id joinedGroupList")
        .populate("joinedGroupList", "groupName _id memberData");

      console.log(`[USER UPDATE] "${user.handle}" profile updated`);

      const groups = saved.joinedGroupList;
      // 그룹에 유저 업데이트 정보 반영
      for (let group of groups) {
        const member = await MemberData.findOne(
          { handle: user.handle, _id: { $in: group.memberData } },
          { currentSolved: 1 }
        );

        if (!member) continue;

        const previousSolved = member.currentSolved;
        const solvedIncrease = profile.solved - previousSolved;

        // 유저 정보 업데이트
        await MemberData.findOneAndUpdate(
          { handle: user.handle, _id: { $in: group.memberData } },
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
          `[USER UPDATE] "${user.handle}" -> 그룹: "${group.groupName}" 점수 증가: ${solvedIncrease}`
        );
      }
    } catch (err) {
      console.error(`[USER UPDATE] "${user.handle}" Error updating user:`, err);
    }
  } else {
    console.log(`[USER UPDATE] "${user.handle}" FAIL TO SCRAPING.`);
  }
};

module.exports = {
  userUpdate,
};
