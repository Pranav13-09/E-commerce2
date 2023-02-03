const express = require("express");
const {
  newOrder,
  getSingleOrder,
  myOrders,
  getAllOrders,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");
const router = express.Router();

const { isAuthenticatedUser, authorisedUser } = require("../middleware/auth");

router.route("/new").post(isAuthenticatedUser, newOrder);

router.route("/:id").get(isAuthenticatedUser, getSingleOrder);

router.route("/orders/me").get(isAuthenticatedUser, myOrders);

router
  .route("/admin/orders")
  .get(isAuthenticatedUser, authorisedUser("admin"), getAllOrders);

router
  .route("/admin/update/orders/:id")
  .put(isAuthenticatedUser, authorisedUser("admin"), updateOrder);

router
  .route("/admin/delete/orders/:id")
  .delete(isAuthenticatedUser, authorisedUser("admin"), deleteOrder);

module.exports = router;
