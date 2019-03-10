let express = require('express');
let router = express.Router();
let config = require('../../config/config')
let { apiVersion } = config;
let {signUp, login, getAllUsers, resetPassword, editUser, deleteUser, getSingleUser} = require('../controllers/user')
// const { checkBody , isEmail } = require('express-validator/check')

router.post(`/signup`, signUp);
router.post(`/login`,login);
router.get(`/user/getalllist`, getAllUsers);
router.get(`/user/resetpasswordlink`, resetPassword);
router.put(`/user/edit`, editUser);
router.post(`/user/delete`, deleteUser);
router.post(`/user/getuser`, getSingleUser);

// router.post(`/login`, (req,res,next)=>{
//     req.checkBody('emailId','Emailid is required').isEmpty();
//     req.checkBody('emailId', 'Should be a valid email').isEmail();
//     req.checkBody('password','password is required').isEmpty();
//     req.checkBody('password','must be 8 characters').isLength(8);
//     next();
// }, login)

module.exports = router;

