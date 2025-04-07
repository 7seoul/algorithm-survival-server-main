const { User } = require("../../../models/User/User");
const { Group } = require("../../../models/Group/Group");
const logger = require("../../../../logger");

const get = {
  usersStreak: async (req, res) => {
    try {
      const users = await User.find({})
        .select(
          "-_id name handle tier initialSolved currentSolved initialStreak currentStreak maxStreak"
        )
        .lean();

      const result = users
        .map((user) => ({
          name: user.name,
          handle: user.handle,
          tier: user.tier,
          solved: user.currentSolved - user.initialSolved,
          currentStreak: user.currentStreak - user.initialStreak,
          maxStreak: user.maxStreak,
        }))
        .sort((a, b) => b.maxStreak - a.maxStreak);

      return res.status(200).json({
        success: true,
        result,
      });
    } catch (error) {
      logger.error(error);
      return res
        .status(500)
        .json({ success: false, message: "서버 오류 발생" });
    }
  },
  usersScore: async (req, res) => {
    try {
      const users = await User.find({})
        .select(
          "-_id name handle tier initialSolved currentSolved initialStreak currentStreak maxStreak"
        )
        .lean();

      const result = users
        .map((user) => ({
          name: user.name,
          handle: user.handle,
          tier: user.tier,
          solved: user.currentSolved - user.initialSolved,
          currentStreak: user.currentStreak - user.initialStreak,
          maxStreak: user.maxStreak,
        }))
        .sort((a, b) => b.solved - a.solved);

      return res.status(200).json({
        success: true,
        result,
      });
    } catch (error) {
      logger.error(error);
      return res
        .status(500)
        .json({ success: false, message: "서버 오류 발생" });
    }
  },
  groupsStreak: async (req, res) => {
    try {
      const groups = await Group.find({})
        .select("groupName handle tier score currentStreak maxStreak")
        .lean();

      const result = groups
        .map((group) => ({
          _id: group._id,
          groupName: group.groupName,
          score: group.score,
          currentStreak: group.currentStreak,
          maxStreak: group.maxStreak,
        }))
        .sort((a, b) => b.maxStreak - a.maxStreak);

      return res.status(200).json({
        success: true,
        result,
      });
    } catch (error) {
      logger.error(error);
      return res
        .status(500)
        .json({ success: false, message: "서버 오류 발생" });
    }
  },
  groupsScore: async (req, res) => {
    try {
      const groups = await Group.find({})
        .select("groupName handle tier score currentStreak maxStreak")
        .lean();

      const result = groups
        .map((group) => ({
          _id: group._id,
          groupName: group.groupName,
          score: group.score,
          currentStreak: group.currentStreak,
          maxStreak: group.maxStreak,
        }))
        .sort((a, b) => b.score - a.score);

      return res.status(200).json({
        success: true,
        result,
      });
    } catch (error) {
      logger.error(error);
      return res
        .status(500)
        .json({ success: false, message: "서버 오류 발생" });
    }
  },
  groupsMain: async (req, res) => {
    const groups = await Group.find({})
      .select("groupName handle tier score currentStreak maxStreak")
      .lean();

    const score = groups
      .map((group) => ({
        _id: group._id,
        groupName: group.groupName,
        score: group.score,
        currentStreak: group.currentStreak,
        maxStreak: group.maxStreak,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    const streak = groups
      .map((group) => ({
        _id: group._id,
        groupName: group.groupName,
        score: group.score,
        currentStreak: group.currentStreak,
        maxStreak: group.maxStreak,
      }))
      .sort((a, b) => b.maxStreak - a.maxStreak)
      .slice(0, 3);

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
