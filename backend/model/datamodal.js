const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    name: {
        type: String,
        required: true,
    },
    text: {
        type: String,
    },
    images: [String],
    likes: [String],
    comments: [
        {
            comment: String,
            userId: String,
            currentTime: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    createdTime: {
        type: Date,
        default: Date.now,
    },
});


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
        default: 'this is description , you can edit it from profile page'
    },
    location: {
        type: String,
        default: 'India'
    },
    accountType: {
        type: String,
        enum: ['verified', 'non-verified'],
        default: 'non-verified'
    },
    languageSpeak: [{
        type: String
    }],
    following: [String],
    followers: [String],
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
    notifications: [
        {
            message: {
                type: String,
                required: true,
            },
            senderId: {
                type: String,
                required: true,
            },
            senderName: {
                type: String,
                required: true,
            },
            recipient: {
                type: String,
                required: true,
            },
            timestamp: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    posts: [postSchema],
    joinedDate: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });


const User = mongoose.model('User', userSchema);

module.exports = User;