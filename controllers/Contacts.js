const Contact = require("../models/Contacts");
const UserContact = require("../models/Users");
module.exports = {
  addContact: (req, res) => {
    UserContact.findOneAndUpdate(
      {
        //$and all requirement must be true
        $and: [
          //validate user can't add himself
          { _id: req.body.userId },
          { _id: { $ne: req.body.userContactId } },
          //validate user can't add same contact
          { contacts: { $nin: [req.body.userContactId] } },
        ],
      },
      { $push: { contacts: req.body.userContactId } },
      {
        upsert: true,
        new: true,
      }
    )
      // Contact.create({
      //   userId: req.body.userId,
      // })

      .then((result) => {
        UserContact.findById(
          { _id: req.body.userContactId },
          {
            _id: 1,
            username: 1,
            image: 1,
            email: 1,
            phoneNumber: 1,
            about: 1,
          }
        ).then((result) => {
          res.json(result);
        });
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },
  getContact: (req, res) => {
    UserContact.findById(req.body.userId)

      // Contact.find({})
      //   .populate({
      //     path: "userId",
      //     select: ["username", "email", "image", "about", "phoneNumber"],
      //   })
      .then((result) => {
        UserContact.find(
          { _id: { $in: result.contacts } },
          {
            _id: 1,
            username: 1,
            image: 1,
            email: 1,
            phoneNumber: 1,
            about: 1,
          }
        ).then((result) => {
          res.json(result);
        });
      })
      //.then(res.json)
      .catch((err) => {
        res.json(err);
      });
  },
  getContactById: (req, res) => {
    console.log(req.params.contactId);
    UserContact.findById(req.params.contactId)
      .select({
        _id: 1,
        username: 1,
        image: 1,
        email: 1,
        phoneNumber: 1,
        about: 1,
      })
      .then((result) => res.json(result))
      .catch((err) => res.status(500).json(err));
  },
  searchContact: (req, res) => {
    const username = new RegExp(req.query["username"], "i");
    console.log(username);
    UserContact.find({ username })
      .select("-password")
      .then((result) => res.json(result))
      .catch((err) => res.status(500).json(err));
  },
  deleteContactById: (req, res) => {
    // Contact.findByIdAndRemove(req.params.contactId)
    console.log(req.params.contactId);
    UserContact.findOneAndUpdate(
      { _id: req.body.userId },
      { $pull: { contacts: req.params.contactId } },
      {
        upsert: true,
        new: true,
      }
    )
      .then((result) => res.json(result))
      .catch((err) => res.status(500).json(err));
  },
};
