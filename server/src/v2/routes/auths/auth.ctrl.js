const { User } = require("../../../models/User/User");
const solvedac = require("../../../apis/solvedac");
const scrap = require("../../../apis/scrap");
const update = require("../../../services/update");
const bcrypt = require("bcrypt");

const get = {
  me: async (req, res) => {
    try {
      const handle = req.user.handle;
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
      const user = await User.findOne({ handle: req.body.handle });
      if (!user) {
        return res.status(200).json({
          success: false,
          message: "존재하지 않는 id 입니다.",
        });
      }

      // 비밀번호 비교
      const isMatch = await user.comparePassword(req.body.password);
      if (!isMatch) {
        return res.status(200).json({
          success: false,
          message: "비밀번호가 틀렸습니다.",
        });
      }

      // 토큰 생성
      await user.generateToken();

      // 쿠키에 토큰 저장
      res.cookie("token", user.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 14 * 24 * 60 * 60 * 1000,
        sameSite: "Strict",
      });

      return res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, error: "서버 오류 발생" });
    }
  },

  register: async (req, res) => {
    try {
      const existingUser = await User.findOne({ handle: req.body.handle });

      if (existingUser !== undefined && existingUser.isVerified) {
        return res.status(409).json({
          success: false,
          message: "이미 등록된 아이디 입니다.",
        });
      }

      // solved.ac 파싱
      const solvedacData = await scrap.profile(req.body.handle);

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

      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);

      const user = await User.findOneAndUpdate(
        { handle: req.body.handle },
        {
          name: req.body.name,
          password: req.body.password,
          survival: true,
          initialProblemCount: solvedacData.cnt,
          dailyCheckpointCount: solvedacData.cnt,
          currentProblemCount: solvedacData.cnt,
          tier: solvedacData.tier,
          imgSrc: solvedacData.imgSrc,
          bio: solvedacData.bio,
        },
        { new: true }
      );

      return res.status(200).json({
        success: true,
        user: user,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, error: "서버 오류 발생" });
    }
  },
  code: async (req, res) => {
    try {
      const existingUser = await User.findOne({ handle: req.body.handle });

      if (existingUser && existingUser.isVerified) {
        return res.status(409).json({
          success: false,
          message: "이미 등록된 아이디 입니다.",
        });
      }

      if (existingUser) {
        const user = await User.findOneAndUpdate(
          { handle: req.body.handle },
          {
            verificationCode: "test123",
            verificationCodeExp: new Date().setHours(new Date().getHours() + 1),
          },
          { new: true }
        );
        return res.status(200).json({
          success: true,
          user: user,
        });
      }

      const newUser = {
        handle: req.body.handle,
        verificationCode: "test123",
        verificationCodeExp: new Date().setHours(new Date().getHours() + 1),
      };

      const user = await new User(newUser);

      await user.save().then((user) => {
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
  verify: async (req, res) => {
    try {
      const profile = await solvedac.profile(req.body.handle);
      const user = await User.findOne({ handle: req.body.handle });

      console.log("sovledac :", profile.bio);
      console.log("user db :", user.verificationCode);

      if (profile.bio === user.verificationCode) {
        return res.status(200).json({
          success: true,
          user: user,
        });
      }

      return res.status(200).json({
        success: false,
        message: "인증 코드가 일치하지 않습니다.",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, error: "서버 오류 발생" });
    }
  },
  logout: async (req, res) => {
    try {
      const user = req.user;
      user.token = null;
      await user.save();

      // 쿠키 삭제
      res.clearCookie("token");

      return res.status(200).json({
        success: true,
        message: "로그아웃 성공",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        error: "서버 오류 발생",
      });
    }
  },
};

module.exports = {
  get,
  post,
};
