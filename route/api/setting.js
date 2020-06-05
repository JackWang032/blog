const {Setting}=require('../../models/setting')
const express = require('express');
const router = express.Router();
router.get('/',async(req,res)=>{
    let result=await Setting.findOne();
    res.sendResult(result,200,'获取成功')
})
module.exports=router