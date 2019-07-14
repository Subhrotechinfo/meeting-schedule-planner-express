const mongoose  = require('mongoose');
let { Email, Password } = require('../libs/inputValidator');
let { generatejson } = require('../libs/response');
let { isEmpty } = require('../libs/check');
let { loggerError, loggerInfo } = require('../libs/logger')
let shortId  = require('shortid');
let { now } = require('../libs/time'); 
let { hashPassword } = require('../libs/bcrypt');
let { comparePassword }  = require('../libs/bcrypt')
let { generateToken, decodeToken, secretkey } = require('../libs/token')
let {sendEmail}  = require('./../libs/email')

let User = require('../models/user');
let UserModel = mongoose.model('User');

module.exports.login = (req,res) => {
    
    let findUser = () => {
        return new Promise((resolve,reject)=>{
            //express validator
            // check('emailId').exists();
            // isEmail('emailId','Must be a valid emailid')
            // check('emailId','Email is is required').notEmpty();
            // check('emailId' , 'Email id is not valid').isEmail();
            // check('password' , 'password is required').notEmpty();
            if(req.body.emailId) {
                if(Email(req.body.emailId)){
                    UserModel.findOne({emailId: req.body.emailId})
                        .exec()
                        .then((userDetails)=>{
                            if(isEmpty(userDetails)){
                                reject(generatejson(true,'User details not found'))
                            }else {
                                resolve(userDetails)
                            }
                        })
                        .catch((err)=>{
                            reject(err,'something went wrong while fetching the details');
                        });
                }else {
                    reject({err:'invalid emailid format'});
                }
                
            }else {
                reject(generatejson(true, 'email parameter is missing'));
            }
        });
    } //find user end
    
    let passwordValidator = (retrievedUserDetail) => {
        return new Promise((resolve,reject)=>{
            if(req.body.password){
                comparePassword(req.body.password, retrievedUserDetail.password)
                .then((isMatch) => {
                    if(isMatch){
                        // retrievedUserDetail.password = delete retrievedUserDetail.password;
                        retrievedUserDetail.last_login = now();
                        resolve(retrievedUserDetail);
                    }else {
                        reject(generatejson(true,'wrong password'));
                    }
                })
                .catch((err) => {
                    reject(err)
                });
            }else {
                reject({err:'password field is missing'});
            }
            
        });
    }//password validator end 
    let tokenGenerate = (retrievedUser) => {
        return new Promise((resolve, reject)=>{
            generateToken(retrievedUser)
            .then((tokenDetail)=>{
                retrievedUser.token = tokenDetail; 
                resolve(retrievedUser);
            })
            .catch((err)=>{
                reject(err);
            })
        })
        
    }

    findUser(req,res)
        .then(passwordValidator)
        .then(tokenGenerate)
        .then((loggedinUser) => {
            res.status(200).json({msg: 'login success', data: {token: loggedinUser.token}});
        })
        .catch((err) => {
            res.status(200).json({err:err});
        });
}

// let responseObj = new Response();
module.exports.signUp = (req,res) => {
    //validate the user input
    let userInputValidator = () =>{
        return new Promise((resolve, reject)=>{
            if(req.body.emailId){
                if(!Email(req.body.emailId)){
                    // response.status(200);
                    reject(generatejson(true, 'Email does not met the requirement'))
                }else if(isEmpty(req.body.password)){
                    reject(generatejson(true, 'password parameter is missing'));
                }else if(!Password(req.body.password)) {
                    reject(generatejson(true, 'password must be min 8 character'))
                } 
                else{
                    resolve(req);
                }
            } else {
                loggerError('Field missing', 'userController(): createUser', 5);
                reject(generatejson(true, 'One or more paratemer(s) is missing'))
            }
        });
    } //end validateUserInput
    
    let userCreate  = () => {
        return new Promise((resolve,reject)=>{
            UserModel.findOne({emailId: req.body.emailId})
                .exec()
                .then((retrievedUserDetails)=>{
                    if(isEmpty(retrievedUserDetails)){
                        let newUser = new UserModel({
                            userId: shortId.generate(),
                            fullName: req.body.fullName,
                            userName: req.body.userName,
                            emailId: req.body.emailId,
                            password: hashPassword(req.body.password),
                            country: req.body.country,
                            mobileno: req.body.mobileno,
                            signup_date: now()
                        })
                        newUser.save()
                            .then((newUser)=> {
                                console.log('saved user', newUser.emailId);
                                if(!isEmpty(newUser)){
                                    // delete newUser.password;
                                    //send email
                                    sendEmail(newUser.emailId, 'http://facebook.com')   
                                        .then((send)=>{
                                            console.log('Email Send')
                                        })
                                        .catch((err)=>console.log(err));
                                    resolve(newUser)
                                } else {
                                    reject(generatejson(true, 'Something went wrong while saving the data.'));
                                    
                                }
                            })
                            .catch((err) => {
                                reject(generatejson(true, err))
                            });
                    }else {
                        loggerError('User cannot be created. User is already present', 'UserController: createUser', 4);
                        reject(generatejson(true, 'User already present with this email id.'))
                    }
                })
        });
    }

    userInputValidator(req,res)
        .then(userCreate)
        .then((data) => {
            loggerInfo('User Created','SignUpUser: Controller',5);
            res.status(200).json(generatejson(false,'User Created'));
        })
        .catch((err) => {
            res.status(200).send(err);
        })
}

