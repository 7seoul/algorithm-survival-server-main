const express = require("express");

const router = express.Router();

const ctrl = require("./groups.ctrl");

router.get("/groups", ctrl.get.all); // 그룹 목록 조회
router.post("/groups", ctrl.post.create); // 그룹 생성
router.get("/groups/:groupId", ctrl.get.info); // 특정 그룹 정보 조회
router.patch("/groups/:groupId", ctrl.post.edit); // 그룹 정보 수정
router.post("/groups/:groupId/applications", ctrl.post.apply); // 그룹 참가 신청
router.get("/groups/:groupId/applications", ctrl.get.applications); // 신청 목록 조회
router.post("/groups/:groupId/applications/:userId/accept", ctrl.post.accept); // 신청 승인
router.delete("/groups/:groupId/applications/:userId", ctrl.post.reject); // 신청 거절

module.exports = router;
