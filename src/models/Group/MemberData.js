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
  initialStreak: {
    type: Number,
    default: 0,
  },
  initialSolved: {
    type: Number,
    default: 0,
  },
});

const MemberData = mongoose.model("MemberData", memberDataSchema);

module.exports = { MemberData };
