const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
  },
  handle: {
    type: String,
  },
  survival: {
    type: Boolean,
  },
  number: {
    type: String,
  },
  local: {
    type: String,
  },
  startCnt: {
    type: Number,
  },
  curCnt: {
    type: Number,
  },
  tier: {
    type: Number,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = { User };
