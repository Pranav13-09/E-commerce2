const Errorhandler = require("../utils/errorhandler");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { sendToken } = require("../utils/jwtTken");
const { isAuthenticatedUser } = require("../middleware/auth");
const crypto = require("crypto");
const cloudinary = require("cloudinary");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

const nodemailer = require("nodemailer");
const req = require("express/lib/request");
const res = require("express/lib/response");

// Registering a user
exports.RegisterUser = async (req, res, next) => {
  console.log(" i am inside");
  // if alreafdy a user not allowed to

  const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: "avatars",
    width: 150,
    crop: "scale",
  });

  const { name, email, password } = req.body;

  console.log(name, "i am name");
  const check = await User.findOne({ email: email });

  if (check) {
    console.log("i am inside check");
    return res
      .status(400)
      .json({ message: "user already registerd . please login to continue" });
  }

  let user = await User.create({
    name,
    email,
    password,
    avatar: {
      publicId: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });

  sendToken(user, 201, res);
};

//login as users

exports.LogInUser = async (req, res, next) => {
  const { email, password } = req.body;
  console.log(email, password);
  if (!email || !password) {
    return next(new Errorhandler("Enter your email and password", 400));
  }

  let user = await User.findOne({ email: email });
  if (!user) {
    return next(new Errorhandler("Invalid email or password", 400));
  }
  let verifiedUser = await user.comparePassword(password);

  if (!verifiedUser) {
    return next(new Errorhandler("Invalid email or password", 400));
  }
  sendToken(user, 200, res);
};

//LOGOUT USERS
exports.LogOutUser = async (req, res, next) => {
  res.cookie("token", null, {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(200).json({ suceess: true, message: "logged out sucessfully" });
};

//send link to reset a password
exports.ForgotPassword = async (req, res, next) => {
  console.log("i am inside forgot password");
  const { email } = req.body;
  let user = await User.findOne({ email: email });
  if (!user) {
    return next(new Errorhandler("Invalid email"));
  }
  const token = await user.getResetPassword();
  console.log(token);
  await user.save();
  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/user/password/reset/${token}`;
  try {
    const transporter = await nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "pranavmore20@cse.iiitp.ac.in",
        pass: "CHAKRAvartin",
      },
    });
    await transporter.sendMail({
      to: user.email,
      subject: "Verify Acoount",
      html: `Click <a href = ${resetPasswordUrl}>here</a> to  reset your password.`,
    });
    res.status(200).json({ success: true });
  } catch (err) {
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;
    await user.save();
    next(new Errorhandler(err.message, 500));
  }
};

exports.resetPassword = async (req, res, next) => {
  const { confirmPassword, resetPassword } = req.body;
  const token = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  if (!confirmPassword || !resetPassword) {
    return next(new Errorhandler("Please confirm your password", 400));
  }
  if (confirmPassword !== resetPassword) {
    return next(new Errorhandler("Confirm password does not match", 400));
  }
  let user = await User.findOne({ resetPasswordToken: token });
  if (!user) {
    return next(new Errorhandler("Reset paassword token does not match", 400));
  }
  if (Date.now() > user.resetPasswordExpire) {
    return next(new Errorhandler("This link is expired", 400));
  }

  user.password = confirmPassword;
  user.resetPasswordToken = null;
  user.resetPasswordExpire = null;
  await user.save();
  sendToken(user, 201, res);
};

exports.getUserDetails = async (req, res, next) => {
  console.log(req.user);
  let user = await User.findById(req.user.id).select({ password: 0 });
  console.log(user, "i am user");
  res.status(200).json({ suceess: true, user });
};

exports.updatePassword = async (req, res, next) => {
  console.log("I AM INSIDE UPDATE PASSWORD");
  const { oldPassword, newPassword, confirmPassword } = req.body;
  console.log(req.body);
  let user = await User.findById(req.user.id);
  const verified = await user.comparePassword(oldPassword);
  if (!verified) {
    return next(new Errorhandler("Invalid password", 400));
  }
  if (newPassword !== confirmPassword) {
    return next(
      new Errorhandler("Confirm password does not match new password")
    );
  }
  user.password = newPassword;
  await user.save();
  sendToken(user, 200, res);
};

exports.updateProfile = async (req, res, next) => {
  const { name, email } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      $set: {
        name: name,
        email: email,
      },
    },
    { new: true }
  );
  res
    .status(200)
    .json({ success: true, message: "Profile updated successfully" });
};

// admin routes
//get all users from
exports.getAllUsers = async (req, res, next) => {
  console.log("i am in user admin get");
  const users = await User.find();
  res.status(200).json({ success: true, users });
};

exports.getSingleUser = async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findById(id);
  if (!user) {
    return next(new Errorhandler("User not found", 404));
  }
  res.status(200).json({ success: true, user });
};

exports.updateUserRole = async (req, res, next) => {
  const { role, email, name } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        role: role,
        name: name,
        email: email,
      },
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );
  res.status(200).json({ suceess: true });
};

exports.deleteUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return new Errorhandler("USER NOT FOUND", 404);
  }
  await user.remove();
  res.status(200).json({ suceess: true, message: "User deleted successfully" });
};
