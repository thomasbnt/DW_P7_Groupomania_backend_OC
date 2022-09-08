const express = require('express');
const router = express.Router();
const UserCtrl = require('../controllers/signup');
const upload = require('../middlewares/multer');
const cors = require('cors')

router.post('/', cors({methods: "POST"}), upload.single('image'), UserCtrl.UsersSignup);

module.exports = router;
