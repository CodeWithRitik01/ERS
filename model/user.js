const mongoose = require('mongoose');

const path = require('path');

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    isAdmin: {
        type: 'Boolean',
        required: true
    },
    userToReview: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    reviewReceived: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
},{
    timestamps:true
});

const User = mongoose.model('User', userSchema);

module.exports = User;