let mongoose  = require('mongoose');

let inputValidator = require('../libs/inputValidator');
let { Email, Password } = inputValidator;
let response  = require('../libs/response');
let { generatejson } = response;
let check = require('../libs/check');
let { isEmpty } = check;
let logger = require('../libs/logger');
let { loggerError, loggerInfo } = logger
let shortId  = require('shortid');
let time = require('../libs/time');
let { now } = time; 
let bcryptLib = require('../libs/bcrypt');
let { hashPassword } = bcryptLib;

let User = require('../models/user')

let UserModel = mongoose.model('User');

let login = (req,res) => {
    res.send('login');
}

// let responseObj = new Response();
let signUp = (req,res) => {
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
    
    let createUser  = () => {
    console.log('create')
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
                                    delete newUser.password;
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
        .then(createUser)
        .then((data) => {
            loggerInfo('User Created','SignUpUser: Controller',5);
            res.status(200).json(generatejson(false,'User Created'));
        })
        .catch((err) => {
            res.status(200).send(err);
        })
}


module.exports = {
    signUp: signUp,
    login:login
}






