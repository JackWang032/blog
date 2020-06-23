// 引入模块依赖
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
// 创建 token 类
class Jwt {
    constructor(data) {
        this.data = data;
    }
    //生成token
    generateToken() {
        let data = this.data;
        let cert = 'watawteoa213'; //私钥 可以自己生成
        let token = jwt.sign({
            data,
        }, cert, {
            expiresIn: 24 * 60 * 60
        });
        return token;
    }

    // 校验token
    verifyToken() {
        let token = this.data;
        let cert = 'watawteoa213'; //公钥 可以自己生成
        let res;
        try {
            let result = jwt.verify(token, cert) || {};
            res=result.data
        } catch (e) {
            res = 'err';
        }
        return res;
    }
}

module.exports = Jwt;