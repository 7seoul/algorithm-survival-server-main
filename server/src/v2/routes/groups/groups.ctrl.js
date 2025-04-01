const { User } = require("../../../models/User/User");
const { Group } = require("../../../models/Group/Group");
const solvedac = require("../../../apis/solvedac");
const scrap = require("../../../apis/scrap");
const autoUpdate = require("../../../services/autoUpdate");

const get = {
  all: async (req, res) => {
    try {

      return res.status(200).json({
        success: true,
        solved: solved,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, error: "서버 오류 발생" });
    }
  },
  info: async (req, res) => {
    try {

      return res.status(200).json({
        success: true,
        solved: solved,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, error: "서버 오류 발생" });
    }
  },
  applications: async (req, res) => {
    try {

      return res.status(200).json({
        success: true,
        solved: solved,
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

      return res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, error: "서버 오류 발생" });
    }
  },
  edit: async (req, res) => {
    try {

      return res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, error: "서버 오류 발생" });
    }
  },
  apply: async (req, res) => {
    try {

      return res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, error: "서버 오류 발생" });
    }
  },
  accept: async (req, res) => {
    try {

      return res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, error: "서버 오류 발생" });
    }
  },
  reject: async (req, res) => {
    try {

      return res.status(200).json({
        success: true,
        user,
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
