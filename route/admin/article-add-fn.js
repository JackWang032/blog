const {Article,validataArticle}=require('../../models/article');
const {Category}=require('../../models/category')
function fulltime(pbDate){
  let date1=new Date();
  let date2=new Date(pbDate);
  let fullDate=date2.getFullYear()+'/'+(date2.getMonth()+1)+ '/' + date2.getDate()+' '+date1.toLocaleTimeString();
  return fullDate;
}
module.exports = async(req, res) => {
    try {
        let {title,publishDate,content,category}=req.body;
        const {userid}=req.query;
        let cover=req.files.cover.path;
        let article={};
        let hascover=req.files.cover.size==0?false:true;
        publishDate=fulltime(publishDate)
       
        if(hascover)
           cover=cover.path.replace(/\\/g,"/").substr(6);  
        else
          {
            let cgcover=await Category.findOne({cgid:category})
            cover=cgcover.cover
           }
          console.log(cover)
          article={
            title,
            author:userid,
            publishDate,
            content,
            cover,
            category,
            pageviews:0
          }
        await validataArticle(article);
        await Article.create(article);
        res.status(200).send('发布成功');
    } catch (error) {
        return res.status(400).send(error.message);
    }
   
}