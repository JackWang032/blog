const {Article}=require('../../models/article');
const {Category}=require('../../models/category')
const pagination=require('mongoose-sex-page');
const Categorys=require('./getCategory')
function delHtmlTag(str){
    str=str.replace(/<[^>]+>/g,"");
    str=str.replace(/&nbsp;/ig, "");
    　　return str;
    }
module.exports=async(req,res)=>{
    const {category,page}=req.query;
    const articleList=await pagination(Article).find({category}).sort('-publishDate').page(page||1).size(7).exec();
    var categoryInfo=await Category.findOne({cgid:category});
    for(var i=0;i<articleList.records.length;i++){  
        let reg= /<img.*?(?:>|\/>)/gi;
        articleList.records[i].content=delHtmlTag(articleList.records[i].content);
    }
    const categorys=await Categorys.category();
    res.render('home/article-category',{
        articleList,
        categoryInfo,
        categorys
    })
}