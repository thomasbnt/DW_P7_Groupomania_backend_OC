const express = require('express')
const router = express.Router()
const cors = require('cors')

const UserCtrl = require('../controllers/users')
const upload = require('../middlewares/multer')
const auth = require('../middlewares/authenticateToken')

router.get('/', UserCtrl.UsersGetAll)

router.post(
  '/signup',
  cors({ methods: 'POST' }),
  upload.single('image'),
  UserCtrl.UsersSignup
)

router.post('/login', cors({ methods: 'POST' }), UserCtrl.UsersLogin)

// Me
router.get('/me', cors({ methods: 'GET' }), auth, UserCtrl.UsersMeGet)
router.put('/me', cors({ methods: 'PUT' }), auth, UserCtrl.UsersMePut)
router.delete('/me', cors({ methods: 'DELETE' }), auth, UserCtrl.UsersMeDelete)

module.exports = router
