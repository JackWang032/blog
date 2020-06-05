const express = require('express');
const home = express.Router();
const path = require('path')
home.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/home/index.html'))
});
home.get('/article', (req, res) => {
    let aid = req.query.aid;
    if (aid)
        res.sendFile(path.join(__dirname, '../views/home/article-detail.html'))
    else
        res.sendFile(path.join(__dirname, '../views/home/article-list.html'))
});
home.get('/category', (req, res) => {
    let cgid = req.query.cgid;
    if (!cgid) res.status(403).send('分类参数错误')
    else res.sendFile(path.join(__dirname, '../views/home/category.html'))
})
home.get('/message', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/home/message.html'))
});
home.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/home/about.html'))
});
module.exports = home;