const express = require("express");

const router = express.Router();

const ctrl = require("./groups.ctrl");
const auth = require("../../middleware/auth");

router.get("/", ctrl.get.all); // 그룹 목록 조회
router.get("/:groupId", ctrl.get.info); // 특정 그룹 정보 조회
router.get("/:groupId/applications", auth, ctrl.get.applications); // 신청 목록 조회

router.post("/", auth, ctrl.post.create); // 그룹 생성
router.post("/:groupId", auth, ctrl.post.edit); // 그룹 정보 수정
router.post("/:groupId/applications", auth, ctrl.post.apply); // 그룹 참가 신청
router.post("/:groupId/applications/:handle/accept", auth, ctrl.post.accept); // 신청 승인
router.post("/:groupId/applications/:handle", auth, ctrl.post.reject); // 신청 거절

module.exports = router;
