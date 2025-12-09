const { userModel } = require("../models/userModels");
const { groupModel } = require("../models/groupModels");
const { statusModel } = require("../models/status");
const Message = require("../models/chatModels");
const GroupMessage = require("../models/groupChatModels");
const BroadcastMessage = require("../models/broadcastChatModels");
const { broadcastModel } = require("../models/broadcastModels");
const userVerificationModel = require("../models/verificationModel");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");

require("dotenv").config();

const userReg = (req, res) => {
  res.send("chalo you for home page");
};

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  "https://developers.google.com/oauthplayground" // redirect URI
);

oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

// // nodemailer inititialization
// // nodemailer inititialization
// // nodemailer inititialization
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     type: "OAuth2",
//     user: process.env.AUTH_EMAIL,
//     clientId: process.env.CLIENT_ID,
//     clientSecret: process.env.CLIENT_SECRET,
//     refreshToken: process.env.REFRESH_TOKEN,
//   },
// });

// transporter.verify((error, success) => {
//   if (error) {
//     console.log("❌ Transporter Error:", error);
//   } else {
//     console.log("✅ Gmail transporter ready");
//   }
// });

// email verification function
// email verification function
// email verification function
// const setVerificationEmail = ({ _id, email }, res) => {
//   const currentUrl = "https://backend-chat-0085.onrender.com/";
//   const uniqueString = uuidv4() + _id;
//   const mailOptions = {
//     from: process.env.AUTH_EMAIL,
//     to: email,
//     subject: "Verify Your Email",
//     html: `<P>Verify your email address to complete the signup and login into your account.<p>This link expires in <b>6 hours</b> </p></p>
//           <p>click <a href=${
//             currentUrl + "home/verify" + "/" + _id + "/" + uniqueString
//           }>here</a> to proceed.</p>`,
//   };

//hashing the unique string
//   const saltRounds = 10;
//   bcrypt
//     .hash(uniqueString, saltRounds)
//     .then((hashedUniqueString) => {
//       //set values to the new user verification model
//       const newVerification = new userVerificationModel({
//         userId: _id,
//         uniqueString: hashedUniqueString,
//         createdAt: Date.now(),
//         expiry: Date.now() + 21600000,
//       });
//       newVerification
//         .save()
//         .then(() => {
//           transporter
//             .sendMail(mailOptions)
//             .then(() => {
//               res.json({
//                 status: "Almost a verified user",
//                 message: "A verification message has been sent to your email",
//               });
//               console.log("email sent");
//             })
//             .catch((error) => {
//               console.log(error);
//               res.json({
//                 status: "pending",
//                 message: "email verification failed",
//               });
//             });
//         })
//         .catch((error) => {
//           console.log(error);
//           res.json({
//             status: "FAILED",
//             message: "could not save verification email data",
//           });
//         });
//     })
//     .catch((err) => {
//       console.log(err);

//       res.json({
//         status: "FAILED",
//         message: "An error occured while hashing email data",
//       });
//     });
// };

// verify email function
// verify email function
// verify email function
// const verifyEmail = (req, res) => {
//   let { userId, uniqueString } = req.params;

//   userVerificationModel
//     .find({ userId })
//     .then((result) => {
//       if (result.length > 0) {
//         const expiry = result[0];
//         const hashedUniqueString = result[0].uniqueString;
//         if (expiry < Date.now()) {
//           userVerificationModel
//             .deleteOne({ userId })
//             .then((result) => {
//               user
//                 .deleteOne({ _id: userId })
//                 .then(() => {
//                   console.log("link has expired. sign up again");
//                   res.send("link has expired. sign up again");
//                 })
//                 .catch((error) => {
//                   console.log("clearing user with expired unique id failed");
//                   res.send("clearing user with expired unique id failed");
//                 });
//             })
//             .catch((error) => {
//               console.log(error);
//               console.log("error occured while checking for verified user");
//               res.send("error occured while checking for verified user");
//             });
//         } else {
//           bcrypt
//             .compare(uniqueString, hashedUniqueString)
//             .then((result) => {
//               if (result) {
//                 userModel
//                   .updateOne({ _id: userId }, { verified: true })
//                   .then(() => {
//                     userVerificationModel
//                       .deleteOne({ userId })
//                       .then(() => {
//                         console.log("verification successful");
//                         res.redirect(
//                           "https://hchat-y379.vercel.app/getStarted/successOrFail/Your%20account%20has%20been%20successfully%20verified.%20You%20can%20now%20Login"
//                         );
//                       })
//                       .catch((error) => {
//                         console.log(error);
//                         console.log(
//                           "an error occured while finalizing verification"
//                         );
//                         res.send(
//                           "an error occured while finalizing verification"
//                         );
//                       });
//                   })
//                   .catch((error) => {
//                     console.log(error);
//                     console.log("an error occured while updating user record");
//                     res.send("an error occured while updating user record");
//                   });
//               } else {
//                 console.log(
//                   "invalid verification details passed. check your inbox"
//                 );
//                 res.send(
//                   "invalid verification details passed. check your inbox"
//                 );
//               }
//             })
//             .catch((err) => {
//               console.log(err);

