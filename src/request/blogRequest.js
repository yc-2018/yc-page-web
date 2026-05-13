import axios from "axios";

// export const blogBaseURL = 'https://blog.245556.xyz';
export const blogBaseURL = 'https://bk.yc556.cn';

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
    if (isHtmlDocument(data)) return buildHtmlDocumentError(sub, parent);
    return data;
}

/** 判断远端是否返回了整页 HTML，而不是 Markdown 内容 */
function isHtmlDocument(content) {
    return /^\s*(<!doctype\s+html|<html[\s>])/i.test(content ?? '');
}

/** 生成整页 HTML 响应的博客提示内容 */
function buildHtmlDocumentError(sub, parent) {
    return `# 博客内容加载异常

远端返回了 HTML 页面，而不是 Markdown 内容。可能是文章文件不存在、路径不匹配，或者远端把请求重定向到了默认页面。

- 目录：${parent}
- 文章：${sub}
`;
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
