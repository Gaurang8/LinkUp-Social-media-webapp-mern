const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
    name:{
        type:String,
        require: true
    },
    email:{
        type:String,
        require: true,
        unique: true
    },
    password:{
        type:String,
        require:true
    },
    token:{
        type:String
    }
},{timestamps:true});

const User = mongoose.model('User', userSchema);

module.exports = User;