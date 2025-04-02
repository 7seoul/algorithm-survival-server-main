const mongoose = require("mongoose");

const groupSchema = mongoose.Schema({
  handle: {
    type: String,
    required: true,
  },
  downs: {
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
  initialSolved: {
    type: Number,
    default: 0,
  },
  currentSolved: {
    type: Number,
    default: 0,
  }
},
{ timestamps: true }
);

const Group = mongoose.model("Group", groupSchema);

module.exports = { Group };
