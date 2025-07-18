import axios from 'axios';
import fetchJsonp from "fetch-jsonp";
import CommonStore from "@/store/CommonStore";
import bingWallpaperList from "@/store/bingWallpaper";
import myAxios, {myDelete, myGet, myPost, myPut} from "./myAxios";
import IBookmark from "@/interface/IBookmark";


/** jsonp获取百度联想列表 */
export async function getThinkList(text: string) {
  if (!text) return;
  const result = await fetchJsonp(`https://www.baidu.com/sugrec?ie=utf-&prod=pc&from=pc_web&wd=${text}`)
  if (result.ok) return (await result.json()).g?.map((item: { q: string }) => ({value: item.q}))
}


/**
 * 获取首页背景图（搞多几个做备份）
 * @return 随机壁纸URL
 */
export async function reImagesUrl(bzType: 'bing' | '漫画' | '风景') {
  CommonStore.setLoading(true);
  try {
    CommonStore.setLoading(true);
    const bgUrl = getBgFns[bzType]()
    CommonStore.setLoading(false);
    return bgUrl
  } catch (error) {
    CommonStore.setLoading(false, "获取壁纸失败了", 'error')
  }
}

const getBgFns = {
  'bing': () => {
    CommonStore.setLoading(false);
    // 生成一个随机索引
    const randomIndex = Math.floor(Math.random() * bingWallpaperList.length);
    // 使用随机索引从列表中获取一项
    const bingWallpaperID = bingWallpaperList[randomIndex].replace('-', '_ZH-CN');
    return `https://www.bing.com/th?id=OHR.${bingWallpaperID}_1920x1080.jpg`;
  },
  '漫画': async () => {
    // https://api.aa1.cn/doc/wdd-tp.html
    const response = await axios.get('http://www.wudada.online/Api/ScTp');
    return response.data.data;
  },
  '风景': async () => {
    const {data: [image]} = await axios.get('/jfApi/home/bg/ajaxbg');
    // return 'https://i0.wp.com/www.jianfast.com' + image.replace('/400', '');
    return 'https://image.baidu.com/search/down?url=https://www.jianfast.com' + image.replace('/400', '');
  },
}


/** 上传页面配置信息到云端 todo */
export async function uploadInfo(info: object) {
  CommonStore.setLoading(true, "开始上传");
  const result = await myPut<boolean>('/pageParameters', info);
  if (result.success) CommonStore.setLoading(false, "上传成功", 'success');
  else CommonStore.setLoading(false);
}

/** 从云端获取页面配置信息 */
export async function getPageInfo() {
  const result = await myGet<any>('/pageParameters');
  if (result.success) return result.data;
}


/** 从云端获取搜索引擎列表 */
export async function getSearchEngineList(type = null) {
  const result = await myGet<any>(`/searchEngines/list${type ? '?type=' + type : ''}`);
  return result.data;
}

/** 添加搜索引擎 */
export async function addSearchEngine(body: object) {
  CommonStore.setLoading(true);
  try {
    const {data: {data}} = await myAxios({url: '/searchEngines', method: 'post', data: body});
    data._ || CommonStore.setLoading(false, "添加成功", 'success');
    return data;
  } catch (error) {
    CommonStore.setLoading(false)
  }
}

/** 修改搜索引擎 */
export async function updateSearchEngine(bodyList: any[]) {
  CommonStore.setLoading(true);
  try {
    const {data: {data}} = await myAxios({url: '/searchEngines', method: 'put', data: bodyList});
    data._ || CommonStore.setLoading(false, "修改成功", 'success');
    return data;
  } catch (error) {
    CommonStore.setLoading(false)
  }
}

/** 删除搜索引擎《支持批量》 */
export async function deleteSearchEngine(idList: number[]) {
  try {
    const {data: {data}} = await myAxios({url: '/searchEngines', method: 'delete', data: idList});
    data._ || CommonStore.setLoading(false, "删除成功", 'success');
    return data;
  } catch (error) {
    console.log('删除搜索引擎错误=>', error)
  }
}

/**
 * 获取书签
 *
 * return 当前用户的所有书签
 * @author ChenGuangLong
 * @since 2024/02/29 23:38
 */
export async function getBookmarks() {
  const {data: {data}} = await myAxios.get('/bookmarks')
  if (!data || !(data instanceof Array)) return []
  return data
}

/**
 * 新增书签|组
 *
 * @param bookmark 书签
 * return 新增的书签id
 * @author ChenGuangLong
 * @since 2024/03/1 00:14
 */
export async function addBookmarks(bookmark: IBookmark) {
  const result = await myPost<number>('/bookmarks', bookmark);
  return result.data
}

/**
 * 新增书签|组
 *
 * @param bookmark 要修改的书签
 * @return 成功与否
 * @author ChenGuangLong
 * @since 2024/03/5
 */
export async function updateBookmark(bookmark: any) {
  const result = await myPut<boolean>('/bookmarks', bookmark);
  return result.success
}

/**
 * 拖动排序书签
 * @param bookmark 书签dto
 */
export async function dragSort(bookmark: { id: number; type: number; sort: string; }) {
  CommonStore.setLoading(true);
  const result = await myPut('/bookmarks/dragSort', bookmark);
  CommonStore.setLoading(false);
  return result.success
}

/**删除书签*/
export async function delBookmark(bookmark: any) {
  const result = await myDelete('/bookmarks', bookmark);
  const success = result.success;
  success && CommonStore.msg.success('删除成功')
  return success
}
