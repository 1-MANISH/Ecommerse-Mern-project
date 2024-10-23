const express = require("express")
const { registerUser, loginUser, logoutUser, forgotPassword, resetPassword, getUserDetails, updatePassword, updateUserProfile, getAllUser, getSingleUserDetails, updateUserRole, deleteUser } = require("../controllers/userController")
const router = express.Router()
const {isAuthenticatedUser,authorizeRoles} = require("../middleware/auth")


// auth
router.route("/register").post(registerUser)

router.route("/login").post(loginUser)

router.route("/password/forgot").post(forgotPassword)

router.route("/password/reset/:token").put(resetPassword) // when user forgot password and not able to login

router.route("/logout").get(logoutUser)



// user apis
router.route("/me").get(isAuthenticatedUser,getUserDetails)

router.route("/password/updatePassword").put(isAuthenticatedUser,updatePassword) // updated password with new one

router.route("/me/update").put(isAuthenticatedUser,updateUserProfile) // name , email ,  avatar


// admin ke liyee

router.route("/admin/users").get(isAuthenticatedUser,authorizeRoles("admin"),getAllUser)

router.route("/admin/user/:id").get(isAuthenticatedUser,authorizeRoles("admin"),getSingleUserDetails)

router.route("/admin/user/:id").put(isAuthenticatedUser,authorizeRoles("admin"),updateUserRole)

router.route("/admin/user/:id").delete(isAuthenticatedUser,authorizeRoles("admin"),deleteUser)

module.exports = router