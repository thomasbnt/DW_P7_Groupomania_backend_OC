const express = require("express")
const router = express.Router()
const StatusCtrl = require("../controllers/status")

router.use("/", StatusCtrl.status)

module.exports = router
