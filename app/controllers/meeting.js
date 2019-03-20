const mongoose  = require('mongoose');
const shortid = require('shortid');
const {loggerInfo, loggerError} = require('../libs/logger')
const {generatejson} = require('../libs/response')
const {now, isSameDayAsToday} = require('../libs/time')
const { isEmpty } = require('../libs/check')

const User = require('../models/user');
const UserModel = mongoose.model('User');
const Meeting = require('../models/meeting')
const MeetingModel = mongoose.model('Meeting');

module.exports.addMeeting = (req,res) => {
    let validateUserInput = () => {
        return new Promise((resolve, reject) => {
            if(req.body.meetingTopic && req.body.hostId && req.body.hostName && req.body.participantId 
                && req.body.participantName && req.body.meetingStartDate && req.body.meetingEndDate &&
                req.body.meetingDescription && req.body.meetingPlace){
                    resolve(req);
                }else {
                    loggerError('Fields missing during meeting creation', 'meetingController: AddMeeting()',6);
                    reject(generatejson(true, 'One or more parameter(s) is missing'));
                }
        });
    }
    let addMeeting = () => {
        return new Promise((resolve, reject)=>{
            let newMeeting = new MeetingModel({
                meetingId: shortid.generate(),
                meetingTopic:req.body.meetingTopic,
                hostId:req.body.hostId,
                hostName:req.body.hostName,
                participantId:req.body.participantId, 
                participantName:req.body.participantName,
                meetingStartDate:req.body.meetingStartDate,
                meetingEndDate:req.body.meetingEndDate,
                meetingDescription:req.body.meetingDescription,
                meetingPlace:req.body.meetingPlace,
                createdOn: now()
            })
            newMeeting.save()
                .then((meetingDetails)=>{
                    if(isEmpty(meetingDetails)){
                        reject(generatejson(true,'Failed to add meetingDetails'))
                    }else {
                        //send email
                        resolve(meetingDetails)
                    }
                })
                .catch((err)=>{
                    reject(generatejson(true,'Something went wrong while saving the data'));
                });
        });
    }
    validateUserInput(req,res)
        .then(addMeeting)
        .then((data)=>{
            res.status(200).json({success: true, msg: 'Meeting Created', data:data})
        })
        .catch((err)=>{
            res.status(200).json({err: true, msg:'Something Went wrong', err: err});
        });
}

module.exports.getAllMeetings = (req, res)=> {
    let findUserDetails = () => {
        return new Promise((resolve, reject) => {
            UserModel.findOne({userId: req.params.userId})
                .select()
                .lean()
                .exec((err, userDetails) => {
                    if(err){
                        loggerError(err.message,'Meeting controller: getAllMeetings',10);
                        reject(generatejson(true,'Failed to find user details'));
                    }else if(isEmpty(userDetails)){
                        loggerInfo('No user found', 'Meeting Controller');
                        reject(generatejson(true, 'No user found'))
                    }else {
                        resolve(userDetails);
                    }
                })
        })
    }

    let findMeetings = (userDetails) => {
        return new Promise((resolve, reject) => {
            if(userDetails.isAdmin == 'true'){
                MeetingModel.find({hostId: req.body.userId})
                    .select()
                    .lean()
                    .exec((err, meetingDetails) => {
                        if(err){
                            loggerError(err.message,'Meeting Controller: findMeeting');
                            reject(generatejson(true, 'Failed to find meeting'))
                        }else if(isEmpty(meetingDetails)){
                            loggerInfo('No meeting found', 'meeting controller: findMeetings')
                            reject(generatejson(true, 'No meeting Found'))
                        }else {
                            resolve(generatejson(false, 'Meetings Found'))
                        }
                    })
            }else {
                MeetingModel.findOne({participantId: req.body.params})
                    .select()
                    .lean()
                    .exec((err, meetingDetails) => {
                        if(err){
                            loggerError(err.message, 'Meeting Controller: findMeeting');
                            reject(generatejson(true, 'Failed to find meetings'));
                        }else if(isEmpty(meetingDetails)){
                            loggerError('No Meetings found','Meeting Controller: findMeetings');
                            reject(generatejson(true, 'No Meeting Found'));
                        }else {
                            resolve(meetingDetails)
                        }
                    })
            }

        })
    }

    findUserDetails(req, res)
        .then(findMeetings)
        .then((data)=>{
            res.status(200).json({success:true, msg:'Meetings found', data:data});
        })
        .catch((err) => {
            res.status(200).json({err: err, msg:'Something went wrong'});
        })
}

module.exports.getMeetingDetail = (req, res) => {
    MeetingModel.findOne({meetingId: req.body.meetingId})
        .select()
        .lean()
        .exec((err, meetingDetails) => {
            if(err){
                loggerError(err.message,'Meeting controller: getMeetingDetails',10)
                res.status(200).json({err: true, msg:'Failed to find meetings', err:err});
            }else if(isEmpty(meetingDetails)){
                loggerInfo('No meeting found','Meeting controller: getAllMeetingDetails');
                res.status(200).json({err: true, msg:'No meeting found'})
            }else {
                res.status(200).json({success: true, msg:'Meeting found', data:meetingDetails});
            }
        })
}


