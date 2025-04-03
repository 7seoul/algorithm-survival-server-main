const { User } = require("../../../models/User/User");
const { MemberData } = require("../../../models/Group/MemberData");
const solvedac = require("../../../apis/solvedac");
const scrap = require("../../../apis/scrap");
const autoUpdate = require("../../../services/autoUpdate");

const get = {
  info: async (req, res) => {
    try {
      const user = await User.findOne(
        { handle: req.params.handle },
        "-_id -__v -password -token -verificationCode -isVerified"
      );
      return res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, error: "서버 오류 발생" });
    }
  },
  all: async (req, res) => {
    try {
      const users = await User.find(
        {}, 
        "-_id -__v -password -token -verificationCode -isVerified"
      );
      return res.status(200).json({
        success: true,
        users,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, error: "서버 오류 발생" });
    }
  },
  updateInfo: async (req, res) => {
    try {
      console.time("scrap profile");
      const profile = await scrap.profile(req.params.handle);
      console.timeEnd("scrap profile");

      if (profile.success === false) {
        return res.status(200).json({
          success: false,
          message: "스크래핑에 실패하였습니다.",
        });
      }

      const initial = await User.findOne({handle: req.params.handle});

      let down = 0;
      let newStreak = initial.initialStreak;
      if (initial.initialStreak > profile.streak) {
        down = 1;
        newStreak = profile.streak;
      }

      console.log(profile);
      const user = await User.findOneAndUpdate(
        { handle: req.params.handle },
        {
          initialStreak: newStreak,
          currentStreak: profile.streak,
          currentSolved: profile.solved,
          tier: profile.tier,
        },
        { new: true },
      )
      .select("-_id -__v -password -token -verificationCode -isVerified")
      .populate("joinedGroupList", "groupName _id memberData");


      if (!user) {
        return res
          .status(404)
          .json({ success: false, error: "사용자를 찾을 수 없습니다." });
      }


      
      // 그룹에 유저 업데이트 정보 반영
      const groups = user.joinedGroupList;
      for (let group of groups) {
        await MemberData.findOneAndUpdate(
          { handle: user.handle, _id: { $in: group.memberData } }, // 해당 그룹의 memberData 중 유저 찾기
          {
            $set: {
              initialStreak: newStreak,
              currentStreak: profile.streak,
              currentSolved: profile.solved,
            },
            $inc: { downs: down },
          }
        );
        console.log(`그룹에 정보 반영 완료 : ${group.groupName}`);
      }

      return res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, error: "서버 오류 발생" });
    }
  },
};

const post = {
  edit: async (req, res) => {
    try {
      const user = await User.findOneAndUpdate(
        { handle: req.params.handle },
        {
          name: req.body.name,
        },
        { new: true }
      ).select("-_id -__v -password -token -verificationCode -isVerified");

      if (!user) {
        return res
          .status(404)
          .json({ success: false, error: "사용자를 찾을 수 없습니다." });
      }

      return res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, error: "서버 오류 발생" });
    }
  },
};

module.exports = {
  get,
  post,
};
