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
          res.status
          return error(
            res,
            {
              status: 'error',
              message: `email ${req.body.email} already exist, are you forgot or want to create new one`
            }
          );
        } else {
          User.findOne({ username: req.body.username }).then((user) => {
            if (user) {
              return error(
                res,
                {
                  status: 'error',
                  message: `username ${req.body.username} already exist, are you forgot or want to create new one`
                }
              );
            } else {
              User.findOne({ phoneNumber: req.body.phoneNumber }).then(
                (user) => {
                  if (user) {
                    return error(
                      res,
                      {
                        status: `error`,
                        message: `phone number ${req.body.phoneNumber} already exist, please input another phone number`
                      }
                    );
                  } else {
                    User.create(obj);
                    return success(res, {
                      status: 'success',
                      message: "succes create account"
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
              { expiresIn: 60 * 60 },
              (err, token) => {
                res.json(token);
              }
            );
          } else {
            res.json({ status: err });
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
    User.findById(req.params.usersId)
      .then((result) => res.json(result))
      .catch((err) => res.json(err));
  },
  deleteById: (req, res) => {
    User.findByIdAndRemove(req.params.usersId)
      .then((result) => res.json(result))
      .catch((err) => res.json(err));
  },
  editById: (req, res) => {
    User.findByIdAndUpdate(req.params.usersId, {
      username: req.body.username,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
      about: req.body.about,
      image: req.file && req.file.path,
    })
      .then((result) => res.json(result))
      .catch((err) => res.json(err));
  },
};
