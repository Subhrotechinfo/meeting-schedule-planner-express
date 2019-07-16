let config = {};

config.port = 8080;
config.allowedCorsOrigin = "*";
config.env = "dev";
config.db = {
    uri: 'mongodb://127.0.0.1:27017/schedulePlanner'
}

config.apiVersion = '/api/v1';
config.aws = '13.235.166.206';
module.exports = {
    port: config.port,
    allowedCorsOrigin: config.allowedCorsOrigin,
    environment: config.env,
    dbStrng: config.db.uri,
    apiVersion: config.apiVersion
}

