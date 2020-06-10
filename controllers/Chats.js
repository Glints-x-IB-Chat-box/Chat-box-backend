const Chat = require("../models/Chat");
const User = require("../models/Users");
const mongoose = require("mongoose");

const checkIsCanChat = (userId, userId2) => {
  //this function for checking the contact is blocked or not
  return new Promise((resolve, reject) => {
    User.find({
      $or: [
        // selects the documents that satisfy at least one of the <expressions>
        {
          $and: [
            //selects the documents that satisfy all the expressions in the array.
            {
              _id: mongoose.Types.ObjectId(userId),
            },
            {
              blocked: {
                $nin: [userId2],
              },
            },
          ],
        },
        {
          $and: [
            ////selects the documents that satisfy all the expressions in the array.
            {
              _id: mongoose.Types.ObjectId(userId2),
            },
            {
              blocked: {
                $nin: [userId],
              },
            },
          ],
        },
      ],
    })
      .then((response) => {
        resolve(response.length == 2);
        //resolve(response);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

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
  GetRecentChat: (req, res) => {
    Chat.aggregate([
      {
        $addFields: {
          lastMessage: { $arrayElemAt: ["$messages", -1] },
        },
      },
      {
        $match: {
          usersId: { $in: [mongoose.Types.ObjectId(req.body.userId)] },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "usersId",
          foreignField: "_id",
          as: "usersIds",
        },
      },
      {
        $unset: ["messages", "usersIds.password", "usersIds.contacts"],
      },
    ]).then((response) => {
      res.json(response);
    });
  },
  postChat: async (req, res) => {
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
    try {
      const isCanChat = await checkIsCanChat(
        req.body.senderUserId,
        req.body.targetUserId
      );
      if (isCanChat) {
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
      } else {
        res.status(400).json({
          message:
            "you are blocked this user or you have been blocked by this user",
        });
      }
    } catch (err) {
      res.status(400).json(err);
    }
  },
  postChat_backup: (req, res) => {
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
  getRecentChatIsContact: (req, res) => {
    //for query in database
    Chat.aggregate([
      {
        $addFields: {
          //add new field
          lastMessage: { $arrayElemAt: ["$messages", -1] }, //to get the last object in array
        },
      },
      {
        $match: {
          usersId: { $in: [mongoose.Types.ObjectId(req.body.userId)] }, //to filter userId in array which match with the user that login
        },
      },
      {
        $lookup: {
          //join other collection
          from: "users", //collection to join
          localField: "usersId", //field from the input document
          foreignField: "_id", //field from the documents of the "from" collection
          as: "usersIds", //output array field
        },
      },
      {
        $addFields: {
          //to create new field
          targetUserId: {
            $filter: {
              //to filter the item which match to the createria bellow
              input: "$usersIds", //data source which is an array
              as: "userId",
              cond: {
                $ne: ["$$userId._id", mongoose.Types.ObjectId(req.body.userId)], //find the user which is not the user that login
              },
            },
          },
        },
      },
      {
        $unwind: "$targetUserId", // to mutate the array to be an object
      },
      {
        $addFields: {
          senderUserId: {
            $filter: {
              input: "$usersIds",
              as: "userId",
              cond: {
                $eq: ["$$userId._id", mongoose.Types.ObjectId(req.body.userId)], //eq = equal, if equal the data will be true
              },
            },
          },
        },
      },
      {
        $unwind: "$senderUserId", // to mutate the array to be an object
      },
      {
        $addFields: {
          contacts: "$senderUserId.contacts", //to get the contacts of the user that login
        },
      },
      {
        $addFields: {
          isContact: {
            $cond: {
              if: {
                $eq: [
                  {
                    $size: {
                      //to count and returns the total number of items in an array.
                      $filter: {
                        input: "$contacts",
                        as: "contact",
                        cond: {
                          $eq: [
                            { $toObjectId: "$$contact" }, //to mutate the data to be an ObjectId
                            "$targetUserId._id", //to find the contact which equal with the targetUserId
                          ],
                        },
                      },
                    },
                  },
                  1, // if the contact match with the condition will be true
                ],
              },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $sort: { isContact: -1, "lastMessage.status": -1 }, //to sort the data which is the contact of the user will be at the top and sort last message status which is unread will be aat the top
      },
      {
        $unset: [
          // to hide the data
          "contacts",
          "usersIds",
          "senderUserId",
          "targetUserId.password",
          "targetUserId.contacts",
          "messages",
        ],
      },
    ])
      .then((response) => res.json(response))
      .catch((err) => res.status(400).json(err));
  },
};

module.exports.checkIsCanChat = checkIsCanChat;
