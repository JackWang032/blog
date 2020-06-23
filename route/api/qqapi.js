const request = require('request');
const express = require('express');
const router = express.Router();
var url='https://api.uomg.com/api/qq.info?qq='
router.get('/:qq',async(req,res)=>{
    let qq=req.params.qq
    if(!qq)return res.sendResult(null,400,'请输入QQ')
   request(url+qq, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            let result=JSON.parse(body)
          return res.sendResult(result,200,'获取成功')
        }
       return  res.sendResult(error,400,'请输入正确的QQ')
        
      })
})
module.exports=router