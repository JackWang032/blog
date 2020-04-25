//评论创建插入模块
const {User}=require('../../models/user');
const {Message}=require('../../models/message')
module.exports=async(req,res)=>{
    const {text,author,email,url}=req.body;
    const {cid}=req.query;
    let user=await User.findOne({email});
    if(user){ //评论用户邮箱已存在时
        if(url!='')
            await User.updateOne({email},{url});
        if(cid)   //二级评论创建
        {
            await Message.create({
                to_cid:cid,
                content:text,
                uid:user._id,
                time:new Date()
            })
        }
        else   //一级评论插入
        {
            await Message.create({
                uid:user._id,
                content:text,
                time:new Date()
            });
       }
        
    }
    else{
        await User.create({
            username:author,
            email:email,
            url:url||'',
        });
        user=await User.findOne({email});
        if(cid)   //二级评论插入
        {
            await Message.create({
                to_cid:cid,
                content:text,
                uid:user._id,
                time:new Date()
            })
        }
        else   //一级评论插入
        {
            await Message.create({
                uid:user._id,
                content:text,
                time:new Date()
            });
       }
    }
    res.redirect(`/home/message`); 
}