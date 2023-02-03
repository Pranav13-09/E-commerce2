const express = require("express");
const {
  getAllProduct,
  createNewProduct,
  updateProduct,
  getSingleProduct,
  deleteProduct,
  createReview,
  deleteReview,
  getAllReviews,
  getAdminProducts,
} = require("../controllers/ProductController");
const router = express.Router();
const { isAuthenticatedUser, authorisedUser } = require("../middleware/auth");

router.route("/products").get(getAllProduct);

router
  .route("/products/admin")
  .get(isAuthenticatedUser, authorisedUser("admin"), getAdminProducts);

router
  .route("/products/admin/new")
  .post(isAuthenticatedUser, authorisedUser("admin"), createNewProduct);

router
  .route("/products/admin/update/:id")
  .put(isAuthenticatedUser, authorisedUser("admin"), updateProduct);

router.route("/products/:id").get(getSingleProduct);

router
  .route("/products/admin/delete/:id")
  .delete(isAuthenticatedUser, authorisedUser("admin"), deleteProduct);

router.route("/product/review/create").put(isAuthenticatedUser, createReview);

router.route("/product/review/delete").put(isAuthenticatedUser, deleteReview);

router.route("/product/review/getAll").get(getAllReviews);

module.exports = router;
