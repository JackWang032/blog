const {Comment} = require('../../models/comment')
function utcTransform(d){
    let utc=new Date(d);
    return utc.toLocaleString();
}
module.exports = async (req, res) => {
    let page=req.query.page||1;//当前请求页
    let pagesize=12; //每页数据条数
    let count=await Comment.countDocuments(); 
    let total=Math.ceil(count/pagesize);//总页数
    const comments = await Comment.aggregate([{
            $lookup: {
                from: "articles",
                localField: "aid",
                foreignField: "_id",
                as: "articleInfo"
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "uid",
                foreignField: "_id",
                as: "userInfo"
            }
        },
        {
            $unwind: {
                path: '$articleInfo',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $unwind: {
                path: '$userInfo',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $sort:{
                time:-1
            }
        },
        { $skip : pagesize*(page-1) },
        { $limit:pagesize}
    ]);
    for (var i = 0; i < comments.length; i++) {
        comments[i].gmttime = utcTransform(comments[i].time);
    }
    res.render('admin/comment', {
        comments,
        count,
        total,
        page
    })
}