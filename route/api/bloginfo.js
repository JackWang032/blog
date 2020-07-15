const {Article}=require('../../models/article');
const {Comment}=require('../../models/comment')
const {Setting}=require('../../models/setting')
const express = require('express');
const router = express.Router();
function getruntime(d) {
    let utc = new Date(d);
    let now=new Date();
    let del=now-utc
    let days = Math.floor(del / (24 * 3600 * 1000))
    return days;
}
router.get('/',async(req,res)=>{

    let articleCount=await Article.countDocuments();
    let commentCount=await Comment.countDocuments();
    let setting=await Setting.findOne();
    let visitors=setting.visitors;
    let runtime=getruntime(setting.startDate);
    let result={
        articleCount,
        commentCount,
        visitors,
        runtime
    }
    res.sendResult(result,200,'获取成功')
})
module.exports=router