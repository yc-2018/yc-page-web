import { makeAutoObservable } from 'mobx'
import {message} from 'antd'

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
        if (msg) return  type==="success"? message.success(msg): type==="error"?message.error(msg): message.info(msg)
    }



}

export default new CommonStore()