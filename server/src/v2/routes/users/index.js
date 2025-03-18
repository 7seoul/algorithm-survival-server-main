const express = require("express");

const router = express.Router();

const ctrl = require("./users.ctrl");

router.get("/users", ctrl.get.all);
router.get("/users/:userId", ctrl.get.info);
router.post("/users/:userId", ctrl.post.edit);
router.post("/users/register", ctrl.post.register);

module.exports = router;
