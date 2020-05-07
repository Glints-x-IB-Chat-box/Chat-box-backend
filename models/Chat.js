const mongoose = require('mongoose')
const Schema = mongoose.Schema

const messageSchema = new Schema({
    senderUserId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'user'
    },
    message: String,
    status: {
      type: String,
      enum: ['pending', 'sent', 'delivered', 'read'],
      default: 'pending'
    },
    image: String,
    time: {
      type: Number, 
      default: (new Date()).getTime()
    }
})
const chatSchema = new Schema({
    messages: [messageSchema],
    usersId: [{
        //if chat is private, then this should have values
        type: Schema.Types.ObjectId,
        ref: 'user'
    }],
    groupId: {
        //if chat belong to group
        type: Schema.Types.ObjectId,
        ref: 'group'
    }
})

module.exports = mongoose.model('chat', chatSchema)