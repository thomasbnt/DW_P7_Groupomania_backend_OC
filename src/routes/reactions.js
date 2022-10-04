const express = require("express")
const router = express.Router()
const cors = require("cors")

const ReactionCtrl = require("../controllers/reactions")
const auth = require("../middlewares/authenticateToken")

router.get("/", cors({ methods: "GET" }), auth, ReactionCtrl.default)
// Créer une nouvelle réaction
router.put("/:id", cors({ methods: "PUT" }), auth, ReactionCtrl.ReactionAddRemove)

module.exports = router
