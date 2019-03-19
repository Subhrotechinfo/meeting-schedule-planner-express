const redis = require('redis');
const {isEmpty} =  require('./check')

let client = redis.createClient({
    port:6379,
    host:'127.0.0.1'
});

client.on('connect', ()=>{
    console.log('Redis connected successfully')
});

module.exports.getAllUsersInHash = (hashName, cb) => {
    client.HGETALL(hashName, (err, result)=>{
        if(err){
            console.log(err);
            cb(err, null);
        }else if(isEmpty(result)){
            console.log('online users list is empty');
            console.log(result);
            cb(null,{});
        } else {
            console.log(result);
            cb(null, result);
        }
    })
}

module.exports.setANewOnlineUserInHash = (hashName, key, value, cb) => {
    client.HSET(hashName,[key, value], (err, result)=>{
        if(err){
            console.log(err);
            cb(err, null)
        }else {
            console.log('user has been set in the hash map');
            console.log(result);
            cb(null, result);
        }
    });
}

module.exports.deleteUserFromHash = (hashName, key) => {
    client.HDEL(hashName, key);
    return true;
}
