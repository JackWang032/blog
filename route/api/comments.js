const {
    Comment
} = require('../../models/comment')
const {
    User
} = require('../../models/user');
const {
    Setting
} = require('../../models/setting')
const mongoose = require('mongoose')
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
router.get('/new', async (req, res) => {
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
    res.sendResult(result, 200, '获取成功')
})
router.get('/', async (req, res) => {
    let {
        pagesize,
        pagenum,
        query,
        status
    } = req.query;
    if (!pagenum || !pagesize) res.sendResult(null, 400, '缺少参数')
    pagenum = parseInt(pagenum)
    pagesize = parseInt(pagesize)
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

    let result = await Comment.aggregate([{
            ...match
        },
        {
            $lookup: {
                from: 'articles',
                foreignField: '_id',
                localField: 'aid',
                as: 'articleInfo'
            }
        }, {
            $lookup: {
                from: 'users',
                foreignField: '_id',
                localField: 'uid',
                as: 'userInfo'
            }
        }, {
            $lookup: {
                from: 'comments',
                foreignField: '_id',
                localField: 'to_cid',
                as: 'toInfo'
            }
        }, {
            $unwind: {
                path: '$userInfo'
            }
        }, {
            $unwind: {
                path: '$articleInfo'
            }
        }, {
            $unwind: {
                path: '$toInfo',
                preserveNullAndEmptyArrays: true
            }
        }, {
            $project: {
                aid: 1,
                title: '$articleInfo.title',
                username: '$userInfo.username',
                status: 1,
                content: 1,
                time: 1,
                to_comment: '$toInfo.content'
            }
        }, {
            $sort: {
                time: -1
            }
        }, {
            $skip: (pagenum - 1) * pagesize
        }, {
            $limit: pagesize
        }
    ]);
    let total = await Comment.find({...countMatch}).countDocuments()
    res.sendResult({
        comments: result,
        total: total
    }, 200, '获取成功')
})
router.get('/:aid', async (req, res) => {
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
            }
        ]).sort('-time');
        let cmtCount = await Comment.find({
            aid: aid
        }).countDocuments()
      for (var i = 0; i < commentList.length; i++) {
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
        let cmtObj = {
            total: cmtCount,
            comments: commentList
        }
        res.sendResult(cmtObj, 200, '获取成功')
    } catch (error) {
        res.sendResult(error, 400, '获取失败' + error)
    }
})
router.post('/:aid', async (req, res) => {
    const {
        content,
        qq,
        nickname,
        cid
    } = req.body;
    const aid = req.params.aid;
    let setting = await Setting.findOne();
    let user = await User.findOne({
        qq
    });
    try {
        if (user) { //评论用户邮箱已存在时
            if (cid) //二级评论创建
            {
                await Comment.create({
                    aid: aid,
                    to_cid: cid,
                    content: content,
                    uid: user._id,
                    time: new Date(),
                    status: setting.approvalCmt == 1 && cid != '5e7747b78bb07713f4f68106' ? 0 : 1
                })
            } else //一级评论插入
            {
                await Comment.create({
                    aid: aid,
                    uid: user._id,
                    content: content,
                    time: new Date(),
                    status: setting.approvalCmt == 1 && cid != '5e7747b78bb07713f4f68106' ? 0 : 1
                });
            }
            let cmts = await Comment.find({
                aid: aid
            })
            return res.sendResult(cmts, 200, '评论成功')
        } else {
            await User.create({
                qq: qq,
                username: nickname,
            });
            user = await User.findOne({
                qq
            });
            if (cid) //二级评论插入
            {
                await Comment.create({
                    aid: aid,
                    to_cid: cid,
                    content: content,
                    uid: user._id,
                    time: new Date(),
                    status: setting.approvalCmt == 1 && cid != '5e7747b78bb07713f4f68106' ? 0 : 1
                })
            } else //一级评论插入
            {
                await Comment.create({
                    aid: aid,
                    uid: user._id,
                    content: content,
                    time: new Date(),
                    status: setting.approvalCmt == 1 && cid != '5e7747b78bb07713f4f68106' ? 0 : 1
                });
            }
            return res.sendResult(null, 200, '评论成功')
        }
    } catch (error) {
        return res.sendResult(error, 401, '评论失败' + error)
    }


})
router.put('/:cid/status', require('../verfyToken.js'), async (req, res) => {
    let cid = req.params.cid;
    await Comment.updateOne({
        _id: cid
    }, {
        status: 1
    })
    res.sendResult(null, 200, '审批成功')
})
router.delete('/:cid', require('../verfyToken.js'), async (req, res) => {
    let cid = req.params.cid;
    let comments = await Comment.find().populate('to_cid');
    del_id = []
    del_id.push(cid);
    for (var i = 0; i < comments.length; i++) {
        if (comments[i].to_cid)
            getParent(comments, i, cid, i);
    }
    for (var i = 0; i < del_id.length; i++) {
        await Comment.deleteOne({
            _id: del_id[i]
        })
    }
    res.sendResult(null, 200, '已级联删除' + del_id.length + '条评论')
})
module.exports = router