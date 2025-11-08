const { mongoose } = require("../db");

let groupMessageSchema = new mongoose.Schema({
  message: String,
  senderId: String,
  groupId: String,
  time: Date,
  file: Buffer,
  fileName: String,
  fileType: String,
});

const GroupMessage = mongoose.model("GroupMessage", groupMessageSchema);

module.exports = GroupMessage;