//               console.log(
//                 "an error occured while comparing the unique strings"
//               );
//               res.send("an error occured while comparing the unique strings");
//             });
//         }
//       } else {
//         console.log(
//           "account no exist or you have been verified already. please signup or login"
//         );
//         res.send(
//           "account no exist or you have been verified already. please signup or login"
//         );
//       }
//     })
//     .catch((error) => {
//       console.log(error);
//       res.send("an error occured while checking for verified user");
//     });
// };
// signup function
// signup function
// signup function
const signUp = async (req, res) => {
  try {
    const existingUser = await userModel.findOne({ email: req.body.email });
    if (existingUser) {
      return res.json({
        status: "FAILED",
        message: "User already exists. Please login",
      });
    }

    // Automatically mark user as verified
    req.body.verified = true;

    const newUser = new userModel(req.body);
    await newUser.save();

    res.json({
      status: "SUCCESS",
      message: "Account created successfully. You can now log in.",
    });
  } catch (err) {
    console.error(err);
    res.json({
      status: "FAILED",
      message: "An error occurred while signing up",
    });
  }
};

// login function
// login function

const login = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res.send({ message: "User does not exist", status: false });
    }

    const isValidPassword = await user.validatePassword(req.body.password);
    if (!isValidPassword) {
      return res.send({ message: "Wrong password", status: false });
    }

    const token = jwt.sign({ userId: user._id }, "your-secret-key", {
      expiresIn: "1h",
    });
    res.send({
      message: "Signed in successfully",
      status: true,
      token,
    });
  } catch (err) {
    console.error(err);
    res.send({ message: "Server error", status: false });
  }
};

// dashboard function
// dashboard function
// dashboard function

const dashboard = async (req, res) => {
  res.send({ message: "Hello, authenticated user!", user: req.user });
  console.log("user authenticated successfuly");
};

// authentication function
const authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    const decoded = jwt.verify(token, "your-secret-key");
    const user = await userModel.findById(decoded.userId);
    if (!user) throw new Error();
    req.user = user;
    next();
  } catch {
    res.status(401).send({ error: "Please authenticate" });
  }
};

// getting all users from db
// getting all users from db
// getting all users from db
const getUsers = async (req, res) => {
  const allUsers = await userModel.find();
  res.json(allUsers);
  console.log(allUsers);
};

// getting all groups from the data base
// getting all groups from the data base
// getting all groups from the data base
const getGroups = async (req, res) => {
  const allGroups = await groupModel.find();
  res.json(allGroups);
  console.log(allGroups);
};

// getting all broadcasts from the data base
// getting all broadcasts from the data base
// getting all broadcasts from the data base
const getBroadcasts = async (req, res) => {
  const allBroadcasts = await broadcastModel.find();
  res.json(allBroadcasts);
  console.log(allBroadcasts);
};

// sending a new group to the data base
// sending a new group to the data base
// sending a new group to the data base

const newGroup = async (req, res) => {
  console.log(req.body);
  try {
    let newGroup = new groupModel(req.body);
    newGroup.save();
    console.log("group successfully sent to the data base");
    res.send({
      message: "group successfully sent to the data base",
      status: true,
    });
  } catch (err) {
    console.log(err);
    res.send({
      message: "could mot create group",
      status: false,
    });
  }
};

// sending a new BROADCAST to the data base
const newBroadcast = async (req, res) => {
  console.log(req.body);
  try {
    let newBroadcast = new broadcastModel(req.body);
    newBroadcast.save();
    console.log("Broadcast successfully sent to the data base");
    res.send({
      message: "Broadcast successfully sent to the data base",
      status: true,
    });
  } catch (err) {
    console.log(err);
    res.send({
      message: "could mot create Broadcast",
      status: false,
    });
  }
};
// getting user's messages from the database
// const getMessages = async (req, res) => {
//   try {
//     const userId = req.query.userId;
//     const recipientId = req.query.recipientId;
//     // console.log(Fetching messages between ${userId} and ${recipientId});

//     const messages = await Message.find({
//       $or: [
//         { senderId: userId, recipientId: recipientId },
//         { senderId: recipientId, recipientId: userId },
//       ],
//     });
//     // console.log(Messages: ${messages});

//     if (messages.length === 0) {
//       // console.log("No messages found");
//     }

