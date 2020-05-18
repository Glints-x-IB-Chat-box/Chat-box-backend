const express = require("express");
const ChatController = require("../controllers/Chats");
const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
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
