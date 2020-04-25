const {Comment}=require('../../models/comment')
module.exports=async(req,res)=>{
    const {reply,aid,cid}=req.query;
    await Comment.create({
        aid:aid,
        to_cid:cid,
        content:reply,
        uid:'5e7747b78bb07713f4f68106',
        time:new Date(),
        status:1
    })
   res.status(200).send('replyok');
}