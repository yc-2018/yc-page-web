
/**
 * 获取基础url
 * @return [带http的域名,不带http的域名]
 * @author ChenGuangLong
 * @since 2025/7/14 上午11:39
*/
export function getBaseUrl(url: string) {
  return url.match(/^(?:https?:\/\/)?([^\/|^?]+)/)
}



/**
 * 提取URL的协议和域名
 *
 * @author Yc
 * @since 2025/7/14 0:16
 */
export function extractBaseUrl(url:string) {
  // 执行匹配                                // 匹配协议和域名部分（支持http、https、ftp等协议）
  const match = url.match(/^(https?|ftp):\/\/[^\s\/?]+/i);
  // 返回匹配结果（若有）或null
  return match?.[0];
}

/*
// 测试用例
console.log(extractBaseUrl('https://v.qq.com/x/search/?q=@@@'));
// 输出: "https://v.qq.com"

console.log(extractBaseUrl('https://libretranslate.com?source=auto&target=zh&q=@@@'));
// 输出: "https://libretranslate.com"

console.log(extractBaseUrl('ftp://files.example.com/downloads/item.zip'));
// 输出: "ftp://files.example.com"

console.log(extractBaseUrl('http://localhost:8080/api/data'));
// 输出: "http://localhost:8080"
————————————————————————————————————————————————————————————————————————————————————
————————————————————————————————————————————————————————————————————————————————————*/

/**
 * 提取URL的域名 支持 http 和 https
 * console.log(extractBaseUrl('http://localhost:8080/api/data'));
 * // 输出: "localhost:8080"
 *
 * @author Yc
 * @since 2025/7/14 0:17
 */
export function extractDomain(url: string) {
  return getBaseUrl(url)?.[1] ?? '';
}

export function tryGetFavicon(url: string) {
  return `${extractBaseUrl(url)}/favicon.ico`
}

/**
 * 尝试获取网站图标
 * 其他接口地址 https://blog.qqsuu.cn/4423.html   https://api.iowen.cn/doc/favicon.html   https://toolb.cn/favicon
 * @param url 网址
 * @author Yc
 * @since 2025/7/14 0:39
 */
export function tryGetFavicon1(url: string) {
  if (url.startsWith('http')) url = extractDomain(url)
  return `https://api.qqsuu.cn/api/dm-get?url=${url}`
}

export const thumbUrl = (url: string) => url.replace('/cxxjwimg/jfs', '/jdcms/s180x180_jfs');