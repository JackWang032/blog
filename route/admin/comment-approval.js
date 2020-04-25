const {Comment}=require('../../models/comment')
module.exports=async(req,res)=>{
    await Comment.updateOne({_id:req.query.id},{status:1});
    res.redirect('/admin/comment')
}