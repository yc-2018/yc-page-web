import axios from 'axios';
import UserStore from '../store/UserStore';
import CommonStore from "../store/CommonStore";
import myAxios  from "./myAxios";


/** 异步获取百度联想列表 */
export async function getThinkList(param) {
    if (!param) return;
    const {data} = await axios.get(`https://yc556.cn/bd/sugrec?ie=utf-&prod=pc&from=pc_web&wd=${param}`);

    return data.g?.map(item => ({ value: item.q }));
}


/**
 * 获取首页背景图（搞多几个做备份）
 * @returns {Promise<null|string>} 随机壁纸URL
 */
export async function reImagesUrl(bzType="风景") {
    CommonStore.setLoading(true);
    try {
        async function jfApi() {
            const { data: [image] } = await axios.get('https://yc556.cn/jfApi/home/bg/ajaxbg');
            CommonStore.setLoading(false,"获取风景/科技壁纸成功,正在加载...");
            return 'https://i0.wp.com/www.jianfast.com' + image.replace('/400', '');
        }

        async function bz1Api() {
            // https://api.btstu.cn/sjbz/api.php?lx=dongman&format=json
            const {data:{imgurl}} = await axios.get('https://yc556.cn/bz1Api/sjbz/api.php?format=json');
            CommonStore.setLoading(false,"获取随机壁纸成功,正在缓慢加载中...");
            return imgurl;
        }

        async function bz2Api() {
            // 如诗 - API接口文档 https://api.likepoems.com/
            // https://api.likepoems.com/img/pc/?type=json
            const {data:{url}} = await axios.get('https://yc556.cn/bz2Api/img/pc/?type=json');
            CommonStore.setLoading(false,"获取动画壁纸成功,正在加载...");
            return url;
        }
        return bzType === "风景"? jfApi():               
               bzType === "动画"? bz2Api():            
               bzType === "随机"? bz1Api():jfApi();     

    } catch (error) {
         CommonStore.setLoading(false,"获取壁纸失败了",'error');
    }
}


/** 登录 */
export async function login(loginCode,expireTime='bt', loading) {
    try {
        loading && loading(true)
        const response = await axios.post(`https://yc556.cn/api/users/login?key=${loginCode}&expireTime=${expireTime}`);
        loading && loading(false)
        const {code,msg,data} = response.data;

        if (code === 1) {
            // 存储 JWT
            UserStore.jwt = data;
            CommonStore.msg.success("登录成功");
            return true;
        } else if (code === 0) CommonStore.msg.error(msg);  // 显示消息
    } catch (error) {
        CommonStore.msg.error('请求失败');
    }
}


/** 获取一个类型的待办列表 循环的先默认给个30条其他的还是默认10条
* @param page      第几页
* @param pageSize  每页多少条
* @param completed 想看的完成类型 0 未完成 1 已完成 -1 全部
* @param type      待办类型
* @param orderBy  排序方式 1：更新时间↓ 2：更新时间↑ 3：创建时间↓ 4：创建时间↑ 5：A↓ 6：Z↓
* @param firstLetter 从哪个字母开始查询
* @param keyword  搜索关键词
*/
export async function getToDoItems({type = 0, page = 1, completed = 0, orderBy, firstLetter, keyword}) {
    const pageSize = type === 1?'&pageSize=30':'';   // 如果是循环待办就默认30条
    page = `?page=${page}`;
    completed= `&completed=${completed}`;                   // 完成?
    orderBy = orderBy?`&orderBy=${orderBy}`:'';             // 排序
    firstLetter = firstLetter?`&firstLetter=${firstLetter}`:'';
    keyword = keyword ?`&keyword=${keyword}`:'';
    try {
        const response = await myAxios
            .get(`/toDoItems/${type + page + completed + pageSize + orderBy + firstLetter + keyword}`);
        return response.data;
    } catch (error) {console.error('待办请求失败:', error)}
}

/** 保存或修改一个待办 */
export async function saveOrUpdateToDoItem(body,requestType='post') {
    try {
        const response = await myAxios({url: '/toDoItems',method: requestType, data : body});
        if (response.data.code === 1) {
            CommonStore.msg.success('成功');
            return response.data.data;
        }
    } catch (error) {console.error('待办请求失败:', error)}
}

/** 删除一个待办 */
export async function delToDoItem(id) {
    try {
        const response = await myAxios.delete(`/toDoItems/${id}`);
        if (response.data.code === 1) {
            CommonStore.msg.success("删除成功");
            return true;
        }
    } catch (error) {console.error('待办请求失败:', error)}
}

/**
 * 获取循环备忘录时间列表
 *
 * @param page {number}      第几页
 * @param id {number}        待办id
 *  param pageSize           页面大小 = 20
 * @return {object}          待办时间对象或空
 * @author ChenGuangLong
 */
export async function selectLoopMemoTimeList(id, page=1) {
    try {
        const response = await myAxios.get(`/loopMemoTime/${id}?page=${page}`);
        return response?.data?.data;
    }catch (error) {console.log('待办请求失败:', error)}
}


/** 上传页面配置信息到云端 */
export async function uploadInfo(Info) {
    CommonStore.setLoading(true,"开始上传");
    try {
        const {data:{data}} = await myAxios({url: '/pageParameters',method: 'put', data : Info});

        data._ || CommonStore.setLoading(false,"上传成功",'success');
    } catch (error) {CommonStore.setLoading(false);}
}

/** 从云端获取页面配置信息 */
export async function getPageInfo() {
    try {
        const {data:{data}} = await myAxios.get('/pageParameters');
        return data;
    } catch (error) {return null}
}


/** 从云端获取搜索引擎列表 */
export async function getSearchEngineList(type=null) {
    try {
        const {data:{data}} = await myAxios.get(`/searchEngines/list${type?'?type='+type:''}`);
        return data;
    } catch (error) {return null}
}

/** 添加搜索引擎 */
export async function addSearchEngine(body) {
    CommonStore.setLoading(true);
    try {
        const {data:{data}} = await myAxios({url:'/searchEngines',method: 'post', data : body});
        data._ || CommonStore.setLoading(false,"添加成功",'success');
        return data;
    } catch (error) {CommonStore.setLoading(false)}
}

/** 修改搜索引擎 */
export async function updateSearchEngine(bodyList) {
    CommonStore.setLoading(true);
    try {
        const {data:{data}} = await myAxios({url:'/searchEngines',method: 'put', data : bodyList});
        data._ || CommonStore.setLoading(false,"修改成功",'success');
        return data;
    } catch (error) {CommonStore.setLoading(false)}
}

/** 删除搜索引擎《支持批量》 */
export async function deleteSearchEngine(idList) {
    CommonStore.setLoading(true);
    try {
        const {data:{data}} = await myAxios({url:'/searchEngines',method: 'delete', data : idList});
        data._ || CommonStore.setLoading(false,"删除成功",'success');
        return data;
    } catch (error) {CommonStore.setLoading(false)}
}