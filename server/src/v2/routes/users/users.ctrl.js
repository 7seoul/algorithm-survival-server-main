const { User } = require("../../../models/User/User");
const solvedac = require("../../../apis/solvedac");
const update = require("../../../services/update");

const get = {
  info: async (req, res) => {
    try {
      const user = await User.findOne({ handle: req.params.handle }, "-_id -__v");
      return res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, error: "" });
    }
  },
  all: async (req, res) => {
    try {
      const users = await User.find({}, "-_id -__v");
      return res.status(200).json({
        success: true,
        users,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, error: "" });
    }
  },
};

const post = {
  create: async (req, res) => {
    return res.status(200).json({
      success: true,
    });
  },
};

const patch = {
  edit: async (req, res) => {
    return res.status(200).json({
      success: true,
    });
  },
};

module.exports = {
  get,
  post,
  patch,
};
