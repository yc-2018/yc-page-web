import axios from 'axios';
import {message} from 'antd'
import UserStore from '../store/UserStore';
import myAxios  from "./myAxios";

/**
 * 获取首页背景图（搞多几个做备份）
 * @returns {Promise<null|string>} 随机壁纸URL
 */
export async function reImagesUrl(bzType="风景") {
    try {
        async function jfApi() {
            const response = await axios.get('/jfApi/home/bg/ajaxbg');
            const images = response.data;
            if (images.length > 0)
                return 'https://i0.wp.com/www.jianfast.com' + images[0].replace('/400', '');
        }

        async function bz1Api() {
            // https://api.btstu.cn/sjbz/api.php?lx=dongman&format=json
            const response = await axios.get('/bz1Api/sjbz/api.php?format=json');
            return response.data.imgurl;
        }

        async function bz2Api() {
            // 如诗 - API接口文档 https://api.likepoems.com/
            // https://api.likepoems.com/img/pc/?type=json
            const response = await axios.get('/bz2Api/img/pc/?type=json');
            return response.data.url;
        }
        return bzType === "风景"? jfApi():               
               bzType === "动画"? bz2Api():            
               bzType === "随机"? bz1Api():jfApi();     

    } catch (error) {
        return null;
    }
}

// 登录
export async function login(loginCode) {
    try {
        const response = await axios.post(`/api/users/login?key=${loginCode}`);
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
export async function getToDoItems(type=0, page=1,pageSize=10) {
    try {
        const response = await myAxios.get(`/toDoItems/${type}?page=${page}&pageSize=${pageSize}`);
        return response.data.data;
    } catch (error) {
        message.error('请求失败');
        console.error('待办请求失败:', error);
        return [];
    }
}
