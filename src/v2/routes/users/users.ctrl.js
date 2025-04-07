const { User } = require("../../../models/User/User");
const { MemberData } = require("../../../models/Group/MemberData");
const solvedac = require("../../../apis/solvedac");
const scrap = require("../../../apis/scrap");
const autoUpdate = require("../../../services/autoUpdate");
const { userUpdateByScrap } = require("../../../services/userUpdate");
const logger = require("../../../../logger");

const get = {
  info: async (req, res) => {
    try {
      const user = await User.findOne(
        { handle: req.params.handle },
        "-_id -__v -password -token -verificationCode"
      ).populate("joinedGroupList", "groupName score");
      return res.status(200).json({
        success: true,
        user,
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
      const users = await User.find(
        {},
        "-_id -__v -password -token -verificationCode"
      );
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
          .json({ success: false, message: "업데이트에 실패했습니다." });
      }

      return res.status(200).json({
        success: true,
        user,
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
      const user = await User.findOneAndUpdate(
        { handle: req.params.handle },
        {
          name: req.body.name,
        },
        { new: true }
      ).select("-_id -__v -password -token -verificationCode");

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "사용자를 찾을 수 없습니다." });
      }

      return res.status(200).json({
        success: true,
        user,
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
