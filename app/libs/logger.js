let logger  = require('pino')();
let moment = require('moment');

module.exports.loggerError = (errMsg, errOrgn, errLvl) => {

    let errRspnse = {};
    errRspnse.timestamp = moment();
    errRspnse.errMsg = errMsg;
    errRspnse.errOrgn = errOrgn;
    errRspnse.errLvl = errLvl;

    logger.error(errRspnse)
    return errRspnse;
}

module.exports.loggerInfo = (msg, orgn, imp) => {
    let infoMsg = {};
    infoMsg.msg = msg;
    infoMsg.orgn = orgn;
    infoMsg.imp = imp;
    logger.info(infoMsg);
    return infoMsg;
}


