const {User}=require('../../models/user')
const express=require('express')
const router=express.Router()
router.get('/',require('../verfyToken.js'),async(req,res)=>{
    let {pagenum,pagesize,query}=req.query;
    if(!pagenum||!pagesize)return res.sendResult(null,400,'缺少参数')
    pagenum=parseInt(pagenum)
    pagesize=parseInt(pagesize)
    let count=await User.find({username:new RegExp(query)}).countDocuments(); //用户总数
    let userList=null;
    if(!query)
     userList= await User.find().limit(pagesize).skip((pagenum-1)*pagesize);
     else
     userList=await User.find({username:new RegExp(query)}).limit(pagesize).skip((pagenum-1)*pagesize);
    let result={
        total:count,
        pagenum:pagenum,
        users:userList
    }
    res.sendResult(result,200,'获取用户列表成功')
})
router.put('/:id/state/:state',require('../verfyToken.js'),async(req,res)=>{
    let id=req.params.id;
    let state=req.params.state;
    await User.updateOne({_id:id},{state:state})
    res.sendResult(null,200,'修改状态成功')
})
router.put('/:id',require('../verfyToken.js'),async(req,res)=>{
    let id=req.params.id;
    let form=req.body
    if(form.oldPass){
        let myUser=await User.findOne({_id:id})
        if(form.oldPass!=myUser.password)return res.sendResult(null,401,'原密码错误')
    }
    await User.updateOne({_id:id},form)
    let afterUserInfo=await User.findOne({_id:id})
    res.sendResult(afterUserInfo,200,'修改用户信息成功')
})
router.delete('/:id',require('../verfyToken.js'),async(req,res)=>{
    let id=req.params.id;
    let user=await User.findOne({_id:id})
    if(user.role=='admin')return res.sendResult(null,400,'无法删除管理员用户，请先降级')
    await User.deleteOne({_id:id})
    res.sendResult(null,200,'删除用户成功')
})

module.exports=router