// myAxios.js
import axios from 'axios';
import {message} from 'antd'

const myAxios = axios.create({
    timeout: 10000 // 设置超时时间为 10000 毫秒（10秒）
});

/** 添加myAxios《请求》拦截器 */
myAxios.interceptors.request.use(
    config => {
        // 在发送请求之前做些什么
        const token = localStorage.getItem('jwt'); // 从存储中获取 JWT
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; // 如果存在 JWT，则添加到请求头
        }
        return config; // 返回配置，这样请求就会带上这些设置
    },
    error => {
        // 请求错误时做些什么
        return Promise.reject(error); // 如果出错，返回错误
    }
);


/** 添加myAxios《响应》拦截器 */
myAxios.interceptors.response.use(
    response => {
        // 如果响应正常，直接返回响应
        return response;
    },
    error => {
        // 检查 JWT 验证失败或过期
        if (error.response && error.response.status === 401) {
            // JWT 验证失败或过期的处理
            message.error('未登录或登录已过期，请重新登录。');
            window.location.href = '/'; // 跳转到主页
        } else if (error.response && error.response.status > 400) {
            // 处理其他错误响应码
            message.error(`错误：${error.response.status} - ${error.response.data.message}`);
        } else if (error.message && error.message.includes('timeout')) {
            // 超时错误
            message.error('请求超时，请检查网络连接或稍后重试');
        } else {
            // 网络错误或其他错误
            message.error('网络错误，请检查您的网络连接');
        }

        // 继续传递错误，以便可以进行其他处理
        return Promise.reject(error);
    }
);

export default myAxios;