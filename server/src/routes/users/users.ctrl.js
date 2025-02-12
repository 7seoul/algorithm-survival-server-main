const { User } = require("../../models/User/User");
const api = require("./api");

const get = {
  stats: async (req, res) => {
    try {
      // solved.ac 파싱
      const solvedacData = await api.scrapSolvedac(req.query.handle);

      // solved.ac api
      const apiCnt = await api.getSolvedacProblem(req.query.handle);
      const apiTier = await api.getSolvedacProfile(req.query.handle);

      console.log(apiCnt, apiTier);

      await User.updateOne(
        { tier: solvedacData.tier },
        { curCnt: solvedacData.cnt }
      ).then(() => {
        return res.status(200).json({
          success: true,
          user: solvedacData,
        });
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, error: "Failed to update" });
    }
  },
  updateAll: (req, res) => {},
};

const post = {
  register: async (req, res) => {
    try {
      // 테스트용 컬렉션 초기화
      await User.deleteMany({});
      const existingUser = await User.findOne({ handle: req.body.handle });

      if (existingUser) {
        return res.status(200).json({
          success: false,
          message: "이미 등록된 아이디 입니다.",
        });
      }

      // solved.ac 파싱
      const solvedacData = await api.scrapSolvedac(req.body.handle);

      // 등록된 유저 수
      const number = await User.countDocuments({});

      const userData = {
        handle: req.body.handle,
        name: req.body.name,
        local: req.body.local,
        number: number + 1,
        survival: true,
        tier: solvedacData.tier,
        startCnt: solvedacData.cnt,
        curCnt: solvedacData.cnt,
      };

      const user = await new User(userData);

      await user.save().then((user) => {
        return res.status(200).json({
          success: true,
          user: user,
        });
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, error: "Failed to register" });
    }
  },
};

module.exports = {
  get,
  post,
};
