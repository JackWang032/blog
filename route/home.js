const express = require('express');
const home = express.Router();
home.get('/', require('./home/homepage'));
home.get('/article',require('./home/article'));
home.post('/article/comment',require('./home/comment'));
home.get('/article/category',require('./home/category'));
home.get('/message',require('./home/message'));
home.post('/message',require('./home/message-add'));
home.get('/about',require('./home/about'));
home.get('/api/article/:page',require('./api/article.js'))
module.exports = home;