import myAxios from "./myAxios";
import CommonStore from "../store/CommonStore";

export async function saveSeeTime(body) {
  CommonStore.setLoading(true);
  try {
    const {data:{data}} = await myAxios({url:'/other/dySeeTime',method: 'post', data : body});
    data || CommonStore.setLoading(false,"记录成功",'success');
    return data;
  } catch (error) {CommonStore.setLoading(false,"记录失败",'error')}
}