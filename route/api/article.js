const {Article}=require('../../models/article');
function delHtmlTag(str){
    str=str.replace(/<[^>]+>/g,"");
    str=str.replace(/&nbsp;/ig, "");
    　　return str;
    }
function formatDate(pblDate){
    let date=pblDate
    return (date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate())
}
module.exports= async(req, res) => {
    const page=req.params.page;
    let size=7;
    let articles=await Article.find({author:'5e7747b78bb07713f4f68106'}).sort('-publishDate').skip((page-1)*size).limit(5).lean();
    for(let i=0;i<articles.length;i++){  
        articles[i].content=delHtmlTag(articles[i].content);
        articles[i].formatdate=formatDate(articles[i].publishDate);
    }
    res.send(articles)
}