const {Message}=require('../../models/message')
module.exports=async(req,res)=>{
    const {reply,cid}=req.query;
    await Message.create({
        to_cid:cid,
        content:reply,
        uid:'5e7747b78bb07713f4f68106',
        time:new Date()
    })
   res.status(200).send('replyok');
}