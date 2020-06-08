const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema(
  {
    senderUserId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: [, "deliver", "read"],
      default: "deliver",
    },
    images: { type: Array, default: [] },

    documents: { type: Array, default: [] },
  },
  { timestamps: true }
);
const chatSchema = new Schema({
  messages: [messageSchema],
  usersId: [
    {
      //if chat is private, then this should have values
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  groupId: {
    //if chat belong to group
    type: Schema.Types.ObjectId,
    ref: "group",
  },
});

module.exports = mongoose.model("chat", chatSchema);
