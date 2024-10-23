const express = require("express")
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth")
const { newOrder, getSingleOrderDetails, getMyOrders, getAllOrders, updateOrder, deleteOrder } = require("../controllers/orderController")
const router = express.Router()


// Any logged in user
router.route("/order/new").post(isAuthenticatedUser,newOrder)

router.route("/order/:id").get(isAuthenticatedUser,getSingleOrderDetails)

router.route("/orders/me").get(isAuthenticatedUser,getMyOrders)


// Admin : Only for admin
router.route("/admin/orders/all").get(isAuthenticatedUser,authorizeRoles("admin"),getAllOrders)

router.route("/admin/order/:id").put(isAuthenticatedUser,authorizeRoles("admin"),updateOrder)

router.route("/admin/order/:id").delete(isAuthenticatedUser,authorizeRoles("admin"),deleteOrder)

module.exports = router