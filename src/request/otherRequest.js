import myAxios from "./myAxios";
import CommonStore from "../store/CommonStore";

/**
 * 保存浏览时间
 * @return {boolean} 成功就返回true
 * @author Yc
 * @since 2024/8/28 22:45
 */
export async function saveSeeTime(body) {
  CommonStore.setLoading(true);
  try {
    const {data:{data}} = await myAxios({url:'/other/dySeeTime',method: 'post', data : body});
    if (!data) throw new Error('保存失败');
    CommonStore.setLoading(false,"记录成功",'success');
    return data;
  } catch (error) {CommonStore.setLoading(false,"记录失败",'error')}
}