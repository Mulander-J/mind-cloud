import axios from 'axios'

//  设置API接口域名
//  外网暴露地址
const OutRoot = '***.***.***.***:****';
const base = '//'+(window.location.host||OutRoot);
axios.defaults.baseURL = base;

// 创建axios实例
const service = axios.create({
  baseURL: base, // api的base_url
  timeout: 7200000,  // 请求超时时间
  headers:{
    'Content-Type': 'application/json;charset=UTF-8'
  }
});

export default service
