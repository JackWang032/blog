const {
    Lab
} = require('../../models/laboratory')
const express = require('express');
const router = express.Router();
router.get('/:id', async (req, res) => {
    let id = req.params.id;
    try {
        let result = await Lab.findOne({
            _id: id
        })
        res.sendResult(result, 200, '获取成功')
    } catch {
        res.sendResult(null, 400, '未找到该id')
    }
})
router.get('/', async (req, res) => {
    let {
        pagenum,
        pagesize,
        query
    } = req.query
    if (!pagenum || !pagesize) return res.sendResult(null, 400, '缺少参数')
    pagenum = parseInt(pagenum)
    pagesize = parseInt(pagesize)
    let match = {
        $match: {}
    }
    if (query) match.$match.name =new RegExp(query)


    let lab = await Lab.aggregate([{
           ...match
        },
        {
            $sort: {
                time: -1
            }
        },
        {
            $skip: (pagenum - 1) * pagesize
        },
        {
            $limit: pagesize
        }

    ])
    let count = await Lab.countDocuments()
    let result = {
        projects: lab,
        total: count
    }
    res.sendResult(result, 200, '获取成功')

})
router.post('/', require('../verfyToken.js'), async (req, res) => {
    let form = req.body;
    await Lab.create(form)
    res.sendResult(null, 200, '创建成功')
})
router.delete('/:id', require('../verfyToken.js'), async (req, res) => {
    let id = req.params.id;
    await Lab.deleteOne({
        _id: id
    })
    res.sendResult(null, 200, '删除成功')

})
router.put('/:id', require('../verfyToken.js'), async (req, res) => {
    let id = req.params.id
    let form = req.body
    await Lab.updateOne({
        _id: id
    }, form)
    res.sendResult(null, 200, '修改成功')
})
module.exports = router