const mongoose = require('mongoose');


// const userSchema = mongoose.Schema({
//     name:{
//         type:String,
//         require: true
//     },
//     email:{
//         type:String,
//         require: true,
//         unique: true
//     },
//     password:{
//         type:String,
//         require:true
//     },
//     token:{
//         type:String
//     }
// },{timestamps:true});

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    location: {
        type: String,
        default: ''
    },
    accountType: {
        type: String,
        enum: ['verified', 'non-verified'],
        default: 'non-verified'
    },
    languageSpeak: [{
        type: String
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    socialMediaLinks: [{
        platform: {
            type: String,
            enum: ['facebook', 'twitter', 'instagram']
        },
        url: {
            type: String,
            default: ''
        }
    }],
    joinedDate: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });


const User = mongoose.model('User', userSchema);

module.exports = User;