// Get all user details

module.exports.getAllUsers = (req,res) => {
    UserModel.find({email_verified:''})
        .select('-__v -_id -password')    
        .lean()
        .exec()
        .then((userDetails) => {
            if(isEmpty(userDetails)){
                res.status(200).json({err:true, msg: 'no user found'});
            }else{
                res.status(200).json({msg:'users found', data: userDetails});   
            }

        })
        .catch((err) => {
            res.status(200).json({err:err});
        });
}   

module.exports.getSingleUser = (req,res) => {
    UserModel.findOne({userId: req.body.userId})
        .select('-__v -_id -password')
        .lean()
        .exec()
        .then((userDetail)=>{
            if(isEmpty(userDetail)){
                res.status(200).json({err:true, msg:'User not found'});
            }else{
                res.status(200).json({success: true, data: userDetail})
            }
        })
        .catch((err) => {
            res.status(200).json({err:err});
        })
}

module.exports.deleteUser = (req,res) => {
    UserModel.findOneAndRemove({userId: req.body.userId})
        .lean()
        .then((user)=>{
            if(isEmpty(user)){
                res.status(200).json({err: true, msg:'no user found'})
            }else {
                res.status(200).json({success: true, msg:'user deleted'});
            }
        })
        .catch((err)=>{
            res.status(200).json({err:err});
        })
}

module.exports.editUser = (req,res) => {
    let updateUser = {
        fullName: req.body.fullName,
        userName: req.body.userName,
        country: req.body.country,
        mobileno:req.body.mobileno
    }
    UserModel.findOneAndUpdate({userId: req.body.userId}, updateUser)
        .exec()
        .then((user) => {
            if(isEmpty(user)){
                res.status(200).json({err: true, msg:'no user found'})
            }else {
                res.status(200).json({success: true, msg:'user details updated'})
            }
        })
        .catch((err) => {
            res.status(200).json({err:err});
        })
}

module.exports.verifyEmail = (req,res) => {
    let findUser = () => {
        return new Promise((resolve, reject) => {
            if(req.body.userId){
                UserModel.findOne({userId: req.body.userId})
                    .select('-password -__v -_id')
                    .lean()
                    .then((user) => {
                        if(isEmpty(user)){
                            reject({err: true, msg: 'no user found'});
                        }else {
                            resolve(user);
                        }
                    })
                    .catch((err)=> {
                        reject({err: err})
                    })
            }else {
                reject({err: true, msg:'userid missing'});
            }
        });
    } //end finduser
    let verifiedEmail = (retrievedUser) => {
        return new Promise((resolve, reject)=>{
            UserModel.updateOne({userId: retrievedUser.userId}, {email_verified: 'Yes'})
                .exec()
                .then((userVerified) => {
                    resolve(userVerified)
                })
                .catch((err) => {
                    reject(err)
                })
        }) 
    }

    findUser(req,res)
        .then(verifiedEmail)
        .then((emailVerified) => {
            res.status(200).json({success: true, msg: 'user email verified'});
        })
        .catch((err)=>{
            res.status(200).json({err:err});
        })
}

module.exports.resetPassword = (req,res) => {

    let findUser = () => {
        return new Promise((resolve, reject) => {
            if(req.body.emailId) {
                console.log('check 1')
                UserModel.findOne({emailId: req.body.emailId})
                    .exec()
                    .then((user) => {
                        if(isEmpty(user)){
                            reject({err: true, msg: 'no user found'});
                        } else {
                            resolve(user);
                        }
                    })
                    .catch((err) => {
                        reject(err)
                    })
            }else {
                reject({err: true, msg: 'email is missing'});
            }

        });
    }
    let tokenGenerate = (retrievedUser) => {
        // console.log(retrievedUser)
        return new Promise((resolve, reject)=>{
            generateToken(retrievedUser)
            .then((tokenDetail)=>{
                console.log(tokenDetail);
                tokenDetail.userId = retrievedUser.userId
                tokenDetail.userDetail = retrievedUser
                console.log(tokenDetail); 
                resolve(tokenDetail);
            })
            .catch((err)=>{
                reject(err);
            })
        })
        
    }
    let decode = (tokenDetail) =>{
        return new Promise((resolve, reject) => {
            // console.log(token);
            decodeToken(tokenDetail, secretkey)
                .then((decoded)=>{
                    console.log(decoded);
                    // delete decoded.iat;
                    resolve(decoded);
                })
                .catch((err)=>{
                    reject(err)
                })
        })
    }
    findUser(req,res)
        .then(tokenGenerate)
        .then(decode)
        .then((data) => {
            res.status(200).json({success: true, msg:'reset password token generated', data: data});
        })
        .catch((err)=>{
            res.status(200).json({err:err});
        })
}

