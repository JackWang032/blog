const {Message} = require('../../models/message');
const express = require('express');
const router = express.Router();
var index = 0
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
router.get('/',async (req, res) => {
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
module.exports = router