import service from '../service'

/**
 * 账户登录相关
 * */
export function login (param) {
  return service.post('/ioc/userDB/login',param)
}
export function register (param) {
  return service.post('/ioc/userDB/register',param)
}
