import service from '../service'

/**
 * IO文件处理
 * */
export function ioc_file_list (param) {
  return service.post('/ioc/fileControl/list',param)
}
export function ioc_file_load (param) {
  return service.post('/ioc/fileControl/load',param)
}
export function ioc_file_pre_save (param) {
  return service.post('/ioc/fileControl/pre_save',param)
}
export function ioc_file_overwrite (param) {
  return service.post('/ioc/fileControl/overwrite',param)
}
