const express = require("express");

const router = express.Router();

const ctrl = require("./search.ctrl");

router.get("/", ctrl.get.all); // 유저, 그룹 검색

module.exports = router;
