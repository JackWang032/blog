const {
    Article
} = require('../../models/article');
const mongoose = require('mongoose')
const express = require('express');
const router = express.Router();

function delHtmlTag(str) {
    str = str.replace(/<[^>]+>/g, "");
    str = str.replace(/&nbsp;/ig, "");
    return str;
}
router.get('/hot', async (req, res) => {
    try {
        let result = await Article.aggregate([{
                $sort: {
                    pageviews: -1
                }
            },
            {
                $limit: 5
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    cover: 1,
                    pageviews: 1
                }
            }
        ]);
        res.sendResult(result, 200, '获取成功')
    } catch {
        res.sendResult(null, 400, '获取失败')
    }
})
router.get('/:id', async (req, res) => {
    let {
        id
    } = req.params;
    let article = null;
    try {
        await Article.updateOne({
            _id: id
        }, {
            "$inc": {
                pageviews: 1
            }
        })
        article = await Article.aggregate([{
                $match: {
                    _id: new mongoose.Types.ObjectId(id)
                }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: 'cgid',
                    as: 'cgInfo'
                }
            },
            {
                $unwind: {
                    path: '$cgInfo'
                }
            },

        ]);
        res.sendResult(article[0], 200, '获取成功')

    } catch {
        res.sendResult(null, 400, '未找到该文章')
    }
})
router.get('/', async (req, res) => {
    let {
        pagenum,
        pagesize,
        category,
        public,
        query,
        original,
        cgid
    } = req.query;

    if (!pagesize || !pagenum) return res.sendResult([], 400, '缺少必须参数')
    cgid = cgid && parseInt(cgid)
    pagenum = parseInt(pagenum)
    pagesize = parseInt(pagesize)
    let articles = null;
    let count = {}
    //匹配复杂查询条件
    let match = {}

    if (cgid) {
        match.$match = {
            category: cgid
        }
        count = {
            category: cgid
        }
    } else {
        match = {
            $match: {}
        };
        count = {}
    }
    if (query) {
        match.$match.title = new RegExp(query)
        count.title = new RegExp(query)
    }
    if (category) {
        match.$match.category = parseInt(category)
        count.category = parseInt(category)
    }
    if (public) {
        match.$match.public = parseInt(public)
        count.public = parseInt(public)
    }
    if (original) {
        match.$match.original = parseInt(original)
        count.original = parseInt(original)
    }
    let total = await Article.find(count).countDocuments()
    if (pagesize <= 0 || (pagenum > Math.ceil(total / pagesize) && total != 0) || pagenum <= 0) return res.sendResult([], 400, '参数非法')
    articles = await Article.aggregate([{
            ...match
        },
        {
            $lookup: {
                from: 'categories',
                localField: 'category',
                foreignField: "cgid",
                as: "cgInfo"
            }
        },
        {
            $lookup: {
                from: 'comments',
                localField: '_id',
                foreignField: 'aid',
                as: 'comments'
            }
        },
        {
            $unwind: {
                path: "$cgInfo",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
                _id: 1,
                content: 1,
                pageviews: 1,
                cover: 1,
                title: 1,
                publishDate: 1,
                commentCount: {
                    $size: '$comments'
                },
                cgname: "$cgInfo.cgname",
                cgid: "$cgInfo.cgid",
                cgcover: "$cgInfo.cover",
                public: 1,
                original: 1,
                openCmt: 1
            }
        },
        {
            $sort: {
                publishDate: -1
            }
        },
        {
            $skip: (pagenum - 1) * pagesize
        },
        {
            $limit: pagesize
        }
    ])
    for (let i = 0; i < articles.length; i++) {
        articles[i].content = delHtmlTag(articles[i].content);
    }
    let res_json = {
        articles: articles,
        totalpage: Math.ceil(total / pagesize),
        total: total,
        pagenum: pagenum
    }
    res.sendResult(res_json, 200, '获取成功')

})
router.post('/', require('../verfyToken.js'), async (req, res) => {
    let form = req.body;
    try {
        if (!form.publishDate) form.publishDate = new Date()
        if (!form.cover) {
            let {
                Category
            } = require('../../models/category')
            let category = await Category.findOne({
                cgid: form.category
            })
            form.cover = category.cover
        }
        let result = await Article.create(form)
        res.sendResult(null, 200, '发布成功')
    } catch (error) {
        res.sendResult(error, 400, '发布失败' + error)
    }
})
router.delete('/:id', require('../verfyToken.js'), async (req, res) => {
    let id = req.params.id;
    await Article.deleteOne({
        _id: id
    })
    res.sendResult(null, 200, '删除成功')
})
router.put('/:id', require('../verfyToken.js'), async (req, res) => {
    let id = req.params.id
    let form = req.body
    await Article.updateOne({
        _id: id
    }, form)
    res.sendResult(null, 200, '修改成功')
})
module.exports = router