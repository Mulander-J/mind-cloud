var express = require('express');
var router = express.Router();

// //使用 url 模块
// var url = require("url");
// //使用query模块
// var queryString = require("querystring");

//  文件读写
const fs = require('fs');
const path = require('path')
const tool = require('./../lib/tool');
const cachePath =path.resolve(__dirname,'./../ioc_cache');

/* GET file Index */
router.get('/', function(req, res, next) {
  res.json({
    status:0,
    msg:'接口[file]请求正常'
  });
});
/* GET file list */
router.post('/list', function(req, res, next) {
  console.log('**** 开始任务[文件列表查询]');
  let userPath = req.param('userPath');
  if(userPath){
    fs.access(cachePath+userPath, fs.constants.F_OK, (err) => { //  检测文件是否存在
      if(err){
        console.log('**** 任务中止:暂无数据');
        res.json({
          status:1,
          msg:'暂无数据',
          list:[]
        });
        return
      }
      try{
        let jsonFiles = tool.findJsonFile(cachePath+userPath);
        console.log('**** 任务完成');
        res.json({
          status:0,
          msg:"success",
          list:jsonFiles
        });
      }catch (e) {
        console.log(`**** 任务失败:${(e.message||'查询异常')}`);
        res.json({
          status:1,
          msg:e.message||'查询异常',
          list:[]
        });
      }
    })
  }else {
    console.log('**** 任务失败:缺失文件路径');
  }
});
/* load file */
router.post('/load', function(req, res, next) {
  console.log('**** 开始任务[文件读取]');
  let readPath = req.param('readPath');
  if(readPath){
    fs.readFile(cachePath+readPath, (err, data) => {
      console.log(`**** 读取任务Over_status:${err?1:0}`);
      res.json({
        status:err?1:0,
        msg:err?(err.message||'读取失败'):'读取成功',
        content:JSON.parse(data)||null
      });
    });
  }else {
    console.log('**** 任务失败:缺失文件路径');
  }
});
/* pre save file */
router.post('/pre_save', function(req, res, next) {
  let type = req.param('type');
  let userId = req.param('userId');
  let fileModel = req.param('fileModel');

  let userPath = cachePath+`/${type}/${userId}`;
  let savePath = userPath+'/'+fileModel.name;

  let fn_pre_save = async function (){
    console.log(`**** 目标路径**${userPath}\n**** 开始探照目标路径`);
    await tool.dirExists(userPath);
    console.log('**** 探照完毕 Clear.\n**** 启动任务[文件写入]');
    fs.access(savePath, fs.constants.F_OK, (err) => { //  检测文件是否存在
      if(err){  //  不存在
        let fileJson = {
          "fileName": fileModel.name,
          "lastDate": new Date().toString(),
          "content": fileModel.content
        };
        fs.writeFile(savePath, JSON.stringify(fileJson,null,"\t"), err => {
          console.log(`**** 任务执行完毕_status:${err?1:0}`);
          res.json({
            status:err?1:0,
            msg:err?(err.message||'写入失败'):'写入成功'
          });
        })
      }else {
        console.log('**** 任务中断:文件已存在');
        res.json({
          status:10001,
          msg:fileModel.name+'  文件已存在,是否覆盖?'
        });
      }
    });
  };

  fn_pre_save();
});
/* overwrite file */
router.post('/overwrite', function(req, res, next) {
  let type = req.param('type');
  let userId = req.param('userId');
  let fileModel = req.param('fileModel');

  let userPath = cachePath+`/${type}/${userId}`;
  let savePath = userPath+'/'+fileModel.name;

  let fileJson = {
    "fileName": fileModel.name,
    "lastDate": new Date().toString(),
    "content": fileModel.content
  };

  fs.writeFile(savePath, JSON.stringify(fileJson,null,"\t"), err => {
    console.log(`**** 覆盖任务Over_status:${err?1:0}`);
    res.json({
      status:err?1:0,
      msg:err?(err.message||'写入失败'):'写入成功'
    });
  })
});

module.exports = router;
