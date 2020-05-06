const User = require("../models/Users");
const Bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const privateKey = process.env.PRIVATE_KEY;
module.exports = {
  register: function (req, res, next) {
    User.create({
      email: req.body.email,
      username: req.body.username,
      phoneNumber: req.body.phoneNumber,
      password: req.body.password,
    })
      .then((response) => res.json(response))
      .catch((err) => {
        throw err;
      });
  },

  // authenticated: function (req, res, next) {
  //   User.findOne({ username: req.body.username || { email: req.body.email } })
  //     .then((response, err) => {
  //       if (err) next(err);
  //       else {
  //         if (
  //           response != null &&
  //           Bcrypt.compareSync(req.body.password, response.password)
  //         ) {
  //           jwt.sign(
  //             {
  //               id: response._id,
  //             },
  //             privateKey,
  //             { expiresIn: 60 * 60 },
  //             (err, token) => {
  //               res.json(token);
  //             }
  //           );
  //         } else {
  //           res.json({ status: err });
  //         }
  //       }
  //     })
  //     .catch((err) => {
  //       throw err;
  //     });
  // },
  emailAuthenticated: function (req, res, next) {
    User.findOne({ email: req.body.email })
      .then((response, err) => {
        if (err) next(err);
        else {
          if (
            response != null &&
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
  usernameAuthenticated: function (req, res, next) {
    User.findOne({ username: req.body.username })
      .then((response, err) => {
        if (err) next(err);
        else {
          if (
            response != null &&
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
  phoneNumberAuthenticated: function (req, res, next) {
    User.findOne({ phoneNumber: req.body.phoneNumber })
      .then((response, err) => {
        if (err) next(err);
        else {
          if (
            response != null &&
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

  getAllData: (req, res, next) => {
    User.find({})
      .then((result) => {
        res.json({ status: "200", data: result });
      })
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
      about: req.body.about,
      imageUrl: req.file && req.file.path,
    })
      .then((result) => res.json(result))
      .catch((err) => res.json(err));
  },
};
