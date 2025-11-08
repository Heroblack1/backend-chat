const mongoose = require("mongoose");

const connectDB = async () => {
  const MONGODB_URI = process.env.MONGODB_URI;
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("mafo e don connect");
  } catch (err) {
    console.log(`mongoose no gree o ${err}`);
  }
};

module.exports = { mongoose, connectDB };
