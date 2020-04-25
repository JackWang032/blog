const {Article}=require('../../models/article');
const {Comment}=require('../../models/comment')
module.exports=async(req,res)=>{
    const {id}=req.query;
    try {
        await Article.deleteOne({_id:id});
        await Comment.deleteMany({aid:id});
        console.log('文章删除成功');
        res.status(200).send('success')
    } catch (error) {
        res.status(400).send(error.message);
    }
}