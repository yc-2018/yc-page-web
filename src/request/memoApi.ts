import CommonStore from "@/store/CommonStore";
import {myDelete, myGet, myPost, myPut} from "./myAxios";
import ILoopMemoItem from "@/interface/ILoopMemoItem";
import IPage from "@/interface/Ipage";
import IMemo from "@/interface/IMemo";


const {msg} = CommonStore

/** 获取一个类型的待办列表 循环的先默认给个30条其他的还是默认10条
 * @param page      第几页
 * @param pageSize  每页多少条
 * @param completed 想看的完成类型 0 未完成 1 已完成 -1 全部
 * @param type      待办类型
 * @param orderBy  排序方式 1：更新时间↓ 2：更新时间↑ 3：创建时间↓ 4：创建时间↑ 5：A↓ 6：Z↓
 * @param firstLetter 从哪个字母开始查询
 * @param keyword  搜索关键词
 * @param dateRange   日期范围: 开始时间戳/结束时间戳/0：修改时间 1：创建时间
 */
export async function getMemos({type = 0, page = 1, completed = 0, orderBy, firstLetter, keyword, dateRange}: any) {
  let pageSize = type === 1 ? '&pageSize=30' : '';   // 如果是循环待办就默认30条
  type === 4 && (pageSize = '&pageSize=20');
  page = `?page=${page}`;
  completed = `&completed=${completed}`;                   // 完成?
  orderBy = orderBy ? `&orderBy=${orderBy}` : '';             // 排序
  firstLetter = firstLetter ? `&firstLetter=${firstLetter}` : '';
  keyword = keyword ? `&keyword=${encodeURIComponent(keyword)}` : ''; // 关键词不加参数前 搜索包涵‘[’或‘]’就会报 400 错误
  dateRange = dateRange ? `&dateRange=${dateRange}` : '';
  return await myGet<IPage<IMemo>>(`/memo/${type + page + completed + pageSize + orderBy + firstLetter + keyword + dateRange}`);

}

/**
 * 新增一个待办
 *
 * @author 𝓒𝓱𝓮𝓷𝓖𝓾𝓪𝓷𝓰𝓛𝓸𝓷𝓰
 * @since 2025/7/17 0:25
 */
export async function addMemo(memo: IMemo) {
  const response = await myPost<IMemo>('/memo', memo);
  if (response.code === 1) {
    msg.success('成功');
    return response.data;
  }
}

/** 修改一个待办 */
export async function updateMemo(memo: IMemo) {
  const response = await myPut<IMemo>('/memo', memo);
  if (response.code === 1) {
    msg.success('成功');
    return response.data;
  }
}

/** 删除一个待办 */
export async function deleteMemo(id: number) {
  const response = await myDelete<boolean>(`/memo/${id}`);
  if (response.code === 1) {
    msg.success("删除成功");
    return true;
  }
}


/*
    __                            __  ___                             ____   __
   / /   ____   ____     ____     /  |/  /  ___    ____ ___   ____     /  _/  / /_  ___    ____ ___
  / /   / __ \ / __ \   / __ \   / /|_/ /  / _ \  / __ `__ \ / __ \    / /   / __/ / _ \  / __ `__ \
 / /___/ /_/ // /_/ /  / /_/ /  / /  / /  /  __/ / / / / / // /_/ /  _/ /   / /_  /  __/ / / / / / /
/_____/\____/ \____/  / .___/  /_/  /_/   \___/ /_/ /_/ /_/ \____/  /___/   \__/  \___/ /_/ /_/ /_/
                     /_/
*/

/**
 * 获取循环备忘录时间列表
 *
 * @param page {number}      第几页
 * @param id {number}        待办id
 * @param q                  搜索关键字
 *  param pageSize           页面大小 = 20
 * @author 𝐶𝒽𝑒𝑛𝐺𝑢𝑎𝑛𝑔𝐿𝑜𝑛𝑔
 */
export const selectLoopMemoItemList = (id: number, page: number = 1, q?: string) =>
    myGet<IPage<ILoopMemoItem>>(`/loopMemoItem/${id}?page=${page}&q=${q}`)

/**
 * 添加循环备忘录时间
 *
 * @author 𝓒𝓱𝓮𝓷𝓖𝓾𝓪𝓷𝓰𝓛𝓸𝓷𝓰
 * @since 2025/7/16 22:33
 */
export const addLoopMemoItem = async (loopMemoItem: ILoopMemoItem) =>
  myPost<ILoopMemoItem>('/loopMemoItem', loopMemoItem)

/**
 * 更新循环备忘录
 * @param loopMemoItem 循环备忘录对象
 * @since 2025/5/14 2:33
 */
export const updateLoopMemoItem = async (loopMemoItem: ILoopMemoItem) =>
  myPut<ILoopMemoItem>('/loopMemoItem', loopMemoItem)

/**
 * 删除循环备忘录
 *
 * @param memoId 备忘录id
 * @param loopId 循环id
 */
export const deleteLoopMemoItem = (memoId: number, loopId: number) =>
  myDelete<boolean>(`/loopMemoItem/${memoId}/${loopId}`);

