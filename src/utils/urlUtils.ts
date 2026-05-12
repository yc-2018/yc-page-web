
/**
 * 获取基础url
 * @return [带协议的域名,不带协议的域名]
 * @author ChenGuangLong
 * @since 2025/7/14 上午11:39
*/
export function getBaseUrl(url: string, hasProtocol = false) {
  const match = url.match(/^(?:https?:\/\/)?([^\/|^?]+)/);
  if (match) {
    return match[hasProtocol ? 0 : 1];
  }
  return ''
}

/**
 * 尝试获取网站图标
 * @param url 网址
 * @author ChenGuangLong
 * @since 2025/7/14 上午11:39
 */
export function tryGetFavicon(url?: string) {
  if (!url) return
  return `${getBaseUrl(url, true)}/favicon.ico`
}

/**
 * 尝试获取网站图标(能获取部分外网图标)
 * @param url 网址
 * @author Yc
 * @since 2025/11/10
 */
export function tryGetFavicon1(url?: string) {
  if (!url) return
  return `https://api.mxin.moe/api/v1/favicon?url=${getBaseUrl(url, true)}`
}

/**
 * 尝试获取网站图标
 * 其他接口地址 https://blog.qqsuu.cn/4423.html   https://api.iowen.cn/doc/favicon.html   https://toolb.cn/favicon
 * @param url 网址
 * @author Yc
 * @since 2025/7/14 0:39
 */
export function tryGetFavicon2(url?: string) {
  if (!url) return
  return `https://api.qqsuu.cn/api/dm-get?url=${getBaseUrl(url, false)}`
}

/** jd图转缩略图 */
export const thumbUrl = (url: string) => url.replace('/cxxjwimg/jfs', '/jdcms/s80x80_jfs');
