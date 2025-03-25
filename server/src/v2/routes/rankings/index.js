const express = require("express");

const router = express.Router();

const ctrl = require("./rankings.ctrl");

router.get("/rankings/users", ctrl.get.users); // 유저 전체 랭킹 조회
router.get("/rankings/groups", ctrl.get.groups); // 그룹 전체 랭킹 조회

module.exports = router;
