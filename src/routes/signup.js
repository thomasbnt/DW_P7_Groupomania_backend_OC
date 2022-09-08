const express = require('express');
const router = express.Router();
const UserCtrl = require('../controllers/signup');

router.post('/', UserCtrl.UserController);

module.exports = router;
