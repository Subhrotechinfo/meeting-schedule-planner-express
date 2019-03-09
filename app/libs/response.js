let generate = (err, msg) => {
    let rspnse = {}
    rspnse.err = err;
    rspnse.msg = msg
    return rspnse;
}

module.exports = {
    generatejson: generate
}