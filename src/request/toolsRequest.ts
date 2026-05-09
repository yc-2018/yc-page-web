import axios from 'axios';
import {compressImageToXMB} from '@/utils/compressImgUtils';

// export const toolsBaseURL = 'https://tools.245556.xyz';
export const toolsBaseURL = 'https://gj.yc556.cn';

const blogAxios = axios.create({
    baseURL: toolsBaseURL, // 设置基础 URL
    timeout: 10000 // 设置超时时间为 10000 毫秒（10秒）
});

const UPLOAD_IMAGE_MAX_MB = 15; // 上传图片最大体积(MB)

/** 获取常用工具列表json */
export async function getToolsList() {
    const {data} = await blogAxios.get('/ikun.json');
    return data;
}

/**
 * 上传图片到京东图床
 * return{"errno": 1,"message": "文件大小不能超过15MB","data": null}
 * return{"errno": 0,"message": "上传成功","data": {"url": "https://xx/x.png","fileName": "xxx.png"}}
 *
 * @author 𝓒𝓱𝓮𝓷𝓖𝓾𝓪𝓷𝓰𝓛𝓸𝓷𝓰
 * @since 2025/7/17 23:56
 */
export const uploadImgByJD = async (file: File) => {
  const data = new FormData();
  file = await compressImageToXMB(file, UPLOAD_IMAGE_MAX_MB, 'webp')
  if (file.size > UPLOAD_IMAGE_MAX_MB * 1024 * 1024) {
    return {
      success: false,
      message: `图片压缩后仍超过${UPLOAD_IMAGE_MAX_MB}MB，请换一张更小的图片`,
      data: null
    }
  }
  data.append('file', file, file.name);
  const u = [102, 115, 100, 122, 45, 117, 115, 101, 114, 46, 106, 100, 46, 99, 111, 109, 47, 97, 112, 105, 47, 118, 49, 47, 99, 111, 109, 109, 111, 110, 47, 117, 112, 108, 111, 97, 100]
  const result = await axios.post(`https://${u.map(v => String.fromCharCode(v)).join('')}`, data);
  // const result = await axios.post('https://api.xinyew.cn/api/jdtc', data);
  return result.data
};
