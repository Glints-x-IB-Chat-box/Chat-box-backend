const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contactSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  chatId: {
    type: Schema.Types.ObjectId,
    ref: "chat",
  },
});
module.exports = mongoose.model("contact", contactSchema);
