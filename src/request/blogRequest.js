import axios from "axios";

export const blogBaseURL = 'https://mynote-apa.pages.dev';

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
    const {data} = await blogAxios.get(`/${parent}/${sub}`);
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