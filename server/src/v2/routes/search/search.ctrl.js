const express = require("express");

const router = express.Router();

const ctrl = require("./rankings.ctrl");

router.get("/users", ctrl.get.users); // 유저, 그룹 검색

module.exports = router;
