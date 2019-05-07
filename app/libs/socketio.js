const socketio = require('socket.io');
const { getAllUsersInHash, setANewOnlineUserInHash, deleteUserFromHash } = require('./redis');
const {verifyClaimWithoutSecret} = require('./../libs/token');

module.exports.setServer = (server) => {
    let io = socketio.listen(server);
    let myIo = io.of('/');

    myIo.on('connection', (socket) => {
        console.log('Connected Emitting verify user');
        socket.emit("verifyUser","");

        // verify the user and make him online
        socket.on('set-user', (authToken) => {
            verifyClaimWithoutSecret(authToken, (err, user)=>{
                if(err){
                    socket.emit('auth-error', {status: 500, error: 'Please provide correct auth token'})
                }else {
                    let currentUser = user.data;
                    //setting socket user id
                    socket.userId = currentUser.userId;

                    let fullName = `${currentUser.firstName} ${currentUser.lastName}`;
                    let key  = currentUser.userId;
                    let value  = fullName;

                    let setUserOnline = setANewOnlineUserInHash('onlineUsersList', (err, result) => {
                        if(err){
                            console.log(`some error occured`);
                        }else {
                            console.log(`${fullName} is online`);
                            socket.broadcast.emit('online-user-list', result);
                        }
                    })
                }
            })
        }); //end of listening set-user event

        socket.on('disconnect', ()=>{
            console.log('user is disconnected');
            if(socket.userId){
                deleteUserFromHash('onlineUsersList', socket.userId);
                getAllUsersInHash('onlineUsersList', (err, result) => {
                    if(err){
                        console.log(err);
                    }else {
                        socket.broadcast.emit('onlineUsersList', result);
                    }
                })
            }
        }); //end of diconnect users

        socket.on('notify-updates', (data) => {
            console.log('socket notify-updates called');
            console.log(data);
            socket.broadcast.emit(data.userId, data);
        });
    });
}
