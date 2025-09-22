import axios from "axios";

export const blogBaseURL = 'https://blog.245556.xyz';
// export const blogBaseURL = 'https://b.yc556.cn';

const blogAxios = axios.create({
    baseURL: blogBaseURL, // 设置基础 URL
    timeout: 10000 // 设置超时时间为 10000 毫秒（10秒）
});

/** 获取博客列表json */
export async function getBlogList() {
    const {data} = await blogAxios.get('/mdList.json');
    return data;
}

/** 获取博客md */
export async function getBlogMd([sub, parent]) {
    const config = {
        // responseType: 'text',
        url: `/${parent}/${sub}?a=aa`,
        headers: {
            'Content-Type': 'text/markdown;charset=utf-8',
            'Accept': 'text/markdown;charset=utf-8',
            // 'Access-Control-Allow-Origin': '*',
            // 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            // 'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
        }
    };


    const {data} = await blogAxios(config);
    return data;
}

/**
 * 获取图标对应关系对象
 *
 * @author Yc
 * @since 2024/6/30 14:13
 */
export async function getBlogItemIconObj(){
    const {data} = await blogAxios.get('/icon/aaa.json');
    return data;
}