const express = require("express");
const router = express.Router();
const userController = require("../controllers/Users");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, "./public/usersImage/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
});
const upload = multer({
  storage: storage,
});
router.post("/register", userController.register);
router.post("/login", userController.authenticated);
router.get("/get", userController.getAllData);
router.get("/get/:usersId", userController.getDataById);
router.get("/getProfile", userController.getDataById); //userId is retrieved from token
router.get("/searchuser", userController.searchUsername);
router.delete("/delete/:usersId", userController.deleteById); //userId can be retrieved from token
router.put("/edit", upload.single("image"), userController.editById); //userId is retrieved from token
router.post("/blocked", userController.blockedUser);
router.get("/getBlocked", userController.getBlocked);
module.exports = router;
