const express = require("express");

const router = express.Router();

const ctrl = require("./users.ctrl");

router.get("/users", ctrl.get.all); // 사용자 목록 조회
router.post("/users", ctrl.post.create); // 사용자 생성
router.get("/users/:userId", ctrl.get.info); // 특정 사용자 정보 조회
router.patch("/users/:userId", ctrl.patch.edit); // 사용자 정보 수정

module.exports = router;
