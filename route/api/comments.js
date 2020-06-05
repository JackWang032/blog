const {Comment} = require('../../models/comment')
const {User}=require('../../models/user');
const {Setting}=require('../../models/setting')
const mongoose = require('mongoose')
const express = require('express');
const router = express.Router();
var index = 0;
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

function utcTransform(d) {
    let utc = new Date(d);
    return utc.toLocaleString();
}
router.get('/new',async (req, res) => {
    let result = await Comment.aggregate([{
            $sort: {
                time: -1
            }
        }, {
            $limit: 5
        },
        {
            $lookup: {
                from: 'users',
                localField: 'uid',
                foreignField: '_id',
                as: 'userInfo'
            }
        },
        {
            $unwind: {
                path: '$userInfo'
            }
        },
        {
            $project: {
                username: '$userInfo.username',
                content: 1,
                time: 1,
                aid: 1
            }
        }
    ])
  res.sendResult(result,200,'获取成功')
})
router.get('/:aid',async (req, res) => {
    let aid = req.params.aid;
    try {
        let commentList = await Comment.aggregate([{
            $match: {
                aid: new mongoose.Types.ObjectId(aid)
            }
        }, {
            $lookup: {
                from: "users",
                localField: "uid",
                foreignField: "_id",
                as: "userInfo"
            }
        },
        {
            $lookup: {
                from: "comments",
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
        },
        {
            $sort: {
                time: -1
            }
        },
    ])
    let cmtCount=await Comment.find({aid:aid}).countDocuments()
    for (var i = 0; i < commentList.length; i++) {
        commentList[i].gmttime = utcTransform(commentList[i].time);
        if (commentList[i].to_cid) {
            getParent(commentList, i);
            if (commentList[index].children) {
                commentList[index].children.push(commentList[i]);
            } else {
                commentList[index].children = [];
                commentList[index].children.push(commentList[i]);
            }
        }
    }
    commentList = filterCommt(commentList);
    let cmtObj={
        total:cmtCount,
        comments:commentList
    }
    res.sendResult(cmtObj, 200, '获取成功')
    } catch (error) {
        res.sendResult(error, 400, '获取失败'+error)
    }
})
router.post('/:aid',async(req,res)=>{
    const {text,author,email,url,cid}=req.body;
    const aid=req.params.aid;
    let setting=await Setting.findOne();
    let user=await User.findOne({email});
    try {
        if(user){ //评论用户邮箱已存在时
            if(url!='')
                await User.updateOne({email},{url});
            if(cid)   //二级评论创建
            {
                await Comment.create({
                    aid:aid,
                    to_cid:cid,
                    content:text,
                    uid:user._id,
                    time:new Date(),
                    status:setting.approvalCmt==1&&cid!='5e7747b78bb07713f4f68106'?0:1
                })
            }
            else   //一级评论插入
            {
                await Comment.create({
                    aid:aid,
                    uid:user._id,
                    content:text,
                    time:new Date(),
                    status:setting.approvalCmt==1&&cid!='5e7747b78bb07713f4f68106'?0:1
                });
           }
           let cmts=await Comment.find({aid:aid})
            return res.sendResult(cmts,200,'评论成功')
        }
        else{
            await User.create({
                username:author,
                email:email,
                url:url||'',
            });
            user=await User.findOne({email});
            if(cid)   //二级评论插入
            {
                await Comment.create({
                    aid:aid,
                    to_cid:cid,
                    content:text,
                    uid:user._id,
                    time:new Date(),
                    status:setting.approvalCmt==1&&cid!='5e7747b78bb07713f4f68106'?0:1
                })
            }
            else   //一级评论插入
            {
                await Comment.create({
                    aid:aid,
                    uid:user._id,
                    content:text,
                    time:new Date(),
                    status:setting.approvalCmt==1&&cid!='5e7747b78bb07713f4f68106'?0:1
                });
           }
           return res.sendResult(null,200,'评论成功')
        }
    } catch (error) {
        return res.sendResult(error,401,'评论失败'+error)
    }
   
  
})
module.exports = router