const mongoose  = require('mongoose');
const shortid = require('shortid');
const {loggerInfo, loggerError} = require('../libs/logger')
const {generatejson} = require('../libs/response')
const {now} = require('../libs/time')
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

    let findMeeting = (userDetails) => {
        return new Promise((resolve, reject) => {
            // if(){

            // }else {

            // }

        })
    }

}

module.exports.getMeetingDetails = (req, res) => {
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

