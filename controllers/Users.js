const User = require("../models/Users");
const Bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const privateKey = "iniprivatekey";
module.exports = {
  register: function (req, res) {
    User.create({
      name: req.body.name,
      username: req.body.username,
      mobile: req.body.mobile,
      email: req.body.email,
      password: req.body.password,
    })
      .then((response) => res.json(response))
      .catch((err) => {
        throw err;
      });
  },

  authenticated: function (req, res, next) {
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

  getAllData: (req, res) => {
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
};
