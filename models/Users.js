const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const saltRounds = 10;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  image: {
    type: String,
    default:
      "https://raw.githubusercontent.com/ozy-ahmad/images/master/users.png",
  },
  about: {
    type: String,
    default: "Hi, I'm using Circle Messenger",
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  // contacts: {
  //   type: Schema.Types.ObjectId,
  //   ref: "contact",
  // },
  contacts: {
    type: Array,
  },
});

userSchema.pre("save", function (next) {
  this.password = bcrypt.hashSync(this.password, saltRounds);
  next();
});
module.exports = mongoose.model("user", userSchema);
