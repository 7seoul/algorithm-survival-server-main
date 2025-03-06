const solvedac = require("../apis/solvedac");
const { User } = require("../models/User/User");

async function start() {
  try {
    const users = await User.find({}, "handle saveCnt");
    // console.log(users);

    for (let i = 0; i < users.length; ++i) {
      const user = users[i];
      const curData = solvedac.scrapSolvedac(user.handle);
      const survival = (curData.cnt > user.saveCnt && user.survival);

      User.findOneAndUpdate(
        { _id: user._id },
        { $set: { curCnt: curData.cnt, tier: curData.tier, saveCnt: curData.cnt, survival: survival} }
      )
      .then(() => {
        console.log(`CHECK SURVIVAL : User "${user.handle}" checked`);
      })
      .catch((err) => {
        console.error(`CHECK SURVIVAL : Error checking user ${user.handle}:`, err);
      });
    }
  } catch (error) {
    console.error(`CHECK SURVIVAL : Error loading user:`, error.message);
  }
}

module.exports = {
  start,
};