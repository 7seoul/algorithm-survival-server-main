const { User } = require("../../models/User/User");

const auth = async (req, res, next) => {
  try {
    // 쿠키에서 토큰 가져오기
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "인증 토큰이 필요합니다.",
      });
    }

    const user = await User.findByToken(token);
    if (!user) {
      res.clearCookie("token"); // 쿠키 삭제
      return res.status(401).json({
        success: false,
        message: "유효하지 않은 토큰입니다.",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "서버 오류",
    });
  }
};

module.exports = auth;
