const express = require("express");

const router = express.Router();

const ctrl = require("./users.ctrl");

router.get("/", ctrl.get.all); // 사용자 목록 조회
router.get("/:handle", ctrl.get.info); // 특정 사용자 정보 조회

router.post("/:handle", ctrl.post.edit); // 사용자 정보 수정

module.exports = router;
