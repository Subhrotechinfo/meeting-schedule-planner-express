const express =require('express');
const mongoose  = require('mongoose');
const fs = require('fs');
const http = require('http');
let  { port , dbStrng }  = require('./config/config') ;
let  { loggerInfo, loggerError } = require('./app/libs/logger');

let user_route = require('./app/routes/user')

const bodyParser = require('body-parser')
const expressValidator = require('express-validator');


//create an instance of express
let app = express();
let modelsPath = './app/models';
let routesPath = './app/routes';


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());

app.use('/',user_route);

app.get('/hello',(req, res)=>{
    res.send('OK');
})

//Bootstrap models
fs.readdirSync(modelsPath).forEach((file) => {
    if(~file.indexOf('.js'))
        require(modelsPath+'/'+file);
});

//Bootstrap routes
fs.readdirSync(routesPath).forEach((file)=>{
    if(~file.indexOf('.js'))
        require(routesPath+'/'+file);
});



/**
 * Create HTTP server.
 */

let server =  http.createServer(app);
console.log(`${port}`);
// server.on('error', onError);
// server.on('listening', onListening);

/**
 * Event listener for HTTP server "error" event.
 */

// function onError(error) {
//     if(error.syscall !== 'listen'){
//         loggerError(error.code + 'not equal listen', 'server on error handler', 10);
//         throw error;
//     }

//      // handle specific listen errors with friendly messages
//      switch(error.code){
//         case 'EACCES':
//             loggerError(error.code + ':elevated priviledges required', 'serverOnErrorHandler', 10);
//             process.exit(1);
//             break;
//         case 'EADDRINUSE': 
//             loggerError(error.code+ ':port is already in use', 'serverOnErrorHandler', 10);
//             process.exit(1);
//             break;
//         default: 
//             loggerError(error.code + ':some unknown error occured', 'serverOnErrorHandler', 10);
//             throw error;
//      }
// }

/**
 * Event listener for HTTP server "listening" event.
 */

// function onListening()  {
//     let addr = server.address();
//     let bind = typeof addr === 'string' ? 'pipe'+addr : 'port'+addr.port;
//     ('Listening on' + bind);
//     loggerInfo('server listening on port'+ addr.port, 'serveronListeningHandler', 10);
//     let db = mongoose.connect(dbStrng);
// }

// process.on('unhandledRejection', (reason, p) => {
//     console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
// });

server.listen(port, () => {
    console.log('Example app listening on port 3000');
    let db = mongoose.connect(dbStrng, {useNewUrlParser: true});
    console.log('Connected to MongoDB');
})

/**
 * database connection settings
 */

mongoose.connection.on('error', (err) => {
    console.log('database connection error');
    console.log(err);
    loggerError(err, 'mongoose connection error', 10);
});

mongoose.connection.on('open', (err) => {
    if(err) {
        loggerError(err, 'mongoose connection open handler', 10);
    }else {
        loggerInfo('database connection open ' , 'database connection open handler', 10);
    }
});

module.exports = app;

