//创建用户集合
const mongoose = require('mongoose');
const joi = require('joi');
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 20
    },
    email: {
        type: String,
        unique: true
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
        default: 0
    },
    url:{
        type:String
    }
});
const User = mongoose.model('User', userSchema);
const validataUser = (user) => {
    const schema = {
        username: joi.string().required().min(2).max(10).error(new Error('用户名不符合规则')),
        email: joi.string().email().required().error(new Error('邮箱不合法')),
        password: joi.string().min(6).max(18).regex(/^[a-zA-Z0-9]{3,30}$/).required().error(new Error('密码不符合规则')),
        role: joi.string().valid('normal', 'admin').required().error(new Error('身份合法')),
        state: joi.number().integer().valid(0, 1).required().error(new Error('状态非法'))
    }
    return joi.validate(user, schema);
}
module.exports = {
    User: User,
    validataUser: validataUser
}