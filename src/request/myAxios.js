// myAxios.js
import axios from 'axios';
import CommonStore from "../store/CommonStore";

import UserStore from '../store/UserStore';
import JWTUtils from "../utils/JWTUtils";

const myAxios = axios.create({
    baseURL: '/api/', // 设置基础 URL
    timeout: 10000 // 设置超时时间为 10000 毫秒（10秒）
});

/** 添加myAxios《请求》拦截器 */
myAxios.interceptors.request.use(
    config => {
        // 在发送请求之前做些什么
        const token = UserStore.jwt; // 从仓库中获取 JWT
        if (!JWTUtils.isExpired()) {
            config.headers.Authorization = `Bearer ${token}`; // 如果存在 JWT，则添加到请求头
            return config; // 返回配置，这样请求就会带上这些设置
        }
        CommonStore.msg.error('未登录或登录已过期，请重新登录。');
        UserStore.clearJwt();
        return Promise.reject(new Error('Token expired'));
    },
    error => {
        // 请求错误时做些什么
        return Promise.reject(error); // 如果出错，返回错误
    }
);


/** 添加myAxios《响应》拦截器 */
myAxios.interceptors.response.use(
    response => {
        if(response.data.code !== 1) CommonStore.msg.error(response.data.msg);
        // 如果响应正常，直接返回响应
        return response;
    },
    error => {
        let err;
        // 检查 JWT 验证失败或过期
        if (error.response && error.response.status === 401) {
            // JWT 验证失败或过期的处理
            err = '未登录或登录已过期，请重新登录。'
            window.location.href = '/'; // 跳转到主页
        } else if (error.response && error.response.status > 400) {
            // 处理其他错误响应码
            err = `错误：${error.response.status} - ${error.response.data.message}`
        } else if (error.message && error.message.includes('timeout')) {
            // 超时错误
            err = '请求超时，请检查网络连接或稍后重试'
        } else {
            // 网络错误或其他错误
            err = '网络错误，请检查您的网络连接'
        }
        CommonStore.msg.error(err);
        // 继续传递错误，以便可以进行其他处理
        return {code: 0, msg: error.message};
    }
);

export default myAxios;