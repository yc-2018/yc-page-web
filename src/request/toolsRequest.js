import axios from "axios";

export const toolsBaseURL = 'https://tools.245556.xyz';

const blogAxios = axios.create({
    baseURL: toolsBaseURL, // 设置基础 URL
    timeout: 10000 // 设置超时时间为 10000 毫秒（10秒）
});

/** 获取常用工具列表json */
export async function getToolsList() {
    const {data} = await blogAxios.get('/ikun.json');
    return data;
}
