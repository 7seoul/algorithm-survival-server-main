const { User } = require("../../../models/User/User");
const { Group } = require("../../../models/Group/Group");
const logger = require("../../../../logger");

const get = {
  usersScore: async (req, res) => {
    try {
      const result = await User.find({})
        .select("-_id name handle tier score imgSrc")
        .sort({ score: -1 })
        .lean();

      return res.status(200).json({
        success: true,
        result,
      });
    } catch (error) {
      logger.error(`${error}`);
      return res
        .status(500)
        .json({ success: false, message: "서버 오류 발생" });
    }
  },
  usersCount: async (req, res) => {
    try {
      const result = await User.find({})
        .select("-_id name handle tier count imgSrc")
        .sort({ count: -1 })
        .lean();

      return res.status(200).json({
        success: true,
        result,
      });
    } catch (error) {
      logger.error(`${error}`);
      return res
        .status(500)
        .json({ success: false, message: "서버 오류 발생" });
    }
  },
  usersStreak: async (req, res) => {
    try {
      const result = await User.find({})
        .select("-_id name handle tier maxStreak imgSrc")
        .sort({ maxStreak: -1 })
        .lean();

      return res.status(200).json({
        success: true,
        result,
      });
    } catch (error) {
      logger.error(`${error}`);
      return res
        .status(500)
        .json({ success: false, message: "서버 오류 발생" });
    }
  },
  groupsScore: async (req, res) => {
    try {
      const result = await Group.find({})
        .select("groupName handle score")
        .sort({ score: -1 })
        .lean();

      return res.status(200).json({
        success: true,
        result,
      });
    } catch (error) {
      logger.error(`${error}`);
      return res
        .status(500)
        .json({ success: false, message: "서버 오류 발생" });
    }
  },
  groupsCount: async (req, res) => {
    try {
      const result = await Group.find({})
        .select("groupName handle count")
        .sort({ count: -1 })
        .lean();

      return res.status(200).json({
        success: true,
        result,
      });
    } catch (error) {
      logger.error(`${error}`);
      return res
        .status(500)
        .json({ success: false, message: "서버 오류 발생" });
    }
  },
  groupsStreak: async (req, res) => {
    try {
      const result = await Group.find({})
        .select("groupName handle maxStreak")
        .sort({ maxStreak: -1 })
        .lean();

      return res.status(200).json({
        success: true,
        result,
      });
    } catch (error) {
      logger.error(`${error}`);
      return res
        .status(500)
        .json({ success: false, message: "서버 오류 발생" });
    }
  },
  groupsMain: async (req, res) => {
    const groups = await Group.find({})
      .select("groupName _id description score maxStreak size")
      .lean();

    const score = groups.sort((a, b) => b.score - a.score).slice(0, 3);

    const streak = groups.sort((a, b) => b.maxStreak - a.maxStreak).slice(0, 3);

    return res.status(200).json({
      success: true,
      score,
      streak,
    });
  },
};

module.exports = {
  get,
};
