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
router.post("/loginemail", userController.emailAuthenticated);
router.post("/loginusername", userController.usernameAuthenticated);
router.post("/loginphonenumber", userController.phoneNumberAuthenticated);
router.get("/get", userController.getAllData);
router.get("/get/:usersId", userController.getDataById);
router.delete("/delete/:usersId", userController.deleteById);
router.put(
  "/edit/:usersId",
  upload.single("imageUrl"),
  userController.editById
);

module.exports = router;
