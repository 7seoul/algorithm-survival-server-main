const { response } = require("express");
const { User } = require("../../models/User/User");

const get = {
  stats: (req, res) => {},
  updateAll: (req, res) => {},
};

const post = {
  register: async (req, res) => {
    const existingUser = await User.findOne({ handle: req.body.handle });

    if (existingUser) {
      return res.status(200).json({
        success: false,
        message: "이미 등록된 아이디 입니다.",
      });
    }

    const cnt = await User.countDocuments({});

    const userData = {
      handle: req.body.handle,
      name: req.body.name,
      local: req.body.local,
      number: cnt + 1,
      survival: true,
    };

    const user = await new User(userData);

    await user.save().then((err, user) => {
      if (err) {
        return res.status(500).json({ success: false, err });
      }
      return res.status(200).json({
        success: true,
        user: user.serialize(),
      });
    });
  },
};

module.exports = {
  get,
  post,
};
