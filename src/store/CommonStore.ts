import { makeAutoObservable } from 'mobx'
import {MessageInstance} from "antd/es/message/interface";

class CommonStore {
    loading = false // 壁纸加载都用这个
    msg: MessageInstance     // 消息提示

    //构造函数
    constructor() {
        makeAutoObservable(this)  //自动化数据管理
    }


    //设置网络加载状态（转圈圈） 和 消息提示  全屏用
    setLoading(statuses, msg=null, type="info") {
        this.loading = statuses
        if (msg) return type === "success" ? this.msg.success(msg) : type === "error" ? this.msg.error(msg) : this.msg.info(msg)
    }

    setMsg(msg) {this.msg = msg}
}

export default new CommonStore()