const express = require('express');
const {Setting}=require('../models/setting')
const home = express.Router();
const path = require('path')
home.get('/', async(req, res) => {
    await Setting.updateOne({},{ //访问量加一
        "$inc":{visitors:1}
    });
    res.sendFile(path.join(__dirname, '../views/entry.html'))
});
home.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/index.html'))
});
home.get('/article', (req, res) => {
    let aid = req.query.aid;
    if (aid)
        res.sendFile(path.join(__dirname, '../views/article-detail.html'))
    else
        res.sendFile(path.join(__dirname, '../views/article-list.html'))
});
home.get('/category', (req, res) => {
    let cgid = req.query.cgid;
    if (!cgid) res.status(403).send('分类参数错误')
    else res.sendFile(path.join(__dirname, '../views/category.html'))
})
home.get('/archive', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/archive.html'))
});
home.get('/laboratory', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/laboratory.html'))
});
home.get('/message', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/message.html'))
});
home.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/about.html'))
}); 

module.exports = home;