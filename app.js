const express = require("express");
const app = express()
const http = require('http')
const path = require("path");
const socketio = require('socket.io')
const server = http.createServer(app)
const io = socketio(server)
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();


const privateKey = process.env.PRIVATE_KEY;
mongodConnect = process.env.DB_CONNECTION;
mongoose.connect(
  mongodConnect,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  () => console.log("mongodb connected")
);


const indexRouter = require("./routes/index");
const usersRouter = require("./routes/Users");
const ChatRouter = require("./routes/Chat");
const contactsRouter = require("./routes/Contacts");


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
app.use("/usersSecure", validateUser, usersRouter);
app.use("/chat", validateUser, ChatRouter);
app.use("/contacts", validateUser, contactsRouter);

io.on('connection', (socket) => {

  console.log('a user connected');
  socket.emit('connected', {user: 'You', text: `connected to circle chatbox`})
  socket.on('sendMessage',(message ,callback) => {
    // const user = getUser(socket.id);
    // io.to(user.room).emit('message')
    socket.emit('message', {user: 'You', text: `can chat with in private`})
  })

  // ${user.name} 
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  
});


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
port = 8000
server.listen(`${port}`, () => console.log(`server is running on ${port}`))

module.exports = app;
