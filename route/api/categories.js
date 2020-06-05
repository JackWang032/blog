const {Category}=require('../../models/category')
const {Article}=require('../../models/article')
const express = require('express');
const router = express.Router();
//获取分类列表并排序
const handleCategory = async function () {
    let result=await Category.aggregate([
     {
       $lookup:
         {
           from: "articles",
           localField: "cgid",
           foreignField: "category",
           as: "children"
         }
    }
  ]);
  for(var i=0;i<result.length;i++){
     result[i].count=result[i].children.length;
 }
 result.sort(function(a,b){
     return b.count - a.count
 })
  return result
};
router.get('/:cgid',async(req,res)=>{
  let cgid=req.params.cgid;
  try{
      let result=await Category.findOne({cgid:cgid});
      let articleCount=await Article.countDocuments()
      result=result.toObject()
      result.count=articleCount
      res.sendResult(result,200,'获取成功')
  }
  catch{
      res.sendResult(null,400,'未找到该分类')
  }
})
router.get('/',async(req,res)=>{
  let categories=await handleCategory();
  res.sendResult(categories,200,'获取成功')
})
module.exports=router