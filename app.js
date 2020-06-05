const express = require('express');
const app = express();
const home = require('./route/home.js'); //获取主页路由
const admin = require('./route/admin.js'); //获取管理页路由
const api=require('./route/api.js');
const path = require('path');
const bodyParser = require('body-parser'); //post get请求处理
const session = require('express-session');
const ueditor = require('ueditor');
var fs = require('fs');
 
require('./models/connect.js'); //数据库连接
require('./models/user.js');

// app.use('/',(req,res,next)=>{  //http重定向到HTTps
//     let url=req.url;
//     if(req.hostname=='ojwxh.xyz')return res.redirect('https://www.ojwxh.xyz');
//     if(req.protocol=='http')return res.redirect('https://www.ojwxh.xyz'+url.replace('http','https'));
//     next();
// })

app.use(bodyParser.json()); //拦截post  解析req.body 
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'secrectkey'
})); //配置session
var resextra=require('./middleware/resextra.js');
app.use(resextra)

if (process.env.NODE_ENV == 'development') {
    console.log('当前处于开发环境');
    // app.use(morgan('dev'));
} else
    console.log('当前处于生产环境');

app.use(express.static(path.join(__dirname, 'public'))); //静态资源
app.use('/', home);
app.use('/admin', require('./middleware/loginGuard')); //登录拦截重定向
app.use("/ueditor/getImg", ueditor(path.join(__dirname, 'public'), require('./middleware/ueditor'))); //上传

app.use('/home', home);
app.use('/admin', admin);
app.use('/api',api);
app.listen(80);
console.log('服务器已启动');