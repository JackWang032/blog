const {Category}=require('../../models/category');
const {Article}=require('../../models/article.js');
module.exports=async(req,res)=>{
    const {id}=req.query;
    const {cgid}=await Category.findOne({_id:id});
    if(cgid!=0)  //其他类不可删除
    {
        await Category.deleteOne({_id:id})
        await Article.updateMany({category:cgid},{category:0});
    }
    res.redirect('/admin/category');

}