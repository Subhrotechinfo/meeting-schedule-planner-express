let moment = require('moment');
let momenttz = require('moment-timezone');
let timeZone = 'Asia/Calcutta'; 

let now = () => {
    console.log(moment.utc().format());
    return moment.utc().format();
}

let getLocaltime = () => {
    console.log(moment().tz(timeZone).format());
    return moment().tz(timeZone).format();
} 

let convertToLocalTime  = (time) => {
    console.log(momenttz.tz(time, timeZone).format('LLLL'));
    return momenttz.tz(time, timeZone).format('LLLL') 
}

let isSameDayAsToday = (inputDate) => {
    if(new Date(inputDate).getUTCDate() == new Date().getUTCDate() && new Date() < new Date(inputDate)){
        console.log('sameday');
        console.log(Math.floor(Date.now()/1000) + (60*60*24));
        // return true;
    }else {
        console.log('err');
        // return false;
    }
}

// let check = () => {
//     console.log(new Date())
    // console.log(moment().tz(timeZone).format().add(24))
    // console.log(Math.floor(Date.now()/1000) + (60*60*24));
    // .add(moment.duration(24,'hours'))
    // let x = ;
    // console.log('ss',moment( new Date(),'LLLL').add(1,'days'))

    // console.log(moment().tz(timeZone).format('LLLL').toString())
    // console.log(moment().tz(timeZone).format())
    // console.log(moment('2019-03-10T13:47:42.654Z').isAfter(moment().tz(timeZone).format()))
    
    // console.log(moment(moment( new Date(),'LLLL').add(1,'days')).isBetween(new Date()))
//     let now =  moment().tz(timeZone).format();
//     let expire = moment(moment(),'LLLL').add(1,'days')

//     if( expire.isSameDayAsToday){
//         console.log('true')
//     }else {
//         console.log('false');
//     }
// }
// check()

module.exports = {
    now: now,
    getLocaltime: getLocaltime,
    convertToLocalTime: convertToLocalTime,
    isSameDayAsToday: isSameDayAsToday
}

