const {User} = require('../../models/user')
const express = require('express');
const router = express.Router();
const  JWT = require("../../jwt.js")

router.post('/', async (req, res) => {
    let {
        uid,
        pwd
    } = req.body;
    if (!uid || !pwd) return res.sendResult(null, 400, '用户名或密码不能为空')
    let admin=await User.findOne({uid:uid,password:pwd})
    if (admin&&admin.role=='admin') {
        let jwt=new JWT(uid)
        let token=jwt.generateToken()
        res.sendResult({
            _id:admin._id,
            token:token,
            uid:admin.uid,
            username:admin.username,
            qq:admin.qq,
            email:admin.email||'',
            tel:admin.tel||''
        }, 200, '登陆成功')
    } else res.sendResult(null, 400, '用户名或密码错误')
})
module.exports = router