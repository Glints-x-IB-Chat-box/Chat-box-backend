const User = require("../models/Users");
const Bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { error, success } = require("./../utility/http-status-codes");
const status = require("http-status-codes");
require("dotenv").config();
const validationRegister = require("../validation/register");
const privateKey = process.env.PRIVATE_KEY;

module.exports = {
  register: (req, res, next) => {
    let obj = {
      username: req.body.username,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
    };
    const { errors, isValid } = validationRegister(obj);
    if (!isValid) {
      res.status(status.INTERNAL_SERVER_ERROR).json(errors);
    }
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (user) {
          res.status;
          return error(res, {
            status: "error",
            message: `Email ${req.body.email} already exist, are you forgot or want to create new one`,
          });
        } else {
          User.findOne({ username: req.body.username }).then((user) => {
            if (user) {
              return error(res, {
                status: "error",
                message: `Username ${req.body.username} already exist, are you forgot or want to create new one`,
              });
            } else {
              User.findOne({ phoneNumber: req.body.phoneNumber }).then(
                (user) => {
                  if (user) {
                    return error(res, {
                      status: `error`,
                      message: `Phone number ${req.body.phoneNumber} already exist, please input another phone number`,
                    });
                  } else {
                    User.create(obj);
                    return success(res, {
                      status: "success",
                      message: "Success create account!",
                    });
                  }
                }
              );
            }
          });
        }
      })
      .catch((err) => {
        throw err;
      });
  },

  authenticated: function (req, res, next) {
    let { email, username, phoneNumber } = req.body;
    let conditions = !!email ? { email: email } : { phoneNumber: phoneNumber };
    if (username) {
      conditions = {
        username,
      };
    } else if (email) {
      conditions = {
        email,
      };
    } else if (phoneNumber) {
      conditions = {
        phoneNumber,
      };
    }
    User.findOne({ ...conditions })
      .then((response, err) => {
        console.log(response);

        if (err) next(err);
        else {
          if (
            response !== null &&
            Bcrypt.compareSync(req.body.password, response.password)
          ) {
            jwt.sign(
              {
                id: response._id,
              },
              privateKey,
              { expiresIn: "24h" },
              (err, token) => {
                res.json({
                  status: "success",
                  data: {
                    token,
                  },
                });
              }
            );
          } else {
            res.json({
              status: "error",
              message: "User not found or password is wrong",
            });
          }
        }
      })
      .catch((err) => {
        throw err;
      });
  },
  getAllData: (req, res) => {
    User.find({})
      .then((result) => res.json(result))
      .catch((err) => err);
  },
  getDataById: (req, res) => {
    userId = req.params.usersId || req.body.userId
    User.findById(userId)
      .then((result) => res.json(result))
      .catch((err) => res.json(err));
  },
  searchUsername: (req, res) => {
    const username = new RegExp(req.query["username"], "i");
    User.find({ username })
      .select("-password")
      .then((result) => res.json(result))
      .catch((err) => res.json(err));
  },
  deleteById: (req, res) => {
    userId = req.body.userId
    User.findByIdAndRemove(userId)
      .then((result) => res.json(result))
      .catch((err) => res.json(err));
  },
  editById: (req, res) => {
    userId = req.body.userId
    User.findById(userId)
      .then((result) => {
        User.findByIdAndUpdate(
            userId, {
              username: req.body.username || result.username,
              about: req.body.about || result.about,
              image: req.file && req.file.path || result.image,
            }, {
              new: true,
            }
          )
          .then((result) => res.json(result))
          .catch((err) => res.json(err));
      })
      .catch((err) => res.json(err));

  },
};