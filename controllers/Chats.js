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

    Chat.findOneAndUpdate(
      { ...condition },
      {
        $push: {
          //push message to chat
          messages: {
            senderUserId: req.body.senderUserId,
            message: req.body.message,
            image: req.file && req.file.path,
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
      .then((response) => res.json(response))
      .catch((err) => res.status(500).json(err));
  },
  deleteChat: (req, res) => {
    Chat.findByIdAndRemove({ _id: req.params.chatId })
      .then((response) => res.json(response))
      .catch((err) => res.status(500).json(err));
  },
};
