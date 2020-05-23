const express = require("express");
const ChatController = require("../controllers/Chats");
const router = express.Router();
const multer = require("multer");
const moment = require("moment");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, moment().format("L") + file.originalname);
  },
});
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 20,
  },
});
router.get("/getchat", ChatController.getChat);
router.post(
  "/postchat",
  upload.fields([
    {
      name: "images",
      maxCount: 12,
    },
    {
      name: "documents",
      maxCount: 12,
    },
  ]),
  ChatController.postChat
);
router.delete("/deletechat/:chatId", ChatController.deleteChat);
router.get("/getbyid/:chatId", ChatController.getChatById);
router.get("/gettarget/:targetUserId", ChatController.getChatByTarget);
module.exports = router;
