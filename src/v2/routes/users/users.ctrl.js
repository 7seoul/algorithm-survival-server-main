const { User } = require("../../../models/User/User");
const { userUpdateByScrap } = require("../../../services/userUpdate");
const logger = require("../../../../logger");
const moment = require("moment-timezone");

const get = {
  info: async (req, res) => {
    try {
      const user = await User.findOne(
        { handle: req.params.handle },
        "-_id -__v -password -token"
      ).populate("joinedGroupList", "groupName score");

      const userScore = user.score;
      const userMaxStreak = user.maxStreak;

      const scoreRank =
        (await User.countDocuments({ score: { $gt: userScore } })) + 1;
      const streakRank =
        (await User.countDocuments({ maxStreak: { $gt: userMaxStreak } })) + 1;

      const userObj = user.toObject();

      userObj.scoreRank = scoreRank;
      userObj.streakRank = streakRank;
      userObj.createdAt = moment(user.createdAt).tz("Asia/Seoul").format();
      userObj.updatedAt = moment(user.updatedAt).tz("Asia/Seoul").format();

      return res.status(200).json({
        success: true,
        user: userObj,
      });
    } catch (error) {
      logger.error(error);
      return res
        .status(500)
        .json({ success: false, message: "서버 오류 발생" });
    }
  },
  all: async (req, res) => {
    try {
      const users = await User.find({}, "-_id -__v -password -token");
      return res.status(200).json({
        success: true,
        users,
      });
    } catch (error) {
      logger.error(error);
      return res
        .status(500)
        .json({ success: false, message: "서버 오류 발생" });
    }
  },
  updateInfo: async (req, res) => {
    try {
      const user = await userUpdateByScrap(req.params.handle);

      if (!user) {
        return res
          .status(200)
          .json({ success: false, message: "스크래핑에 실패하였습니다." });
      }

      const userScore = user.score;
      const userMaxStreak = user.maxStreak;

      const scoreRank =
        (await User.countDocuments({ score: { $gt: userScore } })) + 1;
      const streakRank =
        (await User.countDocuments({ maxStreak: { $gt: userMaxStreak } })) + 1;

      const userObj = user.toObject();

      delete userObj._id;
      userObj.joinedGroupList.forEach((group) => {
        delete group.memberData;
      });

      userObj.scoreRank = scoreRank;
      userObj.streakRank = streakRank;
      userObj.createdAt = moment(user.createdAt).tz("Asia/Seoul").format();
      userObj.updatedAt = moment(user.updatedAt).tz("Asia/Seoul").format();

      return res.status(200).json({
        success: true,
        user: userObj,
      });
    } catch (error) {
      logger.error(error);
      return res
        .status(500)
        .json({ success: false, message: "서버 오류 발생" });
    }
  },
};

const post = {
  edit: async (req, res) => {
    try {
      if (req.user.handle !== req.params.handle) {
        return res.status(200).json({
          success: false,
          message: "권한이 없습니다.",
        });
      }

      const user = await User.findOneAndUpdate(
        { handle: req.params.handle },
        {
          name: req.body.name,
        },
        { new: true }
      )
        .select("-_id -__v -password -token")
        .populate("joinedGroupList", "groupName score");

      const userScore = user.score;
      const userMaxStreak = user.maxStreak;

      const scoreRank =
        (await User.countDocuments({ score: { $gt: userScore } })) + 1;
      const streakRank =
        (await User.countDocuments({ maxStreak: { $gt: userMaxStreak } })) + 1;

      const userObj = user.toObject();

      userObj.scoreRank = scoreRank;
      userObj.streakRank = streakRank;
      userObj.createdAt = moment(user.createdAt).tz("Asia/Seoul").format();
      userObj.updatedAt = moment(user.updatedAt).tz("Asia/Seoul").format();

      return res.status(200).json({
        success: true,
        user: userObj,
      });
    } catch (error) {
      logger.error(error);
      return res
        .status(500)
        .json({ success: false, message: "서버 오류 발생" });
    }
  },
};

module.exports = {
  get,
  post,
};
