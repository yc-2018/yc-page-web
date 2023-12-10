import { makeAutoObservable } from 'mobx'

class UserStore {
    // jwt
    jwt = localStorage.getItem('jwt')

  
    //构造函数
    constructor() {
      makeAutoObservable(this)  //自动化数据管理
    }
  
  
    //设置jwt
    setJwt(jwt) {
      localStorage.setItem('jwt', jwt)
      this.jwt = jwt
    }

    // 清除jwt
    clearJwt() {
      localStorage.removeItem('jwt')
      this.jwt = null
    }
  
  }
  
  export default new UserStore()