const express = require("express");

const router = express.Router();

const ctrl = require("./status.ctrl");

router.get("/scrap", ctrl.get.scrap); // 스크래핑 상태

module.exports = router;
