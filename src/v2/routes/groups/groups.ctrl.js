const { User } = require("../../../models/User/User");
const { Group } = require("../../../models/Group/Group");
const { MemberData } = require("../../../models/Group/MemberData");
const { Counter } = require("../../../models/Counter/Counter");
const { userUpdateBySolvedac } = require("../../../services/userUpdate");
const { checkRole } = require("../../../utils/checkRole");
const logger = require("../../../../logger");

const get = {
  all: async (req, res) => {
    try {
      const groups = await Group.find({}).select(
        "groupName _id description score maxStreak size"
      );
      return res.status(200).json({
        success: true,
        groups,
      });
    } catch (error) {
      logger.error(error);
      return res
        .status(500)
        .json({ success: false, message: "서버 오류 발생" });
    }
  },
  info: async (req, res) => {
    try {
      const { groupId } = req.params;
      const group = await Group.findOne(
        { _id: groupId },
        "-__v -applications -members"
      )
        .populate(
          "memberData",
          "-_id name handle initialSolved initialStreak currentSolved currentStreak"
        )
        .populate("admin", "-_id handle name");

      const groupScore = group.score;
      const groupMaxStreak = group.maxStreak;

      const scoreRank =
        (await Group.countDocuments({ score: { $gt: groupScore } })) + 1;
      const streakRank =
        (await Group.countDocuments({ maxStreak: { $gt: groupMaxStreak } })) +
        1;

      const groupObj = group.toObject();

      groupObj.scoreRank = scoreRank;
      groupObj.streakRank = streakRank;

      groupObj.memberData = group.memberData.map((member) => ({
        name: member.name,
        handle: member.handle,
        streak: member.currentStreak - member.initialStreak,
        score: member.currentSolved - member.initialSolved,
      }));

      return res.status(200).json({
        success: true,
        group: groupObj,
      });
    } catch (error) {
      logger.error(error);
      return res
        .status(500)
        .json({ success: false, message: "서버 오류 발생" });
    }
  },
  applications: async (req, res) => {
    try {
      const { groupId } = req.params;
      const { success, role } = await checkRole(groupId, req.user._id);

      if (!success) {
        return res
          .status(404)
          .json({ success: false, message: "그룹을 찾을 수 없습니다." });
      }

      if (role !== "admin") {
        return res.status(200).json({
          success: false,
          message: "권한이 없습니다.",
        });
      }

      const data = await Group.findOne({ _id: groupId })
        .select("-_id applications")
        .populate(
          "applications",
          "-_id name handle currentSolved currentStreak"
        );

      const applications = data.applications;

      return res.status(200).json({
        success: true,
        applications,
      });
    } catch (error) {
      logger.error(error);
      return res
        .status(500)
        .json({ success: false, message: "서버 오류 발생" });
    }
  },
};

