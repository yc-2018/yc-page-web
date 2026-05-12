import {myPost} from "./myAxios";
import CommonStore from "@/store/CommonStore";
import IDySeeTime, {IDyDateDto} from "@/interface/IDySeeTime";

/**
 * 保存浏览时间
 * @return 成功就返回true
 * @author Yc
 * @since 2024/8/28 22:45
 */
export async function saveSeeTime(body: IDySeeTime) {
  CommonStore.setLoading(true);
  const result = await myPost('/other/dySeeTime', body);
  if (result.success) CommonStore.setLoading(false, "记录成功", 'success');
  return result.success;
}

export async function getSeeTime(body:IDyDateDto) {
  CommonStore.setLoading(true);
  const {data} = await myPost('/other/getSeeTime', body);
  CommonStore.setLoading(false)
  return data ?? [];
}