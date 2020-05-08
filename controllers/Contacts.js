const Contact = require("../models/Contacts");

module.exports = {
  addContact: (req, res) => {
    Contact.create({
      userId: req.body.userId,
    })

      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        res.json(err);
      });
  },
  getContact: (req, res) => {
    Contact.find({})
      .populate({
        path: "userId",
        select: ["username", "email", "image", "about", "phoneNumber"],
      })
      .then((result) => {
        res.json(result);
      })
      //.then(res.json)
      .catch((err) => {
        res.json(err);
      });
  },
  getContactById: (req, res) => {
    Contact.findById(req.params.contactId)
      .populate({
        path: "userId",
        select: ["username", "email", "image", "about", "phoneNumber"],
      })
      .then((result) => res.json(result))
      .catch((err) => res.json(err));
  },
  deleteContactById: (req, res) => {
    Contact.findByIdAndRemove(req.params.contactId)
      .then((result) => res.json(result))
      .catch((err) => res.json(err));
  },
};