const post = {
  create: async (req, res) => {
    try {
      // 유저 추가 전 정보 업데이트
      await userUpdateBySolvedac(req.user.handle);

      // 유저 정보 저장
      const memberData = new MemberData({
        name: req.user.name,
        handle: req.user.handle,
        initialStreak: req.user.currentStreak,
        currentStreak: req.user.currentStreak,
        initialSolved: req.user.currentSolved,
        currentSolved: req.user.currentSolved,
      });

      await memberData.save();

      const counter = await Counter.findByIdAndUpdate(
        "groupId",
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );

      const groupId = await counter.seq;

      const group = await new Group({
        _id: groupId,
        groupName: req.body.groupName,
        description: req.body.description,
        admin: req.user._id,
        members: [req.user._id],
        memberData: [memberData._id],
      });

      await group.save();

      await User.findOneAndUpdate(
        { handle: req.user.handle },
        { $push: { joinedGroupList: groupId } }
      );

      return res.status(200).json({
        success: true,
        group,
      });
    } catch (error) {
      logger.error(error);
      return res
        .status(500)
        .json({ success: false, message: "서버 오류 발생" });
    }
  },
  edit: async (req, res) => {
    try {
      const { groupId } = req.params;
      const { success, role } = await checkRole(
        req.params.groupId,
        req.user._id
      );

      if (!success) {
        return res
          .status(404)
          .json({ success: false, error: "그룹을 찾을 수 없습니다." });
      }

      if (role !== "admin") {
        return res.status(200).json({
          success: false,
          message: "권한이 없습니다.",
        });
      }

      const group = await Group.findByIdAndUpdate(
        groupId,
        {
          $set: {
            groupName: req.body.groupName,
            description: req.body.description,
          },
        },
        { new: true }
      );

      if (!group) {
        return res
          .status(404)
          .json({ success: false, error: "그룹을 찾을 수 없습니다." });
      }

      return res.status(200).json({
        success: true,
        group,
      });
    } catch (error) {
      logger.error(error);
      return res
        .status(500)
        .json({ success: false, message: "서버 오류 발생" });
    }
  },
  apply: async (req, res) => {
    try {
      const { groupId } = req.params;
      const { success, role } = await checkRole(
        req.params.groupId,
        req.user._id
      );

      if (!success) {
        return res
          .status(404)
          .json({ success: false, message: "그룹을 찾을 수 없습니다." });
      }

      if (role !== "none") {
        return res.status(200).json({
          success: false,
          message: "이미 그룹의 멤버입니다.",
        });
      }

      const updatedGroup = await Group.findByIdAndUpdate(
        groupId,
        { $addToSet: { applications: req.user._id } },
        { new: true }
      );

      if (!updatedGroup) {
        return res
          .status(404)
          .json({ success: false, message: "그룹을 찾을 수 없습니다." });
      }

      return res.status(200).json({
        success: true,
        group: updatedGroup,
      });
    } catch (error) {
      logger.error(error);
      return res
        .status(500)
        .json({ success: false, message: "서버 오류 발생" });
    }
  },
  accept: async (req, res) => {
    try {
      const { groupId, handle } = req.params;
      const { success, role } = await checkRole(groupId, req.user._id);

      if (!success) {
        return res
          .status(404)
          .json({ success: false, message: "그룹을 찾을 수 없습니다." });
      }

      if (role !== "admin") {
        return res.status(200).json({
          success: false,
          message: "권한이 없습니다.",
        });
      }

      // 유저 추가 전 정보 업데이트
      const user = await userUpdateBySolvedac(handle);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "유저를 찾을 수 없습니다." });
      }

      // 그룹 가져오기
      const group = await Group.findById(groupId);
      if (!group) {
        return res
          .status(404)
          .json({ success: false, message: "그룹을 찾을 수 없습니다." });
      }

      // 신청 목록에 있는지 확인
      const isApplied = await group.applications.some(
        (app) => app.toString() === user._id.toString()
      );
      if (!isApplied) {
        return res
          .status(400)
          .json({ success: false, message: "유저가 신청 목록에 없습니다." });
      }

      // MemberData 생성 및 저장
      const memberData = new MemberData({
        name: user.name,
        handle: user.handle,
        initialStreak: user.currentStreak,
        currentStreak: user.currentStreak,
        initialSolved: user.currentSolved,
        currentSolved: user.currentSolved,
      });
      await memberData.save();

      // 그룹 업데이트
      const updatedGroup = await Group.findByIdAndUpdate(
        groupId,
        {
          $pull: { applications: user._id },
          $addToSet: {
            members: user._id,
            memberData: memberData._id,
          },
          $inc: { size: 1 },
        },
        { new: true }
      );

      return res.status(200).json({
        success: true,
        group: updatedGroup,
      });
    } catch (error) {
      logger.error(error);
      return res
        .status(500)
        .json({ success: false, message: "서버 오류 발생" });
    }
  },
  reject: async (req, res) => {
    try {
      const { groupId, handle } = req.params;
      const { success, role } = await checkRole(groupId, req.user._id);

      if (!success) {
        return res
          .status(404)
          .json({ success: false, message: "그룹을 찾을 수 없습니다." });
      }

      if (role !== "admin") {
        return res.status(200).json({
          success: false,
          message: "권한이 없습니다.",
        });
      }

      const group = await Group.findByIdAndUpdate(
        groupId,
        {
          $pull: { applications: handle },
        },
        { new: true }
      );

      return res.status(200).json({
        success: true,
        group,
      });
    } catch (error) {
      logger.error(error);
      return res
        .status(500)
        .json({ success: false, message: "서버 오류 발생" });
    }
  },
};

module.exports = {
  get,
  post,
};
