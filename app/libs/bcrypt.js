let bcrypt = require('bcryptjs');
let logger  = require('../libs/logger');
let {loggerError, loggerInfo} = logger;
let saltRounds = 10;

module.exports.hashPassword = (password) => {
    // bcrypt.hash(myPlainTextPassword, saltRounds, (err, hash)=>{
    //     console.log('Password Function ',hash);
    //     return hash;
    // });
    return bcrypt.hashSync(password , bcrypt.genSaltSync(saltRounds));
}

module.exports.comparePassword  = (oldPassword , hashPassword) => {
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

