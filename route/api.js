const express = require('express');
const router = express.Router();
router.use('/articles',require('./api/articles'))
router.use('/categories',require('./api/categories'))
router.use('/comments',require('./api/comments'))
router.use('/bloginfo',require('./api/bloginfo'))
router.use('/archive',require('./api/archive'))
router.use('/messages',require('./api/messages'))
router.use('/setting',require('./api/setting'))
router.use('/qqapi',require('./api/qqapi'))
router.use('/login',require('./api/login'))
router.use('/users',require('./api/users'))
router.use('/reports',require('./api/reports'))
router.use('/laboratory',require('./api/laboratory'))
module.exports=router