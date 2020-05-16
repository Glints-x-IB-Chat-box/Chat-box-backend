const Contact = require("../models/Contacts");
const UserContact = require("../models/Users");
module.exports = {
  addContact: (req, res) => {
    // console.log(req.body);
    // if (req.body.userId === req.body.userContactId) {
    //   return res.status(400).json({ message: "Cannot add your own contact" });
    // } else
    UserContact.findOneAndUpdate(
      {
        $and: [
          { _id: req.body.userId },
          { _id: { $ne: req.body.userContactId } },
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
        console.log(result);
        res.json(result);
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
  // getContactById: (req, res) => {
  //   Contact.findById(req.params.contactId)
  //     .populate({
  //       path: "userId",
  //       select: ["username", "email", "image", "about", "phoneNumber"],
  //     })
  //     .then((result) => res.json(result))
  //     .catch((err) => res.json(err));
  // },
  // searchContact: (req, res) => {
  //   const username = new RegExp(req.body["username"], "i");
  //   console.log(username);
  //   Contact.find({ username })
  //     .then((result) => res.json(result))
  //     .catch((err) => {
  //       throw err;
  //     });
  // },
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
