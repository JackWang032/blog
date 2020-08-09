const express = require('express');
const app = express();
const home = require('./route/home.js'); //获取主页路由
const api = require('./route/api.js');
const path = require('path');
const bodyParser = require('body-parser'); //post get请求处理
const https = require('https');
const fs = require('fs');
const multer = require('multer') //图片上传处理
const OSS = require('ali-oss')

let client = new OSS({
	region: 'oss-cn-hangzhou',//阿里云对象存储地域名
	accessKeyId: 'LTAI4GEXnFde1afPXp4fZ9jJ',//api接口id
  accessKeySecret: 'opPgMk3XmLNuCuQ71xtyCehCmQtYu7',//api接口密码
  bucket: 'bucket-blogimg'
})

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

require('./models/connect.js'); //数据库连接

var storage = multer.diskStorage({
  //文件存放位置
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'public/upload/ali_imgs_temp'));
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})

var upload = multer({
  storage: storage
});

async function put(filename) {
	try {
    let filepath=path.join(__dirname,'./public/upload/ali_imgs_temp/'+filename)
		let result = await client.put('imgs/' + filename,filepath)
    let url='https://yun.ojwxh.xyz/'+result.name
    //上传后删除临时文件
    fs.unlink(filepath, function(err){
      if (err) throw err;
    }) 
    return url;
	} catch (err) {
    return 0
	}
}

app.use("/upload/img", upload.single('img'), async function (req, res) {
  var file = req.file;
  // 设置返回结果
  var result = {};
  if (!file) {
    result.code = 1;
    result.errMsg = '上传失败';
  } else {
    let url=await put(file.filename)
    result.code = 0;
    result.data = {
      url:url
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