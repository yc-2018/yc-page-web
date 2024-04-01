import axios from "axios";

import CommonStore from "../store/CommonStore";
import UserStore from "../store/UserStore";
import myAxios from "./myAxios";

/** 用户登录 */
export async function login(loginCode,expireTime='bt', loading) {
    try {
        loading && loading(true)
        const response = await axios.post(`/api/users/login?key=${loginCode}&expireTime=${expireTime}`);
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

export async function updateNameOrAvatar(body) {
    try {
        const response = await myAxios.put(`/api/users`,body);
        const {code,msg,data} = response.data;
        if (code === 1) {
            // 保存新的
            UserStore.jwt = data;
            CommonStore.msg.success("更新成功");
            return true;
        } else CommonStore.msg.error(msg);  // 显示消息
    } catch (error) {
    }
}