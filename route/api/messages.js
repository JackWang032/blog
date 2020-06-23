const {Message} = require('../../models/message');
const {User} = require('../../models/user');
const express = require('express');
const router = express.Router();
var index = 0
var del_id=[]
function getParent(cmlist, t) {
    if (!cmlist[t].to_cid) {
        index = t;
        return;
    }
    for (var i = 0; i < cmlist.length; i++) {
        if (JSON.stringify(cmlist[i]._id) == JSON.stringify(cmlist[t].to_cid._id)) {
            getParent(cmlist, i);
            return
        }
    }
}
function filterCommt(cmlist) {
    cmlist = cmlist.filter(function (item) {
        return !item.to_cid;
    })
    return cmlist;
}
router.get('/list',async (req, res) => {
    var messageList = await Message.aggregate([{
            $lookup: {
                from: "users",
                localField: "uid",
                foreignField: "_id",
                as: "userInfo"
            }
        },
        {
            $lookup: {
                from: "messages",
                localField: "to_cid",
                foreignField: "_id",
                as: "parentInfo"
            }
        },
        {
            $unwind: {
                path: '$userInfo',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $unwind: {
                path: '$parentInfo',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "parentInfo.uid",
                foreignField: "_id",
                as: "parentUserInfo"
            }
        },
        {
            $unwind: {
                path: '$parentUserInfo',
                preserveNullAndEmptyArrays: true
            }
        }
    ]).sort('-time');
    for (var i = 0; i < messageList.length; i++) {
        if (messageList[i].to_cid) {
            getParent(messageList, i);
            if (messageList[index].children) {
                messageList[index].children.push(messageList[i]);
            } else {
                messageList[index].children = [];
                messageList[index].children.push(messageList[i]);
            }
        }
    }
    messageList = filterCommt(messageList);
    res.sendResult(messageList,200,'获取成功')
})
router.get('/',async (req, res) => {
    let {pagesize,pagenum,query,status}=req.query;
    if(!pagesize||!pagenum)return res.sendResult(null,400,'参数错误')
    pagesize=parseInt(pagesize)
    pagenum=parseInt(pagenum)

    let match = {
        $match: {}
    }
    let countMatch = {}
    if (query) {
        countMatch.content = new RegExp(query)
        match.$match.content = new RegExp(query)
    }
    if (status) {
        match.$match.status = parseInt(status)
        countMatch.status = parseInt(status)
    }


    let result = await Message.aggregate([{
        ...match
    }, {
        $lookup: {
            from: 'users',
            foreignField: '_id',
            localField: 'uid',
            as: 'userInfo'
        }
    }, {
        $lookup: {
            from: 'messages',
            foreignField: '_id',
            localField: 'to_cid',
            as: 'toInfo'
        }
    }, {
        $unwind: {
            path: '$userInfo'
        }
    },  {
        $unwind: {
            path: '$toInfo',
            preserveNullAndEmptyArrays:true
        }
    }, {
        $project:{
            username:'$userInfo.username',
            content:1,
            time:1,
            to_comment:'$toInfo.content',
            status:1
        }
    },{
        $sort:{time:-1}
    },{
        $skip:(pagenum-1)*pagesize
    },{
        $limit:pagesize
    }]);
    let total = await Message.find({...countMatch}).countDocuments()
    res.sendResult({
        messages:result,
        total:total
    },200,'获取成功')
})
router.post('/',async(req,res)=>{
    const {text,qq,nickname,cid}=req.body;
    if(!text||text=="")return res.sendResult(null,400,'内容不能为空')
    let user=await User.findOne({qq});
    try {
        if(user){ 
            if(cid)   //二级评论创建
            {
                await Message.create({
                    to_cid:cid,
                    content:text,
                    uid:user._id,
                    time:new Date(),
                })
            }
            else   //一级评论插入
            {
                await Message.create({
                    uid:user._id,
                    content:text,
                    time:new Date(),
                });
           }
            return res.sendResult(null,200,'评论成功')
        }
        else{
            await User.create({
                qq:qq,
                username:nickname,
            });
            user=await User.findOne({qq});
            if(cid)   //二级评论插入
            {
                await Message.create({
                    to_cid:cid,
                    content:text,
                    uid:user._id,
                    time:new Date(),
                })
            }
            else   //一级评论插入
            {
                await Message.create({
                    uid:user._id,
                    content:text,
                    time:new Date(),
                });
           }
           return res.sendResult(null,200,'评论成功')
        }
    } catch (error) {
        return res.sendResult(error,401,'评论失败'+error)
    }
})
router.put('/:cid/status', require('../verfyToken.js'), async (req, res) => {
    let cid = req.params.cid;
    await Message.updateOne({
        _id: cid
    }, {
        status: 1
    })
    res.sendResult(null, 200, '审批成功')
})
router.delete('/:cid',require('../verfyToken.js'),async(req,res)=>{
    let cid=req.params.cid;
    let messages=await Message.find().populate('to_cid');
del_id=[]
    del_id.push(cid);
    for(var i=0;i<messages.length;i++){
        if(messages[i].to_cid)
           getParent(messages,i,cid,i);
    }
    for(var i=0;i<del_id.length;i++){
        await Message.deleteOne({_id:del_id[i]})
    }
    res.sendResult(null,200,'已级联删除'+del_id.length+'条留言')
})
module.exports = router