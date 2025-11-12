const express = require("express");
const {
  userReg,
  signUp,
  login,
  authenticate,
  dashboard,
  getUsers,
  newGroup,
  getGroups,
  newBroadcast,
  getBroadcasts,
  getMessages,
  getGroupMessages,
  getBroadcastMessages,
  newStatus,
  getStatuses,
} = require("../controllers/user.controller");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const router = express.Router();

router.get("/", userReg);
router.post("/register", signUp);
router.post("/login", login);
router.get("/dashboard", authenticate, dashboard);
router.get("/getUsers", getUsers);
router.get("/getGroups", getGroups);
router.get("/getBroadcasts", getBroadcasts);
router.post("/dashboard/newGroup", newGroup);
router.post("/dashboard/newbroadcast", newBroadcast);
router.post("/dashboard/status", newStatus);
router.get("/dashboard/getStatuses", getStatuses);
router.get("/dashboard/messages", getMessages);
router.get("/dashboard/broadcastMessages", getBroadcastMessages);
router.get("/dashboard/groupMessages", getGroupMessages);

module.exports = router;
