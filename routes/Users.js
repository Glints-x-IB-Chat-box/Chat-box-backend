const express = require("express");
const router = express.Router();
const userController = require("../controllers/Users");

router.post("/register", userController.register);
router.post("/login", userController.authenticated);
router.get("/get", userController.getAllData);
router.get("/get/:usersId", userController.getDataById);
router.delete("/delete/:usersId", userController.deleteById);

module.exports = router;
