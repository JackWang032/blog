const {Article}=require('../../models/article');
const {Comment}=require('../../models/comment')
const Category=require('./getCategory');
const {Setting}=require('../../models/setting')
function delHtmlTag(str){
    str=str.replace(/<[^>]+>/g,"");
    str=str.replace(/&nbsp;/ig, "");
    　　return str;
    }
module.exports= async(req, res) => {
    const articles=await Article.find({author:'5e7747b78bb07713f4f68106'}).sort('-publishDate').limit(15);
    const comments=await Comment.find().populate('uid').sort('-time').limit(8);
    const categorys=await Category.category();
    const hotAtl=await Article.find().sort('-pageviews').limit(5);
    await Setting.updateOne({},{ //访问量加一
        "$inc":{visitors:1}
    });
    const setting=await Setting.findOne({});
    let group=await Article.aggregate([  //归档月份分组
        { 
            $project : {
                "Day" : {
                    "$dateToString" : {
                        "format" : "%Y-%m", 
                        "date" : "$publishDate"
                    }
                }
            }
        },
        {
            $group:{
                _id:"$Day"
            }
        },
        {
            $sort:{
                _id:-1
            }
        }
    ])
    for(var i=0;i<articles.length;i++){  
        articles[i].content=delHtmlTag(articles[i].content);
    }
    var dateList=[];
    for (var i=0;i<group.length;i++){
        let obj={};
        obj.month=group[i]._id.substr(0,4)+'年'+group[i]._id.substr(5,2)+'月';
        obj.articles=await Article.aggregate([
            {
                $project:{
                    _id:1,
                    title:1,
                    "Day" : {
                        "$dateToString" : {
                            "format" : "%Y-%m", 
                            "date" : "$publishDate"
                        }
                    }
                }
            },
            {
                $match:{
                    "Day":group[i]._id
                }

            }
        ])
        dateList.push(obj)
    }
    const articleCount=await Article.countDocuments();
    const commentCount=await Comment.countDocuments();
    req.app.locals.dateList=dateList;
    req.app.locals.setting.visitors=setting.visitors;
    res.render('home/index',{
        articles,
        categorys,
        comments,
        articleCount,
        commentCount,
        hotAtl
    });
}