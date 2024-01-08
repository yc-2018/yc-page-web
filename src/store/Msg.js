import { makeAutoObservable } from 'mobx'

class Msg {
    msg

    constructor() { //构造函数
        makeAutoObservable(this)  //自动化数据管理
    }

    setMsg(msg) {
        this.msg = msg
    }
}

export default new Msg();                   // 导出实例

