const User = require("../models/user");
const ErrorHandler = require("./errorhandler");
require("../config/config.env").config;

exports.sendToken = (user, statusCode, res) => {
  const token = user.generateAuthToken();
  const options = {
    httpOnly: true,
    expires: new Date(Date.now() + COOKIE_EXPIRATION * 24 * 60 * 60 * 1000),
  };
  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ user, success: true });
};
