import { makeAutoObservable } from 'mobx'
import JWTUtils from "../utils/JWTUtils";

class UserStore {
    // jwt
    _jwt = localStorage.getItem('jwt')
    openModal = false // 用户登录弹窗

    //构造函数
    constructor() {makeAutoObservable(this)  /*自动化数据管理*/}

    //设置jwt
    set jwt(jwt) {
        localStorage.setItem('jwt', jwt)
        this._jwt = jwt
    }
    get jwt() {
        return this._jwt;
    }

    setOpenModal(openModal) {
      this.openModal = openModal
    }

    // 清除jwt
    clearJwt() {
      localStorage.removeItem('jwt')
      this._jwt = null
    }


  
  }
  
  export default new UserStore()