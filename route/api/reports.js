const express = require('express')
const router = express.Router()
const {
    Article
} = require('../../models/article')
const {
    Comment
} = require('../../models/comment')
router.get('/', async (req, res) => {
    let categoryGroup = await Article.aggregate([{
            $lookup: {
                from: 'categories',
                foreignField: 'cgid',
                localField: 'category',
                as: 'cgInfo'
            }
        },
        {
            $unwind: {
                path: '$cgInfo'
            }
        }, {
            $group: {
                _id: '$cgInfo.cgname',
                count: {
                    $sum: 1
                }
            },

        }, {
            $project: {
                name: '$_id',
                value: "$count",
                _id: 0
            }
        }
    ])
    let commentGroup = await Comment.aggregate([{
            $group: {
                _id: '$aid',
                count: {
                    $sum: 1
                }
            }
        }, {
            $lookup: {
                from: 'articles',
                foreignField: '_id',
                localField: '_id',
                as: 'articleInfo'
            }
        }, {
            $unwind: {
                path: '$articleInfo'
            }
        }, {
            $project: {
                title: '$articleInfo.title',
                count: 1,
                _id: 0
            }
        },
        {
            $sort: {
                count: -1
            }
        }
    ])
    let pageviewGroup=await Article.aggregate([{
        $project:{
            title:1,
            pageviews:1,
            _id:0
        },
    },{
        $sort:{
            pageviews:-1
        }
    },{$limit:10}])
    res.sendResult({
        categoryGroup,
        commentGroup,
        pageviewGroup
    }, 200, '获取成功')
})
module.exports = router