const express = require("express");
const upload = require("../uploads/upload");
const { userModel } = require("../models/userModels");

const router = express.Router();

// update user image
router.put("/:id", upload.single("image"), async (req, res) => {
  console.log(req.file);
  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      req.params.id,
      { image: `/uploads/${req.file.filename}` }, // path to the file
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update user" });
  }
});

module.exports = router;
