const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ChatSchema = new Schema({
    // idUser: {type: , ref: ''},
    message: {type: String},
    status: {type: Boolean, default: false},
    imageUrl: {type: String},
    time: {type: Number, default: (new Date()).getTime()}
})
module.exports = mongoose.model('Chat', ChatSchema)