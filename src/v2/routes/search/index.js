const express = require("express");

const router = express.Router();

const ctrl = require("./search.ctrl");

router.get("/groups", ctrl.get.groups); // 그룹 검색
router.get("/users", ctrl.get.users); // 유저 검색

module.exports = router;
