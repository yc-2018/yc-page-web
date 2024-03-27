import { makeAutoObservable } from 'mobx'

class UserStore {
    /** 私有jwt */
    _jwt = localStorage.getItem('jwt')
    /** 用户登录弹窗 */
    openModal = false
    /** 个人信息弹窗 */
    infoModal = false

    /** 构造函数 自动化数据管理就靠它*/
    constructor() {makeAutoObservable(this)}

    /** 设置jwt */
    set jwt(jwt) {
        localStorage.setItem('jwt', jwt)
        this._jwt = jwt
    }

    /** 获取jwt */
    get jwt() {return this._jwt}

    /** 设置登录弹窗 */
    setOpenModal(openModal) {this.openModal = openModal}
    /** 设置个人信息弹窗 */
    setInfoModal(infoModal) {this.infoModal = infoModal}

    /** 清除登录信息 */
    clearJwt() {
      localStorage.removeItem('jwt')
      localStorage.removeItem('backgroundImages'); // 尝试删除本地存储的背景URL
      this._jwt = null
    }

  
  }
  
  export default new UserStore()