//     res.json(messages);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Error fetching messages" });
//   }
// };
const getMessages = async (req, res) => {
  try {
    const { userId, recipientId } = req.query;

    const messages = await Message.find({
      $or: [
        { senderId: userId, recipientId: recipientId },
        { senderId: recipientId, recipientId: userId },
      ],
    }).sort({ time: 1 }); // ✅ OLD → NEW (chat order)

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching messages" });
  }
};

// getting users with last message
const mongoose = require("mongoose");

const getUsersWithLastMessage = async (req, res) => {
  try {
    console.log("✅ HIT ROUTE");
    console.log("PARAMS:", req.params);

    const { userId } = req.params;

    console.log("USER ID RECEIVED:", userId);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log("❌ INVALID USER ID FORMAT");
      return res.status(400).json({ message: "Invalid user ID" });
    }

    console.log("✅ USER ID IS VALID");

    const users = await User.aggregate([
      {
        $match: { _id: { $ne: new mongoose.Types.ObjectId(userId) } },
      },
      {
        $lookup: {
          from: "messages",
          let: { otherUserId: { $toString: "$_id" } },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    {
                      $and: [
                        { $eq: ["$senderId", "$$otherUserId"] },
                        { $eq: ["$recipientId", userId] },
                      ],
                    },
                    {
                      $and: [
                        { $eq: ["$senderId", userId] },
                        { $eq: ["$recipientId", "$$otherUserId"] },
                      ],
                    },
                  ],
                },
              },
            },
            { $sort: { time: -1 } },
            { $limit: 1 },
          ],
          as: "lastMessage",
        },
      },
      {
        $unwind: {
          path: "$lastMessage",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: { "lastMessage.time": -1 },
      },
    ]);

    console.log("✅ USERS FETCHED:", users.length);

    res.json(users);
  } catch (err) {
    console.error("🔥 FULL SERVER ERROR BELOW 🔥");
    console.error(err); // ✅ THIS WILL SHOW TRUE ERROR IN RENDER LOGS

    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};
// getting group's messages from the database
const getGroupMessages = async (req, res) => {
  try {
    const groupId = req.query.groupId;
    console.log(groupId); // Log the groupId
    const groupMessages = await GroupMessage.find({ groupId });
    console.log("group mess bel");
    // console.log(groupMessages);

    res.json(groupMessages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching messages" });
  }
};

// getting broadcast messages from the database

const getBroadcastMessages = async (req, res) => {
  try {
    const userId = req.query.userId;
    const broadcastMessages = await BroadcastMessage.aggregate([
      {
        $match: {
          members: { $in: [userId] },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "senderId",
          foreignField: "_id",
          as: "sender",
        },
      },
      {
        $unwind: {
          path: "$sender",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);
    console.log("bromessage below");
    console.log(broadcastMessages);
    res.json(broadcastMessages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching messages" });
  }
};

// posting status
const newStatus = async (req, res) => {
  try {
    const {
      type,
      text,
      file,
      voice,
      image,
      userId: bodyUserId,
      userName: bodyUserName,
    } = req.body;

    // use JWT user if available, else fallback to userId and username from frontend
    const userId = req.user?.id || req.user?._id || bodyUserId;
    const userName = req.user?.userName || req.user?.nickName || bodyUserName;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID missing" });
    }

    let filePath = null;
    const uploadDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

    const saveBase64File = (base64Data, prefix, ext) => {
      const base64String = base64Data.split(",")[1];
      const buffer = Buffer.from(base64String, "base64");
      const filename = `${prefix}-${Date.now()}.${ext}`;
      const fullPath = path.join(uploadDir, filename);
      fs.writeFileSync(fullPath, buffer);
      return `/uploads/${filename}`;
    };

    if (type === "file" && file) {
      const ext = file.match(/^data:(.+?);/)[1].split("/")[1] || "bin";
      filePath = saveBase64File(file, "file", ext);
    } else if (type === "voice" && voice) {
      filePath = saveBase64File(voice, "voice", "webm");
    } else if (type === "camera" && image) {
      filePath = saveBase64File(image, "camera", "png");
    }

    // ✅ Save userName properly
    const newStatus = new statusModel({
      userId,
      userName: userName || "Unknown",
      type,
      content: text || null,
      filePath,
    });

    await newStatus.save();

    res.status(201).json({
      success: true,
      message: "Status saved successfully",
      data: newStatus,
    });
  } catch (error) {
    console.error("Error saving status:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// get all statuses
const getStatuses = async (req, res) => {
  try {
    const statuses = await statusModel.find().sort({ createdAt: -1 }); // newest first
    res.status(200).json({
      success: true,
      statuses,
    });
  } catch (error) {
    console.error("Error fetching statuses:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching statuses",
    });
  }
};
module.exports = {
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
  getUsersWithLastMessage,
};
