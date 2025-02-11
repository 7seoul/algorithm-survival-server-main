const express = require("express");

const router = express.Router();

const ctrl = require("./users.ctrl");

router.get("/stats", ctrl.get.stats);
router.get("/updateAll", ctrl.get.updateAll);
router.post("/register", ctrl.post.register);

module.exports = router;
