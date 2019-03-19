const jwt  = require('jsonwebtoken');
const moment = require('moment');
let timeZone = 'Asia/Calcutta'; 
let secretkey = 'qwerftdgdbdhlsln';

module.exports.generateToken = (data) => {
    console.log(data)
    return new Promise((resolve, reject) => {
        try{
            
            let claim = {
                userId: data.userId,
                expAt: moment(moment(),'LLLL').add(1,'days'),
                emailId: data.emailId
            }
            let token = jwt.sign(claim, secretkey);
            resolve(token);
        }catch(err){
            reject(err);
        }
    });
}

module.exports.decodeToken = (token, secretkey) => {
    return new Promise((resolve, reject) => {
        console.log(token, secretkey)
        jwt.verify(token, secretkey, (err, decoded)=>{
            if(err){
                reject(err);
            }else {
                resolve(decoded);
            }
        })
    })  
}

// module.exports = {secretkey: secretkey, generateToken: generateToken, decodeToken: decodeToken};


