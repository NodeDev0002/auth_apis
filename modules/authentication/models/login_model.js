const mongoose = require('mongoose');
const validator = require('validator');

const loginSchema = new mongoose.Schema(
    {
        username: String, 
        email: {
            type: String, 
        },
        password: {
            type: String,
        }, 
        profilePic: String,     
    },
);


module.exports = mongoose.model('users', loginSchema);
