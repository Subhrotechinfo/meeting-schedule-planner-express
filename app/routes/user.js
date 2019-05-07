const express = require('express');
const router = express.Router();
const { apiVersion } = require('../../config/config');
const {signUp, login, getAllUsers, resetPassword, editUser, deleteUser, getSingleUser} = require('../controllers/user')
// const { checkBody , isEmail } = require('express-validator/check')

router.post(`/signup`, signUp);
router.post(`/login`,login);
router.get(`/user/getalllist`, getAllUsers);
router.get(`/user/resetpasswordlink`, resetPassword);
router.put(`/user/edit`, editUser);
router.post(`/user/delete`, deleteUser);
router.post(`/user/getuser`, getSingleUser);

module.exports = router;




