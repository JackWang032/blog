const express = require('express');
const app = express();
const home = require('./route/home.js'); //获取主页路由
const api = require('./route/api.js');
const path = require('path');
const bodyParser = require('body-parser'); //post get请求处理
var https = require('https');
var fs = require('fs');
const multer = require('multer') //图片上传处理

const HTTPS_OPTOIN = {
  key: fs.readFileSync('./cert/a.key'),
  cert:fs.readFileSync('./cert/a.pem')
};
const SSL_PORT = 443;
const httpsServer = https.createServer(HTTPS_OPTOIN, app);
httpsServer.listen(SSL_PORT, () => {
  console.log(`HTTPS Server is running on: https://localhost:${SSL_PORT}`);
});


app.use((req,res,next)=>{
  if(req.protocol=='http'&&process.env.NODE_ENV =='production')return res.redirect('https://'+req.host+req.url)
  next()
})

require('./models/connect.js'); //数据库连接
var storage_img = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'public/upload/imgs'));
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})
var storage_cover = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'public/upload/covers'));
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})
var upload_img = multer({
  storage: storage_img
});
var upload_cover = multer({
  storage: storage_cover
});
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  if (req.method == 'OPTIONS') {
    res.send(200);
  } else {
    next();
  }
});
app.use("/upload/img", upload_img.single('img'), function (req, res) {
  var file = req.file;
  // 设置返回结果
  var result = {};
  let path = '/upload/imgs/' + file.filename
  if (!file) {
    result.code = 1;
    result.errMsg = '上传失败';
  } else {
    result.code = 0;
    result.data = {
      url: path
    }
    result.errMsg = '上传成功';
  }
  res.json(result);
});
app.use("/upload/cover", upload_cover.single('cover'), function (req, res) {
  var file = req.file;
  // 设置返回结果
  var result = {};
  let path = '/upload/covers/' + file.filename
  if (!file) {
    result.code = 1;
    result.errMsg = '上传失败';
  } else {
    result.code = 0;
    result.data = {
      url: path
    }
    result.errMsg = '上传成功';
  }
  res.json(result);
});


app.use(bodyParser.json()); //拦截post  解析req.body 
app.use(bodyParser.urlencoded({
  extended: true
}));

var resextra = require('./middleware/resextra.js');
app.use(resextra)

if (process.env.NODE_ENV == 'development') {
  console.log('当前处于开发环境');
} else
  console.log('当前处于生产环境');

app.use('/', home);

app.use(express.static(path.join(__dirname, 'public'))); //静态资源
app.use(express.static(path.join(__dirname, 'admin_dist'))); //后台管理资源

app.use('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, './admin_dist/index.html'))
});
app.use('/api', api);

//404page
app.use('/',(req, res) => {
  res.sendFile(path.join(__dirname, './public/not_found/index.html'))
})
app.listen(80);
console.log('服务器已启动');
console.log('地址:http://localhost:80');