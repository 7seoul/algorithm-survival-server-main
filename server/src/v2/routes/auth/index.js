const express = require("express");

const router = express.Router();

const ctrl = require("./auth.ctrl");
const auth = require("../../middlewares/auth");

router.post("/auth/login", ctrl.post.login); // 로그인
router.get("/auth/me", auth, ctrl.get.me); // 로그인한 사용자 정보 조회
router.delete("/auth/logout", auth, ctrl.delete.logout); // 로그아웃

module.exports = router;
