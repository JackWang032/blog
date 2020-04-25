//评论创建插入模块
const {User}=require('../../models/user');
const {Comment}=require('../../models/comment')
module.exports=async(req,res)=>{
    const {text,author,email,url}=req.body;
    const {aid,cid}=req.query;
    let user=await User.findOne({email});
    if(user){ //评论用户邮箱已存在时
        if(url!='')
            await User.updateOne({email},{url});
        if(cid)   //二级评论创建
        {
            await Comment.create({
                aid:aid,
                to_cid:cid,
                content:text,
                uid:user._id,
                time:new Date(),
                status:req.app.locals.setting.approvalCmt==1&&cid!='5e7747b78bb07713f4f68106'?0:1
            })
        }
        else   //一级评论插入
        {
            await Comment.create({
                aid:aid,
                uid:user._id,
                content:text,
                time:new Date(),
                status:req.app.locals.setting.approvalCmt==1&&cid!='5e7747b78bb07713f4f68106'?0:1
            });
       }
        res.redirect(`/home/article?aid=${aid}`); 
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
            await Comment.create({
                aid:aid,
                to_cid:cid,
                content:text,
                uid:user._id,
                time:new Date(),
                status:req.app.locals.setting.approvalCmt==1&&cid!='5e7747b78bb07713f4f68106'?0:1
            })
        }
        else   //一级评论插入
        {
            await Comment.create({
                aid:aid,
                uid:user._id,
                content:text,
                time:new Date(),
                status:req.app.locals.setting.approvalCmt==1&&cid!='5e7747b78bb07713f4f68106'?0:1
            });
       }
        res.redirect(`/home/article?aid=${aid}`); 
    }

}