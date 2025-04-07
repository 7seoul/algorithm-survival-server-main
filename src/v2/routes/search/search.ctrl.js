const { User } = require("../../../models/User/User");
const { Group } = require("../../../models/Group/Group");
const logger = require("../../../../logger");

const get = {
  all: async (req, res) => {
    try {
      const { all } = req.query; // 검색어 받기

      if (!all) {
        return res.status(400).json({ error: "검색어를 입력하세요." });
      }

      const groups = await Group.aggregate([
        {
          $search: {
            index: "groupSearchIndex",
            autocomplete: {
              query: all,
              path: "groupName",
            },
          },
        },

        {
          $project: {
            groupName: 1,
          },
        },
        { $limit: 10 },
      ]);

      const users = await User.aggregate([
        {
          $search: {
            index: "userSearchIndex",
            autocomplete: {
              query: all,
              path: "name",
            },
          },
        },
        {
          $project: {
            _id: 0,
            name: 1,
            handle: 1,
            tier: 1,
          },
        },
        { $limit: 10 },
      ]);

      return res.status(200).json({
        success: true,
        groups,
        users,
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
};
