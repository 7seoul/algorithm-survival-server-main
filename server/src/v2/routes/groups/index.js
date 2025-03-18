const express = require("express");

const router = express.Router();

const ctrl = require("./groups.ctrl");

router.get("/group", ctrl.get.all);
router.get("/group/:groupId", ctrl.get.info);
router.post("/group/:groupId", ctrl.post.edit);
router.post("/group/create", ctrl.post.create);

module.exports = router;
