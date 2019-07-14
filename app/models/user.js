let mongoose  = require('mongoose');
let Schema = mongoose.Schema;

let userSchema = new Schema({
    userId: {
        type: String,
        default:'',
        index: true,
        unique: true
    },
    fullName: {
        type: String,
        required: true
    },
    userName: {
        type:String,
        required:true
    },
    emailId:{
        type: String,
        required:true
    },
    password:{
        type:String,
        required: true
    },
    country:{
        type:String,
        required: true
    },
    mobileno:{
        type: Number,
        required:true
    },
    signup_date:{
        type: Date,
        default:null
    },
    last_login: {
        type: Date,
        default: null
    },
    resetPassword: {
        reset_status:{
            type:String,
            default:''
        },
        last_reset:{
            type: String,
            default:''
        }
    },
    email_verified:{
        type:String,
        default: 'No'
    },
    validationToken:{
        type: String,
        default: ''
    },
    isAdmin:{
        type: String,
        default: 'false'
    },

});

mongoose.model('User', userSchema);

