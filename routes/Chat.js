const express = require("express");
const ChatController = require("../controllers/Chats");
const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/chatImage/");
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
router.post("/postchat", upload.array("image", 10), ChatController.postChat);
router.delete("/deletechat/:chatId", ChatController.deleteChat);

module.exports = router;
