let express = require('express');
let router = express.Router();
let config = require('../../config/config')
let { apiVersion } = config;
let userController = require('../controllers/user');
let {signUp, login} = userController

router.post(`/signup`, signUp);
router.get(`'/login`, login)

module.exports = router;

