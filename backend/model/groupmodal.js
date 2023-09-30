const mongoose = require('mongoose');

const groupSchema = mongoose.Schema({
    groupName: {
        type: String,
        required: true,
        unique: true,
    },
    createdTime: {
        type: Date,
        default: Date.now,
    },
    totalFollowers: [
        {
            type: String,
        }
    ],
    description: {
        type: String,
        default: '',
    },
    image: {
        type: String,
    },
});

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;
