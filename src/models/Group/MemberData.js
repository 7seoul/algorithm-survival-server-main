const mongoose = require("mongoose");

const memberDataSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  downs: {
    type: Number,
    default: 0,
  },
  score: {
    type: Number,
    default: 0,
  },
  count: {
    type: Number,
    default: 0,
  },
  initialStreak: {
    type: Number,
    default: 0,
  },
  initialSolved: {
    type: Number,
    default: 0,
  },
  initial: {
    bronze: {
      type: Number,
      default: 0,
    },
    silver: {
      type: Number,
      default: 0,
    },
    gold: {
      type: Number,
      default: 0,
    },
    platinum: {
      type: Number,
      default: 0,
    },
    diamond: {
      type: Number,
      default: 0,
    },
    ruby: {
      type: Number,
      default: 0,
    },
  },
});

const MemberData = mongoose.model("MemberData", memberDataSchema);

module.exports = { MemberData };
