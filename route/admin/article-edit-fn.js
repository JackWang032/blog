const {Article}=require('../../models/article');
function fulltime(pbDate){
    let date1=new Date();
    let date2=new Date(pbDate);
    let fullDate=date2.getFullYear()+'/'+(date2.getMonth()+1)+ '/' + date2.getDate()+' '+date1.toLocaleTimeString();
    return fullDate;
  }
module.exports = async(req, res) => {
    try {
        let {title,publishDate,content,category}=req.body;
        const {articleid}=req.query;
        var article={};
        let cover=req.files.cover.path;
        publishDate=fulltime(publishDate)
        if(!req.files.cover.originalFilename)
        {
             article={
                title,
                publishDate,
                content,
                category
            }
        }
        else
        {
           cover=cover.path.replace(/\\/g,"/").substr(6);
           article={
            title,
            publishDate,
            content,
            cover,
            category
            }
        }
        await Article.updateOne({_id:articleid},article);
        res.status(200).send('修改成功');
    } catch (error) {
        return res.status(400).send(error.message);
    }
   
}