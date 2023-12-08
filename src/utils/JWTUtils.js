class JWTUtils {
    // 获取存储在 localStorage 中的 JWT
    static getToken() {
    return localStorage.getItem('jwt');
    }
  
    // 解析 JWT
    static parseJWT() {
    const token = this.getToken();
    if (!token) return null;
  
    const base64Url = token.split('.')[1];                                              // 得到 中间的数据体
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');                     // 去掉补位的 '='
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  
    return JSON.parse(jsonPayload);
    }
  
    // 判断 JWT 是否已过期
    static isExpired() {
    const payload = this.parseJWT();
    if (!payload) return true;
    
    return payload.exp < Date.now() / 1000;
    }
  
    // 从 JWT 中获取 name
    static getName() {
    const payload = this.parseJWT();
    return payload ? payload.name : null;
    }
  }
  