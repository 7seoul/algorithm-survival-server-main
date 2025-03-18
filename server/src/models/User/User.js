const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  handle: {
    type: String,
    unique: true,
    require: true,
  },
  password: {
    type: String,
    minlength: 4,
  },
  survival: {
    type: Boolean,
    default: 1,
  },
  joinedGroupList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
    },
  ],
  local: {
    type: Number,
    default: 0,
  },
  initialProblemCount: {
    type: Number,
    default: 0,
  },
  dailyCheckpointCount: {
    type: Number,
    default: 0,
  },
  currentProblemCount: {
    type: Number,
    default: 0,
  },
  tier: {
    type: Number,
    default: 0,
  },
  imgSrc: {
    type: String,
  },
  bio: {
    type: String,
  },
  token: {
    type: String,
  },
  tokenExp: {
    type: String,
  },
  created: {
    type: Date,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = { User };
