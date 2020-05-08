const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const saltRounds = 10;

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
    default:
      "https://i0.wp.com/www.repol.copl.ulaval.ca/wp-content/uploads/2019/01/default-user-icon.jpg",
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
  contacts: {
    type: Schema.Types.ObjectId,
    ref: "contact",
  },
});

userSchema.pre("save", function (next) {
  this.password = bcrypt.hashSync(this.password, saltRounds);
  next();
});
module.exports = mongoose.model("user", userSchema);
