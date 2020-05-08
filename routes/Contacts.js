const express = require("express");
const router = express.Router();
const contactController = require("../controllers/Contacts");

router.post("/addcontact", contactController.addContact);
router.get("/get", contactController.getContact);
router.get("/get/:contactId", contactController.getContactById);
router.delete("/delete/:contactId", contactController.deleteContactById);

module.exports = router;
