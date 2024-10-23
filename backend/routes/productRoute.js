const express = require("express");
const { getAllProduct ,createProduct, updateProduct, deleteProduct, getProductDetails, createProductReview, getProductReviews, deleteProductReview, getAdminProducts} = require("../controllers/productController");
const { isAuthenticatedUser,authorizeRoles: authorizeRoles } = require("../middleware/auth");
const router = express.Router();

// Any user
router.route("/products").get(getAllProduct)

router.route("/product/:id").get(getProductDetails)

router.route("/reviews").get(getProductReviews) // by productId

// Admin :  for admin

router.route("/admin/product/new").post(isAuthenticatedUser,authorizeRoles("admin"),createProduct)

router.route("/admin/product/:id").put(isAuthenticatedUser,authorizeRoles("admin"),updateProduct)

router.route("/admin/product/:id").delete(isAuthenticatedUser,authorizeRoles("admin"),deleteProduct)

router.route("/admin/products").get(isAuthenticatedUser,authorizeRoles("admin"),getAdminProducts)

// Any logged user :  for logged In user

router.route("/product/review").put(isAuthenticatedUser,createProductReview) // update & create review - put

router.route("/product/review").delete(isAuthenticatedUser,deleteProductReview)  // by productId + reviewId in query parameter





module.exports = router