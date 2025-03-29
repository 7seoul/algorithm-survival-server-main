const { User } = require("../../../models/User/User");
const solvedac = require("../../../apis/solvedac");
const update = require("../../../services/update");

const get = {
  me: async (req, res) => {
    try {
      const handle = req.body.handle;
      const user = await User.findOne({ handle });

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "찾을 수 없는 아이디 입니다." });
      }

      return res.status(200).json({ success: true, user });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, error: "서버 오류 발생" });
    }
  },
};

const post = {
  login: async (req, res) => {
    try {
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, error: "서버 오류 발생" });
    }
  },
  register: async (req, res) => {
    try {
      const existingUser = await User.findOne({ handle: req.body.handle });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "이미 등록된 아이디 입니다.",
        });
      }

      // solved.ac 파싱
      const solvedacData = await solvedac.scrapSolvedac(req.body.handle);

      console.log(solvedacData);

      if (
        solvedacData.tier === undefined ||
        solvedacData.cnt === undefined ||
        solvedacData.imgSrc === undefined ||
        solvedacData.bio === undefined
      ) {
        return res.status(300).json({
          success: false,
          message: "정보를 불러오는데 실패했습니다.",
        });
      }

      const createdAt = new Date().setHours(new Date().getHours() + 9);

      const userData = {
        name: req.body.name,
        handle: req.body.handle,
        password: req.body.password,
        survival: true,
        initialProblemCount: solvedacData.cnt,
        dailyCheckpointCount: solvedacData.cnt,
        currentProblemCount: solvedacData.cnt,
        tier: solvedacData.tier,
        imgSrc: solvedacData.imgSrc,
        bio: solvedacData.bio,
        createdAt: createdAt,
      };

      const user = await new User(userData);

      await user.save().then((user) => {
        // 업데이트 큐에 신규 유저 추가
        // update.addUserInQueue(user.handle);

        return res.status(200).json({
          success: true,
          user: user,
        });
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, error: "서버 오류 발생" });
    }
  },
  code: async (req, res) => {
    try {
      const handle = req.body.handle;
      const user = await User.findOne({ handle });

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "찾을 수 없는 아이디 입니다." });
      } else {
        if (user.isVerified) {
          return res.status(409).json({
            success: false,
            message: "이미 등록된 아이디 입니다.",
          });
        }
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, error: "서버 오류 발생" });
    }
  },
  verify: async (req, res) => {
    try {
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, error: "서버 오류 발생" });
    }
  },
  logout: async (req, res) => {
    try {
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, error: "서버 오류 발생" });
    }
  },
};

module.exports = {
  get,
  post,
};
