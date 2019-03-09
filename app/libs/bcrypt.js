let bcrypt = require('bcrypt');
let logger  = require('../libs/logger');
let {loggerError, loggerInfo} = logger;
let saltRounds = 10;


let hashPassword = (password) => {
    // bcrypt.hash(myPlainTextPassword, saltRounds, (err, hash)=>{
    //     console.log('Password Function ',hash);
    //     return hash;
    // });
    return bcrypt.hashSync(password , bcrypt.genSaltSync(saltRounds));
}

let comparePassword  = (oldPassword , hashPassword) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(oldPassword, hashPassword, (err, result)=>{
            if(err){
                loggerError(err.message, 'Comparison Error', 5);
                reject(err);
            }else {
                resolve(result);
            }
        })
    })
}


module.exports = {
    hashPassword: hashPassword,
    comparePassword: comparePassword
}













