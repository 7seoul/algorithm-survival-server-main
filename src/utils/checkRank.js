const { User } = require("../models/User/User");

const userRank = async (user) => {
  const userIdStr = user._id.toString();

  const [usersScore, usersCount, usersStreak] = await Promise.all([
    User.find({}).sort({ score: -1 }).select("_id").lean(),
    User.find({}).sort({ count: -1 }).select("_id").lean(),
    User.find({}).sort({ maxStreak: -1 }).select("_id").lean(),
  ]);

  const scoreRank =
    usersScore.findIndex((u) => u._id.toString() === userIdStr) + 1;
  const countRank =
    usersCount.findIndex((u) => u._id.toString() === userIdStr) + 1;
  const streakRank =
    usersStreak.findIndex((u) => u._id.toString() === userIdStr) + 1;

  user.scoreRank = scoreRank;
  user.countRank = countRank;
  user.streakRank = streakRank;

  return user;
};

module.exports = {
  userRank,
};
