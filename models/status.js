// const { mongoose } = require("../db");

// const statusSchema = new mongoose.Schema({
//   userName: { type: String },
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   type: {
//     type: String,
//     enum: ["text", "file", "voice", "camera"],
//     required: true,
//   },
//   content: String, // for text
//   filePath: String, // for uploaded files
//   createdAt: { type: Date, default: Date.now },
// });

// let statusModel = mongoose.model("status", statusSchema);

// module.exports = { statusModel };

const { mongoose } = require("../db");

const statusSchema = new mongoose.Schema({
  userName: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: {
    type: String,
    enum: ["text", "file", "voice", "camera"],
    required: true,
  },
  content: String, // for text
  filePath: String, // for uploaded files

  // 👇 This field will control automatic deletion
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 21600, // 6 hours = 21,600 seconds
  },
});

const statusModel = mongoose.model("status", statusSchema);

module.exports = { statusModel };
