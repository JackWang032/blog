const {Article} = require('../../models/article');
const Category=require('./getcategory')
const pagination=require('mongoose-sex-page');
var index=0;
const mongoose=require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
function delHtmlTag(str){
    str=str.replace(/<[^>]+>/g,"");
    str=str.replace(/&nbsp;/ig, "");
    　　return str;
}
function getParent(cmlist,t){
    if(!cmlist[t].to_cid)
    {
        index=t;
        return;
    }
    for(var i=0;i<cmlist.length;i++){
        if(JSON.stringify(cmlist[i]._id)==JSON.stringify(cmlist[t].to_cid._id))
            {   getParent(cmlist,i);
                return
            }
    }
}
function filterCommt(cmlist){
    cmlist=cmlist.filter(function(item){
        return !item.to_cid ;
    })
    return cmlist;
}
function utcTransform(d){
    let utc=new Date(d);
    return utc.toLocaleString();
}
module.exports = async (req, res) => {
    const {aid,page} = req.query;
    const categorys=await Category.category();
    let myaid=new mongoose.Types.ObjectId(aid)
    if (aid) {    //详情页
        const {Comment}=require('../../models/comment')
        const article = await Article.aggregate([{
            $match:{
                _id:myaid
            }},
            {$lookup:{
                from: "categories",
                localField: "category",
                foreignField: "cgid",
                as: "cgInfo"
            }},
            { $unwind : "$cgInfo" }
        ])
        await Article.updateOne({_id:aid},{
            "$inc":{pageviews:1}
        })
        var commentList=await Comment.aggregate([
            {
            $lookup:{
                from: "users",
                localField: "uid",
                foreignField: "_id",
                as: "userInfo"
            }},
            {$lookup:{
                from: "comments",
                localField: "to_cid",
                foreignField: "_id",
                as: "parentInfo"
            }},
            {$unwind: {path: '$userInfo',preserveNullAndEmptyArrays: true}},
            {$unwind: {path: '$parentInfo',preserveNullAndEmptyArrays: true}},
            {$lookup:{
                from: "users",
                localField: "parentInfo.uid",
                foreignField: "_id",
                as: "parentUserInfo"
            }},
           { $unwind: {path: '$parentUserInfo',preserveNullAndEmptyArrays: true}},
           {
            $match:{
                aid:new ObjectId(aid)
            }}
        ]).sort('-time');
      
        for(var i=0;i<commentList.length;i++){
            commentList[i].gmttime=utcTransform(commentList[i].time);
            if(commentList[i].to_cid){
              getParent(commentList,i);
              if(commentList[index].children){
                commentList[index].children.push(commentList[i]);
              }
              else{
                  commentList[index].children=[];
                  commentList[index].children.push(commentList[i]);
              }
            }
        }
        commentList=filterCommt(commentList);
        res.render('home/article-detail', {
            article: article[0],
            comments:commentList,
            categorys:categorys
        })
    }
    else{  //列表页
        const articleList =await pagination(Article).find().sort('-publishDate').page(page||1).size(7).exec();
        for(var i=0;i<articleList.records.length;i++){  
            let reg= /<img.*?(?:>|\/>)/gi;
            articleList.records[i].content=delHtmlTag(articleList.records[i].content);
        }
        for(var i =0;i<articleList.records.length;i++){
            for(var j=0;j<categorys.length;j++)
            {
                if(articleList.records[i].category==categorys[j].cgid){
                    articleList.records[i].cgname=categorys[j].cgname;
                    break;
                }
            }
        }
        res.render('home/article-list',
            {
                articleList,
                categorys:categorys
            }
        );
    }
}