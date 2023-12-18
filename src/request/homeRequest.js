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
        return response.data.data;
    } catch (error) {
        console.error('待办请求失败:', error);
        return [];
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