module.exports.deleteMeeting = (req, res) => {
    
    let findMeetingDetails = () => {
        return new Promise((resolve, reject) => {
            MeetingModel.findOne({meetingId: req.body.meetingId})
                .select()
                .lean()
                .exec((err, meetingDetails) => {
                    if(err){
                        loggerError(err.message, 'Meeting controller: findMeetingDetails');
                        reject(generatejson(true, 'Failed to find meeting details'));
                    }else if(isEmpty(meetingDetails)){
                        reject(generatejson(true, 'No meeting found'));
                    }else {
                        resolve(meetingDetails);
                    }
                })
        })
    }

    let deleteMeeting = (meetingDetails) => {
        return new Promise((resolve, reject) => {
            MeetingModel.findOneAndRemove({meetingId: req.body.meetingId})
                .exec((err, retrievedMeeting) => {
                    if(err){
                        loggerError(err.message,'Meeting Controller:deleteMeeting')
                        reject(generatejson(true, 'Failed to delete meeting'))
                    }else if(isEmpty(retrievedMeeting)){
                        reject(generatejson(true, 'No meeting found'));
                    }else {
                        //send email
                        resolve(retrievedMeeting);
                    }
                })
        })
    }
    findMeetingDetails(req, res)
        .then(deleteMeeting)
        .then((data) => {
            res.status(200).json({success: true, msg:'Meeting deleted successfully', data: data});
        })
        .catch((err)=> {
            res.status(200).json({err: err, msg:'Something went wrong'});
        })


}

module.exports.updateMeeting = (req, res) => {
    let findMeeting = () => {
        return new Promise((resolve, reject) => {
            console.log('1');
            MeetingModel.findOne({meetingId: req.body.meetingId})
                .select()
                .lean()
                .exec((err, meetingDetails) => {
                    if(err){
                        loggerError(err.message,'Meeting Controller: UpdateMeeting');
                        reject(generatejson(true,'Failed to find meeting'));
                    }else if(isEmpty(meetingDetails)){
                        loggerInfo('No meeting found','Meeting Controller:findMeetingDetails')
                        reject(generatejson(true, 'No meeting, found'));
                    }else {
                        resolve(meetingDetails)
                    }
                })
        })
    }

    let updateMeeting = (meetingDetails) => {
        return new Promise((resolve, reject) => {
            console.log(meetingDetails)
            let options = req.body;
            MeetingModel.updateOne({meetingId: req.body.meetingId}, options)
                .exec((err, updatedMeeting) => {
                    if(err){
                        loggerError(err.message,'Meeting Controller: UpdateMeeting');
                        reject(generatejson(true,'Failed to update meeting details'));
                    }else if(isEmpty(updatedMeeting)){
                        reject(generatejson(true,'No meeting found'));
                    }else {
                        //send email
                        resolve(updatedMeeting);
                    } 
                })  
        })
    }

    findMeeting(req, res)
        .then(updateMeeting)
        .then((data) => {
            res.status(200).json({succes:true, msg:'Meeting updated', data:data});
        })
        .catch((err) => {
            res.status(200).json({err: err, msg:'something went wrong'});
        })

}

module.exports.remainderForCurrentDayMeeting = (req, res) => {
    let findUserDetail = () => {
        return new Promise((resolve , reject) => {
            UserModel.findOne({userId: req.body.userId})
                .select()
                .lean()
                .exec((err, userDetails) => {
                    if(err){
                        loggerError(err.message,'Meeting Controller: findUserDetails');
                        reject(generatejson(true, 'Failed to find user details'))
                    }else if(isEmpty(userDetails)){
                        reject(generatejson(true, 'No User found'))
                    }else {
                        resolve(userDetails)
                    }
                })
        })
    }

    let findMeeting = (userDetails) => {
        return new Promise((resolve, reject) => {
            if(userDetails.isAdmin == 'true'){
                MeetingModel.findOne({hostId: req.body.hostId})
                    .select()
                    .lean()
                    .exec((err, meetingDetails) => {
                        if(err){
                            loggerError(err.message,'Meeting Controller: findMeeting')
                            reject(generatejson(true,'Failed to find meeting'));
                        }else if(isEmpty(meetingDetails)){
                            reject(generatejson(true, 'No Meeting found'));
                        }else {
                            let i= 0;
                            for(let meeting of meetingDetails){
                                if(isSameDayAsToday(meeting.meetingStartDate)){
                                    //send email
                                    i+=1;
                                }
                                
                            }
                            if(i>0){
                                resolve(meetingDetails);
                            }else {
                                reject(generatejson(true,'No meeting today'));
                            } 
                        }
                    })
            }
        })
    } 

    findUserDetail(req, res)
        .then(findMeeting)
        .then((data) => {
            res.status(200).json({success: true, msg:'Remainder Email Send', data:data});
        })
        .catch((err) => {
            res.status(200).json({err:err, msg:'Something went wrong'});
        })

}



