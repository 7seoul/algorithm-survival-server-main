const { User } = require("../../../models/User/User");
const { Group } = require("../../../models/Group/Group");

const get = {
  all: async (req, res) => {
    try {
      const { all } = req.query; // 검색어 받기

      if (!all) {
        return res.status(400).json({ error: "검색어를 입력하세요." });
      }

      const groupResults = await Group.aggregate([
        {
          $search: {
            index: "groupSearchIndex",
            autocomplete: {
              query: all,
              path: "groupName",
            },
          },
        },
        { $limit: 5 },
      ]);

      const userResults = await User.aggregate([
        {
          $search: {
            index: "userSearchIndex",
            autocomplete: {
              query: all,
              path: "name",
            },
          },
        },
        { $limit: 5 },
      ]);

      return res.status(200).json({
        success: true,
        results: [...groupResults, ...userResults],
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
