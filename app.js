const express = require('express');
const app = express();
const home = require('./route/home.js'); //获取主页路由
const admin = require('./route/admin.js'); //获取管理页路由
const path = require('path');
const bodyParser = require('body-parser'); //post get请求处理
const session = require('express-session');
const ueditor = require('ueditor');
var https = require('https');
var fs = require('fs');
 
const HTTPS_OPTOIN = {
  key: fs.readFileSync('./cert/a.key'),
  cert:fs.readFileSync('./cert/a.pem')
};
const SSL_PORT = 443;
const httpsServer = https.createServer(HTTPS_OPTOIN, app);
httpsServer.listen(SSL_PORT, () => {
  console.log(`HTTPS Server is running on: https://localhost:${SSL_PORT}`);
});

const dateFormat = require('dateformat');
const template = require('art-template');
const morgan = require('morgan');
template.defaults.imports.dateFormat = dateFormat; //将dateFormat 导入到模板引擎中

require('./models/connect.js'); //数据库连接
require('./models/user.js');
const {Setting} = require('./models/setting');


app.set('views', path.join(__dirname, 'views')); //设置模板默认位置
app.set('view engine', 'art'); //设置模板默认后缀
app.engine('art', require('express-art-template')); //设置art模板的使用引擎

// app.use('/',(req,res,next)=>{  //http重定向到HTTps
//     let url=req.url;
//     if(req.hostname=='ojwxh.xyz')return res.redirect('https://www.ojwxh.xyz');
//     if(req.protocol=='http')return res.redirect('https://www.ojwxh.xyz'+url.replace('http','https'));
//     next();
// })

app.use(bodyParser.json()); //拦截post  解析req.body 
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'secrectkey'
})); //配置session


if (process.env.NODE_ENV == 'development') {
    console.log('当前处于开发环境');
    // app.use(morgan('dev'));
} else
    console.log('当前处于生产环境');

app.use(express.static(path.join(__dirname, 'public'))); //静态资源
app.use(async (req, res, next) => {  //读取网站基本信息，存入全局变量
    if(!app.locals.setting)
    {
        let setting = await Setting.findOne({
            _id: '5e919ab750bf8d3ca435721d'
        });
        setting.favicon = setting.favicon.replace(/\\/g, "/");
        setting.bg = setting.bg.replace(/\\/g, "/");
        setting.runTime = parseInt((new Date() - setting.startDate) / (1000 * 60 * 60 * 24));
        app.locals.setting = setting;
    }
    next();
})
app.use('/', home);
app.use('/admin', require('./middleware/loginGuard')); //登录拦截重定向
app.use("/ueditor/getImg", ueditor(path.join(__dirname, 'public'), require('./middleware/ueditor'))); //上传

app.use('/home', home);
app.use('/admin', admin);
app.listen(80);
console.log('服务器已启动');