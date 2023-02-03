const Errorhandler = require("../utils/errorhandler");
module.exports = (err, req, res, next) => {
  console.log(" i am in err.js");
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server error";

  if (err.name === "Casterror") {
    const message = `Resource not found Invalid :${err.path}`;
    new Errorhandler(message, 400);
  }
  if (err.name === "JsonWebTokenError") {
    const message = `Json Web Token is invalid, Try again `;
    err = new ErrorHandler(message, 400);
  }

  // JWT EXPIRE error
  if (err.name === "TokenExpiredError") {
    const message = `Json Web Token is Expired, Try again `;
    err = new Errorhandler(message, 400);
  }
  console.log(err.message, "i am error message");
  console.log(err.name);
  res.status(err.statusCode).json({
    sucess: false,
    message: err.stack,
  });
};
