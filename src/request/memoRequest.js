import CommonStore from "../store/CommonStore";
import myAxios from "./myAxios";

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
    let pageSize = type === 1?'&pageSize=30':'';   // 如果是循环待办就默认30条
    type === 4 && (pageSize = '&pageSize=20');
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


