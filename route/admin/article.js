const {Article}=require('../../models/article');
module.exports=async(req, res) => {
     let page=req.query.page||1;//当前请求页
     let pagesize=12; //每页数据条数
     let count=await Article.countDocuments(); //用户总数
     let total=Math.ceil(count/pagesize);//总页数
     let articleList=await Article.aggregate([
        {
          $lookup:
            {
              from: "categories",
              localField: "category",
              foreignField: "cgid",
              as: "categoryInfo"
            }
       },
       {
        $lookup:
          {
            from: "users",
            localField: "author",
            foreignField: "_id",
            as: "author"
          }
     },
     {$unwind:{path:'$author',preserveNullAndEmptyArrays:true}},
     {$unwind:{path:'$categoryInfo',preserveNullAndEmptyArrays:true}}
     ]).sort('-publishDate').limit(pagesize).skip((page-1)*pagesize);
    res.render('admin/article',{
        msg:req.session.username,
        count:count,
        total:total,
        page:page,
        articleList:articleList   
    });
}