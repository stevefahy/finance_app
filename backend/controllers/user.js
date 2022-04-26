const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const SETTINGS = require("../settings/setting.ts");

exports.createUser = (req, res, next) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) return res.status(401).json({
      message: "signup_error_username_general"
    });
    if (user) {
      // User already exists
      return res.status(401).json({
        message: "signup_error_username"
      });
    }
    bcrypt.hash(req.body.password, 10, (err, hash) => {
      if (err) return res.status(401).json({
        message: "signup_error_password_general"
      });
      const user = new User({
        email: req.body.email,
        password: hash
      });
      return user.save()
        .then(result => {
          res.status(201).json({
            message: "User created!",
            result: result
          });
        })
        .catch(err => {
          res.status(500).json({
            message: "signup_error_password_general"
          });
        });
    });
  });
}

exports.userLogin = (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) return res.status(401).json({
      message: "login_error_username_general"
    });
    // User not found
    if (!user) {
      return res.status(401).json({
        message: "login_error_username"
      });
    }
    // User found
    fetchedUser = user;
    // check password
    bcrypt.compare(req.body.password, user.password, (err, password) => {
      if (err) return res.status(401).json({
        message: "login_error_password_general"
      });
      if (!password) {
        return res.status(401).json({
          message: "login_error_password"
        });
      }
      // Password matches!
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        process.env.JWT_KEY,
        { expiresIn: SETTINGS.EXPIRESIN }
      );
      res.status(200).json({
        token: token,
        expiresIn: SETTINGS.EXPIRESIN,
        userId: fetchedUser._id
      });
    })
  })
}
