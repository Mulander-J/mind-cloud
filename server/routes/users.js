var express = require('express');
var router = express.Router();
//引入实体类
var Users = require('./../model/users');
//  加密解密模块
var crypto = require('crypto');  //加载crypto库
const secret='pass';  //密钥
/**
 * @description 加密
 * @param str
 * @returns {*}
 */
const codeEnc = (str)=>{
  let cipher = crypto.createCipher('aes192', secret);
  let enc = cipher.update(str, 'utf8', 'hex');//编码方式从utf-8转为hex;
  enc += cipher.final('hex');//编码方式从转为hex;
  return enc
};
/**
 * @description 解密
 * @param enc_str
 * @returns {*}
 */
const codeDec = (enc_str)=>{
  var decipher = crypto.createDecipher('aes192', secret);
  var dec = decipher.update(enc_str, 'hex', 'utf8');//编码方式从hex转为utf-8;
  dec += decipher.final('utf8');//编码方式从utf-8;
  return dec
};

/* GET users list. */
router.get('/', function (req, res, next) {
  res.json({
    status:0,
    msg:'接口[userDB]请求正常'
  });
});
/* GET users list. */
router.get('/list', function (req, res, next) {
  // var u = queryString.parse(url.parse(req.url).query).u;
  Users.find({}, function (err, doc) {
    if (err) {
      res.json({
        status: 1,
        msg: err.message || '系统异常',
      });
    } else {
      res.json({
        status: 0,
        msg: "success",
        count: doc.length,
        list: doc
      });
    }
  })
});
/* user login */
router.post('/login', function (req, res, next) {
  Users.findOne({
    username: req.param('username')
  }, function (err, doc) {
    if (!!doc) {
      let db_pwd = codeEnc(req.param('password'));
      if (doc.password === db_pwd) {
        res.json({
          status: 0,
          msg: "登陆成功,自动跳转",
          userInfo: doc
        });
      } else {
        res.json({
          status: 1,
          msg: "密码输入错误！"
        });
      }
    } else {
      res.json({
        status: 1,
        msg: "该用户不存在！"
      });
    }
  });
});
/* user register */
router.post('/register', function (req, res, next) {
  let regUser = new Users({
    "username": req.param('username'),
    "password": codeEnc(req.param('password'))
  });
  regUser.save(function (err, doc) {
    if (err) {
      res.json({
        status: err.code||1,
        msg: err.message || '系统异常',
      });
    } else {
      res.json({
        status: 0,
        msg: '注册成功,自动跳转',
        userInfo:doc
      });
    }
  })
});

module.exports = router;
