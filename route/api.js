const express = require('express');
const router = express.Router();
router.use('/articles',require('./api/articles'))
router.use('/categories',require('./api/categories'))
router.use('/comments',require('./api/comments'))
router.use('/bloginfo',require('./api/bloginfo'))
router.use('/group',require('./api/group'))
router.use('/message',require('./api/message'))
router.use('/setting',require('./api/setting'))
module.exports=router