const logger = require("../../../../logger");
const scrap = require("../../../apis/scrap");

const get = {
  scrap: async (req, res) => {
    try {
      const startTime = Date.now();
      const profile = await scrap.profile("xiaowuc1");
      const elapsedTime = Date.now() - startTime;

      return res.status(200).json({
        success: profile.success,
        time: `${elapsedTime}ms`,
      });
    } catch (error) {
      logger.error(`${error}`);
      return res
        .status(500)
        .json({ success: false, message: "서버 오류 발생" });
    }
  },
};

module.exports = {
  get,
};
