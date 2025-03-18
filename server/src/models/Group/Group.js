const mongoose = require('mongoose');

const groupSchema = mongoose.Schema({
  
});

const Group = mongoose.model("Group", groupSchema);

module.exports = { Group };