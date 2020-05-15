var express = require("express");
var path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const privateKey = process.env.PRIVATE_KEY;
mongodConnect = process.env.DB_CONNECTION;
mongoose.connect(
  mongodConnect,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  () => console.log("mongodb connected")
);

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/Users");
const ChatRouter = require("./routes/Chat");
const contactsRouter = require("./routes/Contacts");
var app = express();

app.use(cors());
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/public/chatImage", express.static("public"));
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/chat", validateUser, ChatRouter);
app.use("/contacts", validateUser, contactsRouter);

function validateUser(req, res, next) {
  jwt.verify(req.headers["x-access-token"], privateKey, (err, decoded) => {
    if (err) {
      res.status(500).json(err);
    } else {
      req.body.userId = decoded.id;
      next();
    }
  });
}

module.exports = app;
