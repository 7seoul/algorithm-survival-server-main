const { User } = require("../../../models/User/User");
const { Group } = require("../../../models/Group/Group");

const get = {
  all: async (req, res) => {
    try {
      return res.status(200).json({
        success: true,
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
