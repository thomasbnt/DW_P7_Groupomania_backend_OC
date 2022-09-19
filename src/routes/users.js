const express = require("express")
const router = express.Router()
const cors = require("cors")

const UserCtrl = require("../controllers/users")
const uploadImageProfile = require("../middlewares/multerImagesProfiles")
const auth = require("../middlewares/authenticateToken")

// Signup
router.post(
  "/signup",
  cors({ methods: "POST" }),
  uploadImageProfile.single("image"),
  UserCtrl.UsersSignup
)

// Login
router.post("/login", cors({ methods: "POST" }), UserCtrl.UsersLogin)

// Me
router.get("/me", cors({ methods: "GET" }), auth, UserCtrl.UsersMeGet)
router.post(
  "/me",
  cors({ methods: "POST" }),
  auth,
  uploadImageProfile.single("image"),
  UserCtrl.UsersMePost
)

// Security
router.post(
  "/security",
  cors({ methods: "POST" }),
  auth,
  UserCtrl.UsersSecurity
)
router.delete(
  "/security",
  cors({ methods: "DELETE" }),
  auth,
  UserCtrl.UsersMeDelete
)

module.exports = router
