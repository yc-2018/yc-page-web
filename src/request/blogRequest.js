import axios from "axios";


const blogAxios = axios.create({
    baseURL: '/md', // 设置基础 URL
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