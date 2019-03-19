const mongoose = require('mongoose');

let meetingSchema = new mongoose.Schema({
    meetingId:{
        type:String,
        default:'',
        index:true,
        unique:true
    },
    meetingTopic: {
        type: String,
        default:''
    },
    hostId:{
        type:String,
        default:''
    },
    participantId:{
        type:String,
        default:''
    },
    participantName:{
        type: String,
        default:''
    },
    meetingStartDate:{
        type: Date,
        default:''
    },
    meetingEndDate:{
        type:Date,
        default:''
    },
    meetingDescription:{
        type: String,
        default:''
    },
    meetingPlace:{
        type:String,
        default:''
    }, 
    createdOn:{
        type:Date,
        default:''
    }
})


mongoose.model('Meeting', meetingSchema);
