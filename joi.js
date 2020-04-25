//表单合法性验证
const joi = require('joi');
const User=require('./models/user');
module.exports = async(req, res) => {
    const schema = {
        username: joi.string().required().min(2).max(10).error(new Error('用户名不符合规则')),
        email: joi.string().email().required().error(new Error('邮箱不合法')),
        password: joi.string().min(6).max(18).regex(/^[a-zA-Z0-9]{3,30}$/).required().error(new Error('密码不符合规则')),
        role: joi.string().valid('normal', 'admin').required().error(new Error('身份合法')),
        state: joi.number().integer().valid(0, 1).required().error(new Error('状态非法'))
    }
    try {
        await joi.validate(req.body, schema);
        let user=User.findOne({email:req.body.email});
        if(user)
          return  res.redirect(`/admin/user-edit?message=邮箱地址已被使用`);
    } catch (error) {
        return res.redirect(`/admin/user-edit?message=${error.message}`);
    }
    res.
}