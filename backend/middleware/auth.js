const ErrorHandler = require("../utils/errorhandler");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("../config/config.env").config;

exports.isAuthenticatedUser = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    console.log("i am in errror of token not found");
    return next(new ErrorHandler("Please LogIn to aceess this feature ", 401));
  }

  const decodedData = jwt.verify(token, process.env.JWTPrivateKey);

  req.user = await User.findById(decodedData.id);
  next();
};

exports.authorisedUser = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler("You are not allwed to perform given action", 403)
      );
    }
    next();
  };
};
