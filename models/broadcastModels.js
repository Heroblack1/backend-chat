const { mongoose } = require("../db");

let broadcastScheme = mongoose.Schema(
  {
    name: String,
    description: String,
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    admins: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    image: String, // new field to store group image file name or URL
  },
  {
    timestamps: true,
  }
);

let broadcastModel = mongoose.model("broadcast", broadcastScheme);

module.exports = { broadcastModel };
