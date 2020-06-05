const {Article} = require('../../models/article');
const mongoose=require('mongoose')
const express = require('express');
const router = express.Router();
function delHtmlTag(str) {
    str = str.replace(/<[^>]+>/g, "");
    str = str.replace(/&nbsp;/ig, "");
    return str;
}
router.get('/hot',async(req,res)=>{
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
router.get('/:id',async(req,res)=>{
    let {pagenum,pagesize}=req.query;
    let {id}=req.params;
    let article=null;
     try{
        await Article.updateOne({_id:id},{
            "$inc":{pageviews:1}
        })
        article=await Article.aggregate([
            {$match:{
                _id:new mongoose.Types.ObjectId(id)
            }},
            {
            $lookup:{
                from:'categories',
                localField:'category',
                foreignField:'cgid',
                as:'cgInfo'
            }},
            {$unwind:{path:'$cgInfo'}},

        ]);
        res.sendResult(article[0],200,'获取成功')
     }
      catch{
          res.sendResult(null,400,'未找到该文章')
      }
})
router.get('/',async(req,res)=>{
    let {
        pagenum,
        pagesize,
        cgid
    } = req.query;
    if (!pagesize || !pagenum) return res.sendResult([], 400, '参数错误')
    cgid = cgid && parseInt(cgid)
    pagenum = parseInt(pagenum)
    pagesize = parseInt(pagesize)
    let articles = null;
    let count = {}
    let match = {}
    if (cgid!=undefined) {
        match = {
            $match: {
                category: cgid
            }
        };
        count = {
            category: cgid
        }
    } else {
        match = {
            $match: {}
        };
        count = {}

    }
    let total = await Article.find({...count}).countDocuments()
    if (pagesize <= 0 || (pagenum > Math.ceil(total / pagesize)&&total!=0) || pagenum <= 0) return res.sendResult([], 400, '参数非法')
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
                cgname: "$cgInfo.cgname",
                cgid: "$cgInfo.cgid"
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
        pagenum: pagenum
    }
    res.sendResult(res_json, 200, '获取成功')
})


module.exports = router