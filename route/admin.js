const express = require('express');
const admin = express.Router();
const multipart=require('connect-multiparty'); //处理二进制表单数据
admin.get('/login', require('./admin/loginPage')); //登录页面请求
admin.post('/login',require('./admin/login'));  //登录表单处理
admin.get('/user', require('./admin/userPage')); //管理主页
admin.get('/logout',require('./admin/logout')); //退出账号处理
admin.get('/user-edit',require('./admin/user-edit')); //用户管理
admin.post('/user-add',require('./admin/user-add-fn')); //用户添加
admin.post('/user-edit',require('./admin/user-edit-fn'));  //用户编辑
admin.get('/user-delete',require('./admin/user-delete-fn')); //用户删除
admin.get('/article',require('./admin/article')); //文章管理首页
admin.get('/article-edit',require('./admin/article-edit'));//文章编辑页
admin.post('/article-add',multipart({uploadDir: './public/upload/covers'}),require('./admin/article-add-fn'));//文章添加
admin.get('/article-delete',require('./admin/article-delete-fn'));//文章删除
admin.post('/article-edit',multipart({uploadDir: './public/upload/covers'}),require('./admin/article-edit-fn'));//文章编辑表单提交
admin.get('/category',require('./admin/category'));//分类管理页
admin.post('/category-edit',multipart({uploadDir: './public/upload/covers'}),require('./admin/category-edit'));//分类编辑表单
admin.get('/category-delete',require('./admin/category-delete'));//分类删除表单
admin.post('/category-add',multipart({uploadDir: './public/upload/covers'}),require('./admin/category-add'));//分类添加表单
admin.get('/comment',require('./admin/comment'));//评论列表
admin.get('/comment-reply',require('./admin/comment-reply'));//评论添加表单
admin.get('/comment-delete',require('./admin/comment-delete'));//评论删除表单
admin.get('/comment-approval',require('./admin/comment-approval'));//评论审批
admin.get('/message',require('./admin/message'));//留言板
admin.get('/message-reply',require('./admin/message-reply'));//留言板回复
admin.get('/message-delete',require('./admin/message-delete'));//留言板删除
admin.get('/setting',require('./admin/setting'));//设置
admin.post('/setting',multipart({uploadDir: './public/upload/setting'}),require('./admin/setting-mod'));//留言板

module.exports = admin;