let moment = require('moment');
let momenttz = require('moment-timezone');
let timeZone = 'Asia/Calcutta'; 

let now = () => {
    return moment.utc().format();
}
let getLocaltime = () => {
    return moment().tz(timeZone).format();
} 

let convertToLocalTime  = (time) => {
    return momenttz.tz(time, timeZone).format('LLLL') 
}

let isSameDayAsToday = (inputDate) => {
    if(new Date(inputDate).getUTCDate() == new Date().getUTCDate() && new Date() < new Date(inputDate)){
        return true;
    }else {
        return false;
    }
}

module.exports = {
    now: now,
    getLocaltime: getLocaltime,
    convertToLocalTime: convertToLocalTime,
    isSameDayAsToday: isSameDayAsToday
}
