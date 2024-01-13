import { makeAutoObservable } from 'mobx'

class CommonStore {
    loading = false // 壁纸加载都用这个
    msg                     // 消息提示

    //构造函数
    constructor() {
        makeAutoObservable(this)  //自动化数据管理
    }


    //设置jwt
    setLoading(statuses, msg=null, type="info") {
        this.loading = statuses
        if (msg) return type === "success" ? this.msg.success(msg) : type === "error" ? this.msg.error(msg) : this.msg.info(msg)
    }

    setMsg(msg) {this.msg = msg}
}

export default new CommonStore()