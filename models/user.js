//创建用户集合
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength:1
    },
    uid:{
        type:String
    },
    qq: {
        type: String,
        unique: true,
        required:true,
        minlength:5
    },
    password: {
        type: String,
    },
    role: {
        type: String,
        default:'normal',
    },
    state: {
        type: Number,
        default: 1
    },
    email:{
        type:String
    },
    tel:{
        type:String
    }
});
const User = mongoose.model('User', userSchema);
module.exports = {
    User: User
}