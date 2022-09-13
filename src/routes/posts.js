const express = require('express')
const router = express.Router()
const cors = require('cors')

const PostCtrl = require('../controllers/posts')
const upload = require('../middlewares/multer')
const auth = require('../middlewares/authenticateToken')

console.log(typeof router)
console.log(typeof cors)
console.log(typeof auth)
console.log(typeof upload.single('image'))
// Créer un nouveau post
router.post(
  '/',
  cors({ methods: 'POST' }),
  auth,
  upload.single('image'),
  PostCtrl.PostsCreateOne
)
// Récupérer tous les posts
router.get('/', cors({ methods: 'GET' }), auth, PostCtrl.PostsGetAll)
// Récupérer un seul post
router.get('/:id', cors({ methods: 'GET' }), auth, PostCtrl.PostsGetOne)
// Mettre à jour un seul post
router.put('/:id', cors({ methods: 'PUT' }), auth, PostCtrl.PostsUpdateOne)
// Supprimer un seul post
router.delete(
  '/:id',
  cors({ methods: 'DELETE' }),
  auth,
  PostCtrl.PostsDeleteOne
)

module.exports = router