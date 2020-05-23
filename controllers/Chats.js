const Chat = require("../models/Chat");
const User = require("../models/Users");
const mongoose = require("mongoose");
module.exports = {
  //this controller for recent chat each user
  getChat: (req, res) => {
    //distinct is for unique value
    Chat.distinct("usersId", {
      usersId: {
        $in: [mongoose.Types.ObjectId(req.body.userId)],
      },
    })
      .then((usersId) => {
        User.find({
          _id: {
            $in: usersId,
            $ne: mongoose.Types.ObjectId(req.body.userId), //to validate user cant showing himself
          },
        })
          .select({
            _id: 1,
            username: 1,
            image: 1,
            email: 1,
            phoneNumber: 1,
            about: 1,
          })
          .then((response) => {
            res.json(response);
          });
      })

      .catch((err) => res.status(400).json(err));
  },
  postChat: (req, res) => {
    /**
     * required:
     * req.body.senderUserId
     *
     * optional:
     * req.params.chatId
     * req.body.groupId OR req.body.targetUserId
     * req.body.message
     * req.body.image
     */
    var req = req; //send req value to global
    let condition;
    let update;
    if (req.body.groupId) {
      condition = {
        groupId: req.body.groupId, //this used if chat group needs to be update/insert
      };
      update = {
        groupId: req.body.groupId,
      };
    }
    if (req.body.targetUserId) {
      condition = {
        ...condition,
        usersId: {
          // The $all operator selects the documents where the value of a field is an array that contains all the specified elements.
          $all: [
            {
              //$elemMatch = find the element match with the data
              $elemMatch: {
                $eq: mongoose.Types.ObjectId(req.body.senderUserId),
              },
            },
            {
              $elemMatch: {
                $eq: mongoose.Types.ObjectId(req.body.targetUserId),
              },
            },
          ],
        }, //this used if private chat needs to be update/insert
      };

      update = {
        ...update,
        usersId: [req.body.senderUserId, req.body.targetUserId],
      };
    }

    let images = [];
    if (req.files) {
      if (req.files.images) {
        for (let i = 0; i < req.files.images.length; i++) {
          images.push(req.files.images[i].originalname);
        }
      }
    }
    let documents = [];
    if (req.files) {
      if (req.files.documents) {
        for (let i = 0; i < req.files.documents.length; i++) {
          documents.push(req.files.documents[i].originalname);
        }
      }
    }
    Chat.findOneAndUpdate(
      { ...condition },
      {
        $push: {
          //push message to chat
          messages: {
            senderUserId: req.body.senderUserId,
            message: req.body.message,
            images: images,
            documents: documents,
          },
        },
        // set is update base on obeject of "update" variable
        $set: {
          ...update,
        },
      },
      {
        upsert: true, //if chat not exist, then create, other than that insert
        new: true, //result return is updated value
      }
    )
      .then((response) => {
        console.log(req.file && req.file.path), res.json(response);
      })
      .catch((err) => res.status(400).json(err));
  },
  deleteChat: (req, res) => {
    Chat.findByIdAndRemove({ _id: req.params.chatId })
      .then((response) => res.json(response))
      .catch((err) => res.status(400).json(err));
  },
  getChatById: (req, res) => {
    Chat.findById(req.params.chatId)
      .populate("user")
      .then((result) => res.json(result))
      .catch((err) => res.status(400).json(err));
  },
  getChatByTarget: (req, res) => {
    // console.log(req.body.userId, req.params.targetUserId);
    Chat.find({
      usersId: {
        $all: [
          {
            $elemMatch: {
              $eq: mongoose.Types.ObjectId(req.body.userId),
            },
          },
          {
            $elemMatch: {
              $eq: mongoose.Types.ObjectId(req.params.targetUserId),
            },
          },
        ],
      },
    })
      // .sort("-createdAt")
      // .limit(5)
      .populate("usersId")
      .select("-password")
      .then((result) => res.json(result))
      .catch((err) => res.status(400).json(err));
  },
};
