const {Message} = require('../../models/message')
function utcTransform(d){
    let utc=new Date(d);
    return utc.toLocaleString();
}
module.exports = async (req, res) => {
    let page=req.query.page||1;//当前请求页
    let pagesize=12; //每页数据条数
    let count=await Message.countDocuments(); 
    let total=Math.ceil(count/pagesize);//总页数
    const messages = await Message.aggregate([
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
    for (var i = 0; i < messages.length; i++) {
        messages[i].gmttime = utcTransform(messages[i].time);
    }
    res.render('admin/message', {
        messages,
        count,
        total,
        page
    })
}