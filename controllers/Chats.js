const Chat = require("../models/Chat");
const User = require("../models/Users");
const mongoose = require("mongoose");

module.exports = {
  getChat: (req, res) => {
    Chat.find()
      .then((response) => res.json(response))
      .catch((err) => res.status(500).json(err));
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
        // usersId: {
        //   $all: [
        //     {
        //       $elemMatch: {
        //         $eq: mongoose.Types.ObjectId(req.body.senderUserId),
        //       },
        //     },
        //     {
        //       $elemMatch: {
        //         $eq: mongoose.Types.ObjectId(req.body.targetUserId),
        //       },
        //     },
        //   ],
        // },
        usersId: {
          $all: [
            {
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
      .catch((err) => res.status(500).json(err));
  },
  deleteChat: (req, res) => {
    Chat.findByIdAndRemove({ _id: req.params.chatId })
      .then((response) => res.json(response))
      .catch((err) => res.status(500).json(err));
  },
  getChatById: (req, res) => {
    Chat.findById(req.params.chatId)
      .then((result) => res.json(result))
      .catch((err) => res.status(500).json(err));
  },
  getChatByTarget: (req, res) => {
    Chat.find({ usersId: { $all: [req.body.userId, req.params.targetUserId] } })
      .then((result) => res.json(result))
      .catch((err) => res.status(500).json(err));
  },
};
