import UserStore from "../store/UserStore";
import CommonStore from "../store/CommonStore";

export default class JWTUtils {
    // 获取存储在 localStorage 中的 JWT
    static getToken() {
        return UserStore.jwt;
    }

    // 解析 JWT
    static parseJWT(token = this.getToken()) {
        if (!token) return null;
        try {
            const base64Url = token.split('.')[1];                                              // 得到 中间的数据体
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');                     // 去掉补位的 '='
            const jsonPayload = decodeURIComponent(atob(base64)?.split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16))?.slice(-2))?.join(''));
            return JSON.parse(jsonPayload);
        } catch (e) {
            UserStore.clearJwt();
        }
    }

    // 判断 JWT 是否已过期
    static isExpired(payload = this.parseJWT()) {
        if (!payload) return true;
        const isExp = payload.exp < Date.now() / 1000;
        isExp && UserStore.clearJwt()   // 过期清空 JWT
        prompt(isExp);                  // 判断是否要提示
        return isExp;
    }

    // 从 JWT 中获取 name
    static getName() {
        const payload = this.parseJWT();
        return payload?.username || 'ikun' + payload?.userId?.substring(0, 10) + '...'
    }

    // 从 JWT 中获取 头像URL
    static getAvatar() {
        const payload = this.parseJWT();
        return payload?.avatar
    }
}


let isPrompt = true; // 是否提示登录失效
/**
 * 自动判断提示登录失效*/
const prompt = isExp => {
    if (!isExp) return;
    if (isPrompt) {
        setTimeout(() => {
            CommonStore.msg.error('登录信息已失效，请重新登录。');
            isPrompt = false;
        }, 500);
        setTimeout(() => isPrompt = true, 1500);
    }
}