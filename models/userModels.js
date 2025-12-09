const { mongoose } = require("../db");
const bcrypt = require("bcrypt");

let userScheme = mongoose.Schema({
  email: String,
  nickName: String,
  password: String,
  verified: Boolean,
  image: String, // new field to store image file name or URL
});

userScheme.pre("save", async function (next) {
  if (this.isModified("password")) {
    console.log("Original Password:", this.password);
    this.password = await bcrypt.hash(this.password, 10);
    console.log("Hashed Password:", this.password);
  }
  next();
});

userScheme.methods.validatePassword = async function (password) {
  console.log(password, this.password);
  return await bcrypt.compare(password, this.password);
};

let userModel = mongoose.model("user", userScheme);

module.exports = userModel;
