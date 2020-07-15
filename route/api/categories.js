const {
  Category
} = require('../../models/category')
const {
  Article
} = require('../../models/article')
const express = require('express');
const router = express.Router();
//获取分类列表并排序
const handleCategory = async function () {
  let result = await Category.aggregate([{
    $lookup: {
      from: "articles",
      localField: "cgid",
      foreignField: "category",
      as: "children"
    }
  }]);
  for (var i = 0; i < result.length; i++) {
    result[i].count = result[i].children.length;
  }
  result.sort(function (a, b) {
    return b.count - a.count
  })
  return result
};
router.get('/list', async (req, res) => {
  let result = await Category.find().select('cgid cgname')
  res.sendResult(result, 200, '获取成功')
})
router.get('/:cgid', async (req, res) => {
  let cgid = req.params.cgid;
  try {
    let result = await Category.aggregate([
      {
        $match:{cgid:parseInt(cgid)}
      },
      {
        $lookup: {
          from: 'articles',
          localField: 'cgid',
          foreignField: 'category',
          as: 'articles'
        }
      },
      {
        $project: {
          cgid: '$cgid',
          cgname: '$cgname',
          cover: '$cover',
          intro: '$intro',
          count: {
            $size: '$articles'
          },
          createtime: '$createtime'
        }
      },
    ])
    res.sendResult(result[0], 200, '获取成功')
  } catch {
    res.sendResult(null, 400, '未找到该分类')
  }
})
router.get('/', async (req, res) => {
  let categories = null
  let {
    pagenum,
    pagesize,
    query
  } = req.query
  if (pagenum && pagesize) {
    pagenum = parseInt(pagenum)
    pagesize = parseInt(pagesize)
    let match = null
    if (query)
      match = {
        $match: {
          cgname: new RegExp(query)
        }
      }
    else match = {
      $match: {}
    }
    categories = await Category.aggregate([{
        ...match
      },
      {
        $lookup: {
          from: 'articles',
          localField: 'cgid',
          foreignField: 'category',
          as: 'articles'
        }
      },
      {
        $project: {
          cgid: '$cgid',
          cgname: '$cgname',
          cover: '$cover',
          intro: '$intro',
          count: {
            $size: '$articles'
          },
          createtime: '$createtime'
        }
      },
      {
        $sort: {
          count: -1
        }
      },
      {
        $skip: (pagenum - 1) * pagesize
      },
      {
        $limit: pagesize
      }

    ])
    let count = await Category.countDocuments()
    let result = {
      categories: categories,
      total: count
    }
    res.sendResult(result, 200, '获取成功')
  } else {
    categories = await handleCategory();
    res.sendResult(categories, 200, '获取成功')
  }
})
router.post('/', require('../verfyToken.js'), async (req, res) => {
  let form = req.body;
  let cgsorted = await Category.find().sort('-cgid').limit(1)
  let cgid = cgsorted[0].cgid + 1;
  form.cgid = cgid
  await Category.insertMany(form)
  res.sendResult(null, 200, '创建成功')
})
router.delete('/:id', require('../verfyToken.js'), async (req, res) => {
  let id = req.params.id;
  let other = await Category.findOne({
    'cgname': '其他'
  })
  if (id == other.cgid) {
    return res.sendResult(null, 400, '不能删除保留分类')
  } else {
    await Article.updateMany({
      category: id
    }, {
      category: other.cgid
    })
    await Category.deleteOne({
      cgid: id
    })
    res.sendResult(null, 200, '删除分类成功')
  }
})
router.put('/:id', require('../verfyToken.js'), async (req, res) => {
  let cgid = req.params.id
  let {
    cgname,
    cover,
    intro
  } = req.body
  if (cover)
    await Category.updateOne({
      cgid
    }, {
      cgname,
      cover,
      intro
    })
  else
    await Category.updateOne({
      cgid
    }, {
      cgname,
      intro
    })

  res.sendResult(null, 200, '修改分类成功')
})
module.exports = router