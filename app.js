var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/chat', {useNewUrlParser: true, useUnifiedTopology: true}, () => console.log('mongodb connected'));

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const ChatRouter = require('./routes/Chat')
var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/chat', ChatRouter)

module.exports = app;
