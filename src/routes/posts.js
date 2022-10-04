const express = require("express")
const router = express.Router()
const cors = require("cors")

const PostCtrl = require("../controllers/posts")
const multer = require("../middlewares/multerImagesPosts")
const auth = require("../middlewares/authenticateToken")

// Créer un nouveau post
router.post("/", cors({ methods: "POST" }), auth, multer, PostCtrl.PostsCreateOne)
// Récupérer tous les posts
router.get("/", cors({ methods: "GET" }), auth, PostCtrl.PostsGetAll)
// Récupérer un seul post
router.get("/:id", cors({ methods: "GET" }), auth, PostCtrl.PostsGetOne)
// Mettre à jour un seul post
router.put("/:id", cors({ methods: "PUT" }), auth, multer, PostCtrl.PostsUpdateOne)
// Supprimer un seul post
router.delete("/:id", cors({ methods: "DELETE" }), auth, PostCtrl.PostsDeleteOne)

module.exports = router
