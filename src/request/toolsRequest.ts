import axios from "axios";
import {compressImageTo5MB} from "@/utils/compressImgUtils";

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

/**
 * 上传图片到京东图床
 * return{"errno": 1,"message": "文件大小不能超过5MB","data": null}
 * return{"errno": 0,"message": "上传成功","data": {"url": "https://xx/x.png","fileName": "xxx.png"}}
 *
 * @author 𝓒𝓱𝓮𝓷𝓖𝓾𝓪𝓷𝓰𝓛𝓸𝓷𝓰
 * @since 2025/7/17 23:56
 */
export const uploadImgByJD = async (file: File) => {
  const data = new FormData();
  file = await compressImageTo5MB(file)
  data.append('file', file);
  const result = await axios.post('https://api.xinyew.cn/api/jdtc', data);
  return result.data
};