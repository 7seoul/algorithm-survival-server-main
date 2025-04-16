const { User } = require("../../../models/User/User");
const { Group } = require("../../../models/Group/Group");
const { MemberData } = require("../../../models/Group/MemberData");
const { Counter } = require("../../../models/Counter/Counter");
const { userUpdateBySolvedac } = require("../../../services/userUpdate");
const { checkRole } = require("../../../utils/checkRole");
const logger = require("../../../../logger");
const moment = require("moment-timezone");

const get = {
  all: async (req, res) => {
    try {
      const groups = await Group.find({}).select(
        "groupName _id description score count maxStreak size"
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
      let token = req.cookies.token;
      let user = { _id: -1 };

      if (token) {
        const foundUser = await User.findByToken(token);
        if (foundUser) {
          user = foundUser;
        } else {
          res.clearCookie("token");
        }
      }

      const { role } = await checkRole(groupId, user._id);

      const group = await Group.findOne({ _id: groupId }, "-__v -members")
        .populate({
          path: "memberData",
          select: "-_id initialStreak score count",
          populate: {
            path: "user",
            select: "-_id name handle currentStreak imgSrc tier",
          },
        })
        .populate("admin", "-_id handle name")
        .populate("applications", "-_id name handle")
        .lean();

      if (!group) {
        return res
          .status(404)
          .json({ success: false, message: "그룹을 찾을 수 없습니다." });
      }

      const groupScore = group.score;
      const groupCount = group.count;
      const groupMaxStreak = group.maxStreak;

      const scoreRank =
        (await Group.countDocuments({ score: { $gt: groupScore } })) + 1;
      const countRank =
        (await Group.countDocuments({ count: { $gt: groupCount } })) + 1;
      const streakRank =
        (await Group.countDocuments({ maxStreak: { $gt: groupMaxStreak } })) +
        1;

      if (role !== "admin") {
        delete group.applications;
      }

      group.createdAt = moment(group.createdAt).tz("Asia/Seoul").format();
      group.updatedAt = moment(group.updatedAt).tz("Asia/Seoul").format();
      group.isMember = role !== "none";
      group.scoreRank = scoreRank;
      group.countRank = countRank;
      group.streakRank = streakRank;
      group.memberData = group.memberData.map((member) => ({
        name: member.user.name,
        handle: member.user.handle,
        imgSrc: member.user.imgSrc,
        tier: member.user.tier,
        maxStreak: member.user.currentStreak - member.initialStreak,
        score: member.score,
        count: member.count,
      }));

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

const post = {
  create: async (req, res) => {
    try {
      // 유저 추가 전 정보 업데이트
      const user = await userUpdateBySolvedac(req.user.handle);

      // 유저 정보 저장
      const memberData = new MemberData({
        user: user._id,
        initialStreak: user.currentStreak,
        initialCount: user.currentCount,
        initial: user.current,
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
        admin: user._id,
        memberData: [memberData._id],
      });

      await group.save();

      await User.findOneAndUpdate(
        { handle: user.handle },
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
          message: "이미 가입 신청을 하였습니다.",
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
        user: user._id,
        initialStreak: user.currentStreak,
        initialCount: user.currentCount,
        initial: user.current,
      });
      await memberData.save();

      // 그룹 업데이트
      const updatedGroup = await Group.findByIdAndUpdate(
        groupId,
        {
          $pull: { applications: user._id },
          $addToSet: {
            memberData: memberData._id,
          },
          $inc: { size: 1 },
        },
        { new: true }
      );

      // 유저 정보에 그룹 저장
      await User.findOneAndUpdate(
        { handle: handle },
        { $push: { joinedGroupList: groupId } }
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

      const user = await User.findOne({ handle }, "_id").lean();

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "유저를 찾을 수 없습니다." });
      }

      const group = await Group.findByIdAndUpdate(
        groupId,
        {
          $pull: { applications: user._id },
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
