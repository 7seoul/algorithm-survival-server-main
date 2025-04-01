const express = require("express");

const router = express.Router();

const ctrl = require("./rankings.ctrl");

router.get("/all", ctrl.get.all); // 유저, 그룹 검색

module.exports = router;
