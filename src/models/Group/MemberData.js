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
  initialCount: {
    type: Number,
    default: 0,
  },
  initialScore: {
    type: Number,
    default: 0,
  },
});

const MemberData = mongoose.model("MemberData", memberDataSchema);

module.exports = { MemberData };
