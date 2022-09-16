const express = require('express')
const router = express.Router()
const cors = require('cors')

const UserCtrl = require('../controllers/users')
const uploadImageProfile = require('../middlewares/multerImagesProfiles')
const auth = require('../middlewares/authenticateToken')

// Signup
router.post(
  '/signup',
  cors({ methods: 'POST' }),
  uploadImageProfile.single('image'),
  UserCtrl.UsersSignup
)

// Login
router.post('/login', cors({ methods: 'POST' }), UserCtrl.UsersLogin)

// Me
router.get('/me', cors({ methods: 'GET' }), auth, UserCtrl.UsersMeGet)
router.put('/me', cors({ methods: 'PUT' }), auth, UserCtrl.UsersMePut)
router.delete('/me', cors({ methods: 'PUT' }), auth, UserCtrl.UsersSecurity)
router.put(
  '/security',
  cors({ methods: 'DELETE' }),
  auth,
  UserCtrl.UsersMeDelete
)

module.exports = router
