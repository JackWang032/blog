const {Article}=require('../../models/article');
const {Category}=require('../../models/category')
module.exports = async (req, res) => {
    
    const {id}=req.query;
    const categorys=await Category.find();
    if(id)
    {
        const article=await Article.findOne({_id:id}).populate('author');
        res.render('admin/article-edit',{
         article:article,
         categorys
        });
    }
    else
         res.render('admin/article-edit',{
            categorys
         });

}