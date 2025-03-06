const { User } = require("../../models/User/User");
const solvedac = require("../../apis/solvedac");
const update = require("../../services/update");

const get = {
  stats: async (req, res) => {
    try {
      // solved.ac 파싱
      console.time("scraping");
      const solvedacData = await solvedac.scrapSolvedac(req.query.handle);
      console.timeEnd("scraping");

      // solved.ac api
      // console.time("solvedac-api");
      // const apiCnt = await solvedac.getSolvedacProblem(req.query.handle);
      // const apiTier = await solvedac.getSolvedacProfile(req.query.handle);
      // console.timeEnd("solvedac-api");

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
  all: async (req, res) => {
    try {
      const users = await User.find({}, "-_id -__v");
      return res.status(200).json({
        success: true,
        users,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, error: "Failed to update all" });
    }
  },
};

const post = {
  register: async (req, res) => {
    try {
      // 테스트용 컬렉션 초기화
      // await User.deleteMany({});
      const existingUser = await User.findOne({ handle: req.body.handle });

      if (existingUser) {
        return res.status(200).json({
          success: false,
          message: "이미 등록된 아이디 입니다.",
        });
      }

      // solved.ac 파싱
      const solvedacData = await solvedac.scrapSolvedac(req.body.handle);

      console.log(solvedacData);

      if (solvedacData.tier === undefined || solvedacData.cnt === undefined) {
        return res.status(200).json({
          success: false,
          message: "정보를 불러오는데 실패했습니다.",
        });
      }

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
        saveCnt: solvedacData.cnt,
        curCnt: solvedacData.cnt,
        imgSrc: solvedacData.imgSrc,
        bio: solvedacData.bio,
      };

      const user = await new User(userData);

      await user.save().then((user) => {
        // 업데이트 큐에 신규 유저 추가
        update.addUserInQueue(user.handle);

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
