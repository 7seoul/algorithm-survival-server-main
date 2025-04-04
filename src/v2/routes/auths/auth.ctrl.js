const { User } = require("../../../models/User/User");
const solvedac = require("../../../apis/solvedac");
const autoUpdate = require("../../../services/autoUpdate");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const get = {
  me: async (req, res) => {
    try {
      const handle = req.user.handle;
      const user = await User.findOne(
        { handle },
        "-token -password -createdAt -verificationCode -__v -isVerified"
      ).populate("joinedGroupList", "groupName");

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

      const verificationCode = await crypto
        .randomBytes(Math.ceil(16))
        .toString("hex")
        .slice(0, 32);

      if (existingUser) {
        const user = await User.findOneAndUpdate(
          { handle: req.body.handle },
          {
            verificationCode: verificationCode,
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
        verificationCode: verificationCode,
      };

      const user = await new User(newUser);

      await user.save().then((user) => {
        return res.status(200).json({
          success: true,
          verificationCode: verificationCode,
        });
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, error: "서버 오류 발생" });
    }
  },
  register: async (req, res) => {
    try {
      const verifyUser = await User.findOne({ handle: req.body.handle });

      if (verifyUser !== undefined && verifyUser.isVerified) {
        return res.status(409).json({
          success: false,
          message: "이미 등록된 아이디 입니다.",
        });
      }

      // 여기서 과요청 방지 가능

      // solved.ac api 사용
      const profile = await solvedac.profile(req.body.handle);

      console.log("sovledac :", profile.bio);
      console.log("User DB  :", verifyUser.verificationCode);

      // 개발용 스킵
      // if (!verifyUser.verificationCode) {
      //   return res.status(200).json({
      //     success: false,
      //     message: "인증 코드를 새로 발급해 주세요.",
      //   });
      // }
      // if (profile.bio !== verifyUser.verificationCode) {
      //   return res.status(200).json({
      //     success: false,
      //     message: "인증 코드가 일치하지 않습니다.",
      //   });
      // }

      const streak = await solvedac.grass(req.body.handle);

      if (
        profile === undefined ||
        streak === undefined ||
        profile.tier === undefined ||
        profile.solvedCount === undefined ||
        profile.profileImageUrl === undefined
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
          initialStreak: streak,
          currentStreak: streak,
          initialSolved: profile.solvedCount,
          currentSolved: profile.solvedCount,
          tier: profile.tier,
          imgSrc: profile.profileImageUrl,
          isVerified: true,
          verificationCode: "",
        },
        { new: true }
      );

      autoUpdate.addUserInQueue(user.handle);

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
  password: async (req, res) => {
    try {
      const { newPassword, handle } = req.body;
      const user = await User.findOne({ handle: handle });

      // 개발용 스킵
      // if (!verifyUser.verificationCode) {
      //   return res.status(200).json({
      //     success: false,
      //     message: "인증 코드를 새로 발급해 주세요.",
      //   });
      // }
      // const profile = await solvedac.profile(handle);
      // if (profile.bio !== verifyUser.verificationCode) {
      //   return res.status(200).json({
      //     success: false,
      //     message: "인증 코드가 일치하지 않습니다.",
      //   });
      // }

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "찾을 수 없는 아이디 입니다." });
      }

      // 새로운 비밀번호 설정
      user.password = newPassword;
      await user.save();

      return res.status(200).json({
        success: true,
        message: "비밀번호 변경 완료",
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
