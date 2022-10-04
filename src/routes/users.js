const express = require("express")
const router = express.Router()
const cors = require("cors")

const UserCtrl = require("../controllers/users")
const mutler = require("../middlewares/multerImagesProfiles")
const auth = require("../middlewares/authenticateToken")

// Signup
router.post("/signup", cors({ methods: "POST" }), mutler, UserCtrl.UsersSignup)

// Login
router.post("/login", cors({ methods: "POST" }), UserCtrl.UsersLogin)

// Me
router.get("/me", cors({ methods: "GET" }), auth, UserCtrl.UsersMeGet)
router.put("/me", cors({ methods: "PUT" }), auth, mutler, UserCtrl.UsersMePut)

// Security
router.put("/security", cors({ methods: "PUT" }), auth, UserCtrl.UsersSecurity)
router.delete("/security", cors({ methods: "DELETE" }), auth, UserCtrl.UsersMeDelete)

module.exports = router
