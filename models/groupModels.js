const { mongoose } = require("../db");

let groupScheme = mongoose.Schema(
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

let groupModel = mongoose.model("group", groupScheme);

module.exports = { groupModel };
