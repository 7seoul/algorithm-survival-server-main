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
  applications: [
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
  score: {
    type: Number,
    default: 0,
  },
  initialStreak: {
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
