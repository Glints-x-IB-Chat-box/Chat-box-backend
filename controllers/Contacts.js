const Contact = require("../models/Contacts");
const UserContact = require("../models/Users");
const { checkIsCanChat } = require("../controllers/Chats");
//console.log( checkIsCanChat);

removeContact = (userId, contactId) => {
  return new Promise((resolve, reject) => {
    UserContact.findOneAndUpdate(
      { _id: userId },
      //$pull for deleting one contact from contact list
      { $pull: { contacts: contactId } },
      {
        upsert: true,
        new: true,
      }
    )
      .then((result) => resolve(result))
      .catch((err) => reject(err));
  });
};

module.exports = {
  addContact: async (req, res) => {
    try {
      console.log("check is account");

      const isCanAdd = await checkIsCanChat(
        // or checkIscanAdd
        req.body.userId,
        req.body.userContactId
      );
      console.log(req.body.userId, req.body.userContactId);
      if (isCanAdd) {
        UserContact.findOneAndUpdate(
          {
            //$and all requirement must be true
            $and: [
              //validate user can't add himself
              { _id: req.body.userId },
              { _id: { $ne: req.body.userContactId } },
              //validate user can't add same contact
              {
                contacts: {
                  $nin: [req.body.userContactId],
                },
              },
              {
                blocked: {
                  $nin: [req.body.userContactId],
                },
              },
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
      } else {
        res.status(400).json({
          message:
            "you have blocked this user or you have been blocked by this user",
        });
      }
    } catch (err) {
      res.status(400).json(err);
    }
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
            status: 1,
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
    removeContact(req.body.userId, req.params.contactId)
      .then((result) => res.json(result))
      .catch((err) => res.status(500).json(err));
  },
};
module.exports.removeContact = removeContact;
