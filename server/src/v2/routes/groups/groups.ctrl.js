const { User } = require("../../../models/User/User");
const { Group } = require("../../../models/Group/Group");
const { Counter } = require("../../../models/Counter/Counter");
const solvedac = require("../../../apis/solvedac");
const scrap = require("../../../apis/scrap");
const autoUpdate = require("../../../services/autoUpdate");
const utils = require("../../../utils/utils");

const get = {
  all: async (req, res) => {
    try {
      const groups = await Group.find({}, "-__v");
      return res.status(200).json({
        success: true,
        groups,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, error: "서버 오류 발생" });
    }
  },
  info: async (req, res) => {
    try {
      const { groupId } = req.params;
      const group = await Group.findOne(
        { _id: groupId },
        "-__v -applications"
      );
      return res.status(200).json({
        success: true,
        group,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, error: "서버 오류 발생" });
    }
  },
  applications: async (req, res) => {
    try {
      const { groupId } = req.params;
      const { success, role, group } = await utils.checkGroupRole(groupId, req.user._id);

      if (!success) {
        return res
        .status(404)
        .json({ success: false, error: "그룹을 찾을 수 없습니다." });
      }

      if (role !== "admin") {
        return res.status(200).json({
          success: false,
          error: "권한이 없습니다."
        });
      } 

      return res.status(200).json({
        success: true,
        group,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, error: "서버 오류 발생" });
    }
  },
};

const post = {
  create: async (req, res) => {
    try {
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
      });

      await group.save();

      return res.status(200).json({
        success: true,
        group,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, error: "서버 오류 발생" });
    }
  },
  edit: async (req, res) => {
    try {
      const { groupId } = req.params;
      const { success, role } = await utils.checkGroupRole(req.params.groupId, req.user._id);

      if (!success) {
        return res
          .status(404)
          .json({ success: false, error: "그룹을 찾을 수 없습니다." });
      }

      if (role !== "admin") {
        return res.status(200).json({
          success: false,
          error: "권한이 없습니다."
        });
      }

      const group = await Group.findByIdAndUpdate(
        groupId,
        {
          description: req.body.description,
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
      console.log(error);
      return res.status(500).json({ success: false, error: "서버 오류 발생" });
    }
  },
  apply: async (req, res) => {
    try {
      const { groupId } = req.params;
      const { success, role } = await utils.checkGroupRole(req.params.groupId, req.user._id);

      if (!success) {
        return res
          .status(404)
          .json({ success: false, error: "그룹을 찾을 수 없습니다." });
      }

      if (role !== "none") {
        return res.status(200).json({
          success: false,
          error: "이미 그룹의 멤버입니다."
        });
      }

      const updatedGroup = await Group.findByIdAndUpdate(
        groupId,
        { $addToSet: { applications: req.user._id } },
        { new: true } 
      );
  
      if (!updatedGroup) {
        return res.status(404).json({ success: false, error: "그룹을 찾을 수 없습니다." });
      }

      return res.status(200).json({
        success: true, 
        group: updatedGroup,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, error: "서버 오류 발생" });
    }
  },
  accept: async (req, res) => {
    try {
      const { groupId, userId } = req.params;
      const { success, role } = await utils.checkGroupRole(groupId, req.user._id);

      if (!success) {
        return res
          .status(404)
          .json({ success: false, error: "그룹을 찾을 수 없습니다." });
      }

      if (role !== "admin") {
        return res.status(200).json({
          success: false,
          error: "권한이 없습니다."
        });
      }

      const group = await Group.findByIdAndUpdate(groupId, {
        $pull: { applications: userId },
        $addToSet: { members: userId }, 
      },
      { new: true });

      return res.status(200).json({
        success: true,
        group,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, error: "서버 오류 발생" });
    }
  },
  reject: async (req, res) => {
    try {
      const { groupId, userId } = req.params;
      const { success, role } = await utils.checkGroupRole(groupId, req.user._id);

      if (!success) {
        return res
          .status(404)
          .json({ success: false, error: "그룹을 찾을 수 없습니다." });
      }

      if (role !== "admin") {
        return res.status(200).json({
          success: false,
          error: "권한이 없습니다."
        });
      }

      const group = await Group.findByIdAndUpdate(groupId, {
        $pull: { applications: userId },
      },
      { new: true });

      return res.status(200).json({
        success: true,
        group,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, error: "서버 오류 발생" });
    }
  },
};

module.exports = {
  get,
  post,
};
