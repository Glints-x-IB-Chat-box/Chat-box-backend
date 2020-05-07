const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const saltRounds = 10;

const contactSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'user'
  },
  chatId: {
    type: Schema.Types.ObjectId,
    ref: 'chat'
  }
})
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: false,
  },
  about: {
    type: String,
    default: "Hi, I'm using Chat Boxos",
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  contacts: [contactSchema]
})

userSchema.pre("save", function (next) {
  this.password = bcrypt.hashSync(this.password, saltRounds);
  next();
});
module.exports = mongoose.model("user", userSchema);
