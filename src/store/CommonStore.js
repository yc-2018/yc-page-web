import { makeAutoObservable } from 'mobx'
import Msg from "./Msg";

class CommonStore {
    // 壁纸加载都用这个
    loading = false


    //构造函数
    constructor() {
        makeAutoObservable(this)  //自动化数据管理
    }


    //设置jwt
    setLoading(statuses, msg=null, type="info") {
        this.loading = statuses
        if (msg) return  type==="success"? Msg.msg.success(msg): type==="error"?Msg.msg.error(msg): Msg.msg.info(msg)
    }



}

export default new CommonStore()