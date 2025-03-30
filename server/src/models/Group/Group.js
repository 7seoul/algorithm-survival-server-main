const mongoose = require("mongoose");

const groupSchema = mongoose.Schema({
  _id: Number,
  groupName: {
    type: String,
    require: true,
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
  survivalStartDate: {
    type: Date,
  },
  survivalEndDate: {
    type: Date,
  },
  createdAt: {
    type: Date,
  },
});

const Group = mongoose.model("Group", groupSchema);

module.exports = { Group };
