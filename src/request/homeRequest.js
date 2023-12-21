import axios from 'axios';
import {message} from 'antd'
import UserStore from '../store/UserStore';
import CommonStore from "../store/CommonStore";
import myAxios  from "./myAxios";

/**
 * 获取首页背景图（搞多几个做备份）
 * @returns {Promise<null|string>} 随机壁纸URL
 */
export async function reImagesUrl(bzType="风景") {
    CommonStore.setLoading(true);
    try {
        async function jfApi() {
            const { data: [image] } = await axios.get('/jfApi/home/bg/ajaxbg');
            CommonStore.setLoading(false,"获取风景/科技壁纸成功,正在加载...");
            return 'https://i0.wp.com/www.jianfast.com' + image.replace('/400', '');
        }

        async function bz1Api() {
            // https://api.btstu.cn/sjbz/api.php?lx=dongman&format=json
            const {data:{imgurl}} = await axios.get('/bz1Api/sjbz/api.php?format=json');
            CommonStore.setLoading(false,"获取随机壁纸成功,正在缓慢加载中...");
            return imgurl;
        }

        async function bz2Api() {
            // 如诗 - API接口文档 https://api.likepoems.com/
            // https://api.likepoems.com/img/pc/?type=json
            const {data:{url}} = await axios.get('/bz2Api/img/pc/?type=json');
            CommonStore.setLoading(false,"获取动画壁纸成功,正在加载...");
            return url;
        }
        return bzType === "风景"? jfApi():               
               bzType === "动画"? bz2Api():            
               bzType === "随机"? bz1Api():jfApi();     

    } catch (error) {
         CommonStore.setLoading(false,"获取壁纸失败了",'error');
    }
}

// 登录
export async function login(loginCode,expireTime='bt') {
    try {
        const response = await axios.post(`/api/users/login?key=${loginCode}&expireTime=${expireTime}`);
        const {code,msg,data} = response.data;

        if (code === 1) {
            // 存储 JWT
            UserStore.setJwt(data);
            message.success("登录成功");
            return true;
        } else if (code === 0) {
            // 显示消息
            message.error(msg);
        }
        return false;
    } catch (error) {
        message.error('请求失败');
        console.error('请求失败:', error);
        return false;
    }
}

// 获取一个类型的待办列表
export async function getToDoItems(type=0, page=1,completed=0) {
    try {
        const response = await myAxios.get(`/toDoItems/${type}?page=${page}&completed=${completed}`);
        return response.data;
    } catch (error) {
        console.error('待办请求失败:', error);
        return {};
    }
}



// 保存或修改一个待办
export async function saveOrUpdateToDoItem(body,requestType='post') {
    try {
        const response = await myAxios({url: '/toDoItems',method: requestType, data : body});
        if (response.data.code === 1) {
            message.success("成功");
            return true;
        }
    } catch (error) {console.error('待办请求失败:', error)}
}

// 删除一个待办
export async function delToDoItem(id) {
    try {
        const response = await myAxios.delete(`/toDoItems/${id}`);
        if (response.data.code === 1) {
            message.success("删除成功");
            return true;
        }
    } catch (error) {console.error('待办请求失败:', error)}
}

/** 上传壁纸到云端 */
export async function uploadInfo(Info) {
    CommonStore.setLoading(true,"开始上传");
    try {
        const {data:{data}} = await myAxios({url: `/pageParameters`,method: 'put', data : Info});

        data._code || CommonStore.setLoading(false,"上传成功",'success');
    } catch (error) {CommonStore.setLoading(false);}
}