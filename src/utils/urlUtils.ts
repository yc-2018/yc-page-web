/**
 * 提取URL的协议和域名
 *
 * @author Yc
 * @since 2025/7/14 0:16
 */
export function extractBaseUrl(url:string) {
  // 匹配协议和域名部分（支持http、https、ftp等协议）
  const regex = /^(https?|ftp):\/\/[^\s\/?]+/i;

  // 执行匹配
  const match = url.match(regex);

  // 返回匹配结果（若有）或null
  return match ? match[0] : null;
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
export function extractDomain(url:string) {
  return extractBaseUrl(url)?.replace(/https?:\/\//, '');
}

export function tryGetFavicon(url: string) {
  return `${extractBaseUrl(url)}/favicon.ico`
}

/**
 * 尝试获取网站图标
 *
 * @author Yc
 * @since 2025/7/14 0:39
 */
export function tryGetFavicon1(url: string) {
  return `https://api.qqsuu.cn/api/dm-get?url=${extractDomain(url)}`
}

