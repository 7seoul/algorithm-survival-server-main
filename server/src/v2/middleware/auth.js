const { User } = require("../../models/User/User");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token)
      return res
        .status(401)
        .json({ success: false, message: "인증 토큰이 필요합니다." });

    const user = await User.findByToken(token);
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "유효하지 않은 토큰입니다." });

    req.user = user; // 요청 객체에 사용자 정보 저장
    next(); // 다음 미들웨어 실행
  } catch (err) {
    res.status(401).json({ success: false, message: "인증 실패" });
  }
};

module.exports = { auth };
