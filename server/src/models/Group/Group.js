const mongoose = require("mongoose");

const groupSchema = mongoose.Schema(
  {
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
    memberData: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MemberData",
      },
    ],
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
    endedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Group = mongoose.model("Group", groupSchema);

module.exports = { Group };
