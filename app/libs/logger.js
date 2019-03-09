let logger  = require('pino')();
let moment = require('moment');

let captureError = (errMsg, errOrgn, errLvl) => {

    let errRspnse = {};
    errRspnse.timestamp = moment();
    errRspnse.errMsg = errMsg;
    errRspnse.errOrgn = errOrgn;
    errRspnse.errLvl = errLvl;

    logger.error(errRspnse)
    return errRspnse;
}

let captureInfo = (msg, orgn, imp) => {
    let infoMsg = {};
    infoMsg.msg = msg;
    infoMsg.orgn = orgn;
    infoMsg.imp = imp;
    logger.info(infoMsg);
    return infoMsg;
}

module.exports = {
    loggerError: captureError,
    loggerInfo:  captureInfo
}
