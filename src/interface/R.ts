/**通用返回结果，服务端响应的数据最终都会封装成此对象Result*/
export interface R<T> {
  code?: number             // 编码：1成功，0和其它数字为失败
  msg?: string              // 错误信息
  data?: T                  // 数据
  map?: {[x:string]: any}   // 动态数据
}