const express = require("express");
const userRouter = require("./routes/homePage.route");
const userRoute = require("./routes/user.route");
const { connectDB } = require("./db");
const Message = require("./models/chatModels");
const GroupMessage = require("./models/groupChatModels");
const BroadcastMessage = require("./models/broadcastChatModels");
require("dotenv").config();
connectDB();
const cors = require("cors");
const app = express();

app.use(
  cors({
    origin: ["https://hchat-y379.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json({ limit: "50mb" }));
app.use("/uploads", express.static("uploads"));
app.use("/home", userRouter);
app.use("/users", userRoute);

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

const io = require("socket.io")(server, {
  cors: {
    origin: ["https://hchat-y379.vercel.app"], // ✅ same domain here
    methods: ["GET", "POST"],
  },
});

const userSockets = {};
const groupSockets = {};

io.on("connection", (socket) => {
  console.log("User connected successfully");

  // Handle individual chat
  socket.on("join", (userId) => {
    userSockets[userId] = socket.id;
    console.log(`User ${userId} joined with socket ID ${socket.id}`);
  });

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`User joined room ${roomId}`);
  });

  socket.on("newMessage", async (message) => {
    try {
      const roomId = generateRoomId(message.senderId, message.recipientId);
      io.to(roomId).emit("newMessage", message);
      const newMessage = new Message({
        message: message.message,
        senderId: message.senderId,
        recipientId: message.recipientId,
        time: message.time,
      });
      await newMessage.save();
    } catch (err) {
      console.error(err);
    }
  });

  socket.on("newFile", async (fileData) => {
    try {
      const roomId = generateRoomId(fileData.senderId, fileData.recipientId);
      io.to(roomId).emit("newFile", fileData);
      const newMessage = new Message({
        file: fileData.file,
        fileName: fileData.fileName,
        senderId: fileData.senderId,
        recipientId: fileData.recipientId,
        time: fileData.time,
      });
      await newMessage.save();
      console.log(`Message saved to database`);
    } catch (err) {
      console.error(err);
    }
  });

  function generateRoomId(user1Id, user2Id) {
    return [user1Id, user2Id].sort().join("-");
  }

  //  handle broadcasts
  socket.on("newBroadcastMessage", async (broadcastMessage) => {
    try {
      // Emit to each member individually
      broadcastMessage.members.forEach((memberId) => {
        const memberSocketId = userSockets[memberId];
        if (memberSocketId) {
          io.to(memberSocketId).emit("newBroadcastMessage", broadcastMessage);
        }
      });

      // Save to DB
      const newBroadcastMessage = new BroadcastMessage({
        message: broadcastMessage.message,
        senderId: broadcastMessage.senderId,
        members: broadcastMessage.members,
        time: broadcastMessage.time,
      });
      await newBroadcastMessage.save();
      console.log("Broadcast message saved successfully");
    } catch (err) {
      console.error(err);
    }
  });

  socket.on("newBroadcastFile", async (fileData) => {
    try {
      // Emit to each member individually
      fileData.members.forEach((memberId) => {
        const memberSocketId = userSockets[memberId];
        if (memberSocketId) {
          io.to(memberSocketId).emit("newBroadcastFile", fileData);
        }
      });

      // Save to DB
      const newBroadcastFile = new BroadcastMessage({
        file: fileData.file,
        fileName: fileData.fileName,
        senderId: fileData.senderId,
        members: fileData.members,
        time: fileData.time,
      });
      await newBroadcastFile.save();
      console.log("Broadcast file saved successfully");
    } catch (err) {
      console.error(err);
    }
  });

  function generateBroadcastRoomId(members) {
    return members.sort().join("-");
  }

  // Handle group chat
  socket.on("joinGroup", (groupId) => {
    const groupIdString = groupId.toString();
    if (!groupSockets[groupIdString]) {
      groupSockets[groupIdString] = [];
    }
    groupSockets[groupIdString].push(socket.id);
    console.log(
      `User joined group ${groupIdString} with socket ID ${socket.id}`
    );
  });

  socket.on("joinGroupPage", (groupId) => {
    socket.join(`groupPage_${groupId}`);
    console.log(
      `User joined group page ${groupId} with socket ID ${socket.id}`
    );
  });

  socket.on("leaveGroup", (groupId) => {
    const groupIdString = groupId.toString();
    if (groupSockets[groupIdString]) {
      const index = groupSockets[groupIdString].indexOf(socket.id);
      if (index !== -1) {
        groupSockets[groupIdString].splice(index, 1);
        console.log(
          `User left group ${groupIdString} with socket ID ${socket.id}`
        );
      }
    }
  });

  socket.on("newGroupMessage", async (groupMessage) => {
    try {
      const groupId = groupMessage.groupId.toString();
      io.to(`groupPage_${groupId}`).emit("newGroupMessage", groupMessage);
      const newGroupMessage = new GroupMessage({
        message: groupMessage.message,
        senderId: groupMessage.senderId,
        groupId: groupMessage.groupId,
        time: groupMessage.time,
      });
      await newGroupMessage.save();
    } catch (err) {
      console.error(err);
    }
  });

  socket.on("newGroupFile", async (fileData) => {
    try {
      const groupId = fileData.groupId.toString();
      io.to(`groupPage_${groupId}`).emit("newGroupFile", fileData);
      const newGroupMessage = new GroupMessage({
        file: fileData.file,
        fileName: fileData.fileName,
        senderId: fileData.senderId,
        groupId: fileData.groupId,
        time: fileData.time,
      });
      await newGroupMessage.save();
    } catch (err) {
      console.error(err);
    }
  });

  socket.on("disconnect", () => {
    for (const userId in userSockets) {
      if (userSockets[userId] === socket.id) {
        delete userSockets[userId];
        console.log(`User ${userId} disconnected`);
      }
    }
    for (const groupId in groupSockets) {
      const index = groupSockets[groupId].indexOf(socket.id);
      if (index !== -1) {
        groupSockets[groupId].splice(index, 1);
        console.log(`User disconnected from group ${groupId}`);
      }
    }
  });
  // === WebRTC signaling for voice/video calls ===
  socket.on("callUser", ({ to, offer }) => {
    const targetSocketId = userSockets[to];
    if (targetSocketId) {
      io.to(targetSocketId).emit("incomingCall", {
        from: socket.id,
        offer,
      });
    }
  });

  socket.on("answerCall", ({ to, answer }) => {
    io.to(to).emit("callAccepted", { answer });
  });

  socket.on("iceCandidate", ({ to, candidate }) => {
    io.to(to).emit("iceCandidate", { candidate });
  });

  socket.on("webrtc-offer", ({ offer, to, from, type }) => {
    const targetSocket = userSockets[to];
    if (targetSocket) {
      io.to(targetSocket).emit("webrtc-offer", { offer, from, type });
    }
  });

  socket.on("webrtc-answer", ({ answer, to, from }) => {
    const targetSocket = userSockets[to];
    if (targetSocket) {
      io.to(targetSocket).emit("webrtc-answer", { answer, from });
    }
  });

  socket.on("webrtc-candidate", ({ candidate, to, from }) => {
    const targetSocket = userSockets[to];
    if (targetSocket) {
      io.to(targetSocket).emit("webrtc-candidate", { candidate, from });
    }
  });

  const onlineUsers = new Set();

  io.on("connection", (socket) => {
    socket.on("join", (userId) => {
      socket.userId = userId;
      onlineUsers.add(userId);

      io.emit("updateUserStatus", {
        userId,
        status: "online",
      });
    });

    socket.on("disconnect", () => {
      if (socket.userId) {
        onlineUsers.delete(socket.userId);

        io.emit("updateUserStatus", {
          userId: socket.userId,
          status: "offline",
        });
      }
    });
  });
});
