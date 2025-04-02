const { User } = require("../../../models/User/User");
const { Group } = require("../../../models/Group/Group");

const get = {
  usersStreak: async (req, res) => {
    try {
      const users = await User.find({})
        .select("-_id name handle tier initialStreak currentStreak")
        .lean();

      const result = users
        .map((user) => ({
          name: user.name,
          handle: user.handle,
          tier: user.tier,
          streak: user.currentStreak - user.initialStreak,
        }))
        .sort((a, b) => b.streak - a.streak);

      return res.status(200).json({
        success: true,
        result,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, error: "서버 오류 발생" });
    }
  },
  usersScore: async (req, res) => {
    try {
      const users = await User.find({})
        .select("-_id name handle tier initialSolved currentSolved")
        .lean();

      const result = users
        .map((user) => ({
          name: user.name,
          handle: user.handle,
          tier: user.tier,
          solved: user.currentSolved - user.initialSolved,
        }))
        .sort((a, b) => b.solved - a.solved);

      return res.status(200).json({
        success: true,
        result,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, error: "서버 오류 발생" });
    }
  },
  groupsStreak: async (req, res) => {
    try {
      const groups = await Group.find({})
        .select("groupName handle tier initialStreak currentStreak")
        .lean();

      const result = groups
        .map((group) => ({
          _id: group._id,
          groupName: group.groupName,
          streak: group.currentStreak - group.initialStreak,
        }))
        .sort((a, b) => b.streak - a.streak);

      return res.status(200).json({
        success: true,
        result,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, error: "서버 오류 발생" });
    }
  },
  groupsScore: async (req, res) => {
    try {
      const groups = await Group.find({})
        .select("groupName handle tier score")
        .lean();

      const result = groups.sort((a, b) => b.score - a.score);

      return res.status(200).json({
        success: true,
        result,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, error: "서버 오류 발생" });
    }
  },
};
module.exports = {
  get,
};
