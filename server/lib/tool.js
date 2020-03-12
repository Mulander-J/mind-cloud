let fs = require('fs');
let path = require('path')
let tool = {};
/**
 * 读取路径信息
 * @param {string} path 路径
 */
tool.getStat = function (path){
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, stats) => {
      if(err){
        resolve(false);
      }else{
        resolve(stats);
      }
    })
  })
}

/**
 * 创建路径
 * @param {string} dir 路径
 */
tool.mkdir = function(dir){
  return new Promise((resolve, reject) => {
    fs.mkdir(dir, err => {
      if(err){
        resolve(false);
      }else{
        resolve(true);
      }
    })
  })
}

/**
 * 路径是否存在，不存在则创建
 * @param {string} dir 路径
 */
tool.dirExists = async function (dir) {
  let isExists = await tool.getStat(dir);
  //如果该路径且不是文件，返回true
  if (isExists && isExists.isDirectory()) {
    return true;
  } else if (isExists) {     //如果该路径存在但是文件，返回false
    return false;
  }
  //如果该路径不存在
  let tempDir = path.parse(dir).dir;      //拿到上级路径
  //递归判断，如果上级目录也不存在，则会代码会在此处继续循环执行，直到目录存在
  let status = await tool.dirExists(tempDir);
  let mkdirStatus;
  if (status) {
    mkdirStatus = await tool.mkdir(dir);
  }
  return mkdirStatus;
}

/**
 * 查找路径下所有文件名
 * @param {string} inPath 路径
 */
tool.findJsonFile = function(inPath){
  let filelist = [];
  let files = fs.readdirSync(inPath);
  files.forEach(function (item, index) {
    let fPath = path.join(inPath,item);
    let stat = fs.statSync(fPath);
    if(stat.isDirectory() === true) {
      filelist = filelist.concat(tool.findJsonFile(fPath));
    }
    if (stat.isFile() === true) {
      filelist.push(item);
    }
  });
  return filelist
};

module.exports = tool;
