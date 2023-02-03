const express = require("express");
const {
  RegisterUser,
  LogInUser,
  LogOutUser,
  ForgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  getAllUsers,
  getSingleUser,
  updateUserRole,
  deleteUser,
  updateProfile,
} = require("../controllers/userController");
const { isAuthenticatedUser, authorisedUser } = require("../middleware/auth");
const router = express.Router();

router.route("/register").post(RegisterUser);
router.route("/login").post(LogInUser);
router.route("/logout").get(LogOutUser);
router.route("/password/forgot").post(ForgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/password/update").put(isAuthenticatedUser, updatePassword);
router.route("/me/").get(isAuthenticatedUser, getUserDetails);
router.route("/me/profile/update").put(isAuthenticatedUser, updateProfile);
router
  .route("/admin/all")
  .get(isAuthenticatedUser, authorisedUser("admin"), getAllUsers);
router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authorisedUser("admin"), getSingleUser);
router
  .route("/admin/user/role/:id")
  .put(isAuthenticatedUser, authorisedUser("admin"), updateUserRole);
router
  .route("/admin/user/delete/:id")
  .delete(isAuthenticatedUser, authorisedUser("admin"), deleteUser);

module.exports = router;
