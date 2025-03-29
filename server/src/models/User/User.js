const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  handle: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  password: {
    type: String,
    minlength: 4,
  },
  survival: {
    type: Boolean,
    default: true,
  },
  joinedGroupList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    },
  ],
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
  verificationCode: {
    type: String,
  },
  verificationCodeExp: {
    type: Date,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = { User };
