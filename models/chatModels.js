const { mongoose } = require("../db");

let messageSchema = new mongoose.Schema({
  message: String,
  senderId: String,
  recipientId: String,
  time: Date,
  file: Buffer,
  fileName: String,
  fileType: String,
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
