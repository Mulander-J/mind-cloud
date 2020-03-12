var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('./../../dist/index.html')
});
/* GET api page. */
router.get('/api', function(req, res, next) {
  res.render(
    'api.ejs',
    {
      title: 'API',
      data:[
        {
          name:'用户管理',
          url:'/ioc/userDB',
          children:[
            {name:'列表',url:'/ioc/userDB/list',type:'GET',param:'{}'},
            {name:'登陆',url:'/ioc/userDB/login',type:'POST',param:'{username:String,password:String}'},
            {name:'注册',url:'/ioc/userDB/register',type:'POST',param:'{username:String,password:String}'}
          ]
        },
        {
          name:'文件IO',
          url:'/ioc/fileControl',
          children:[
            {name:'列表',url:'/ioc/fileControl/list',type:'POST',param:'{userPath:String}'},
            {name:'加载',url:'/ioc/fileControl/load',type:'POST',param:'{readPath:String}'},
            {name:'预保存',url:'/ioc/fileControl/pre_save',type:'POST',param:'{type:String,userId:String,fileModel:{name:String,content:String}}'},
            {name:'覆盖',url:'/ioc/fileControl/overwrite',type:'POST',param:'{type:String,userId:String,fileModel:{name:String,content:String}}'},
          ]
        }
      ]
    }
  );
});

//  引入mongoose工具
var mongoose = require('mongoose');
var db = mongoose.connection;

//  监听是否有异常
db.on('error', function callback() {console.log("**** Connection error")});
//  连接成功
db.on("connected",function () {console.log('**** 数据库表[IOC_DB]连接成功')});
//  连接数据库
// mongoose.connect('mongodb://数据库登录用户名:数据库登录密码@数据库连接地址')
mongoose.connect('mongodb://数据库登录用户名:数据库登录密码@数据库连接地址', { useNewUrlParser: true });

module.exports = router;
