const express = require("express");

const router = express.Router();

const ctrl = require("./rankings.ctrl");

router.get("/users/streak", ctrl.get.usersStreak); // 유저 스트릭 랭킹
router.get("/groups/streak", ctrl.get.groupsStreak); // 그룹 스트릭 랭킹
router.get("/users/score", ctrl.get.usersScore); // 유저 스코어 랭킹
router.get("/groups/score", ctrl.get.groupsScore); // 그룹 스코어 랭킹
router.get("/groups/main", ctrl.get.groupsMain); // 메인페이지용

module.exports = router;
