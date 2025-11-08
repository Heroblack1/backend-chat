const { mongoose } = require("../db");

let broadcastMessageSchema = new mongoose.Schema({
  file: Buffer,
  fileType: String,
  fileName: String,
  message: String,
  senderId: String,
  members: [{ type: String }],
  time: Date,
});

const BroadcastMessage = mongoose.model(
  "BroadcastMessage",
  broadcastMessageSchema
);

module.exports = BroadcastMessage;
