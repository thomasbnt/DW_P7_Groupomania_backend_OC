const express = require('express')
const router = express.Router()
const cors = require('cors')

const PostCtrl = require('../controllers/posts')
const upload = require('../middlewares/multer')
const auth = require('../middlewares/authenticateToken')

// Get All posts
router.get('/', cors({ methods: 'GET' }), PostCtrl.PostsGetAll)

module.exports = router
