const mongoose = require("mongoose");

const groupSchema = mongoose.Schema({
  _id: Number,
  groupName: {
    type: String,
    required: true,
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  downs: {
    type: Object,
  },
  description: {
    type: String,
    default: null,
  },
  tier: {
    type: Number,
    default: 0,
  },
  score: {
    type: Number,
    default: 0,
  },
  perviousStreak: {
    type: Number,
    default: 0,
  },
  currentStreak: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
  },
  endedAt: {
    type: Date,
  },
});

const Group = mongoose.model("Group", groupSchema);

module.exports = { Group };
