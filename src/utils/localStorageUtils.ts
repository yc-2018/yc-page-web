// 统一在这些地方进行localStorage的设置和获取

import ISearchEngines from '@/interface/ISearchEngines';
import JWTUtils from '@/utils/JWTUtils';
import IUser from '@/interface/IUser';

const saveLocal = (key: string, value: unknown) => {
  const localValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
  localStorage.setItem(`${key}_${JWTUtils.getId()}`, localValue)
}

export const getLocal = (key: string) => {
  return localStorage.getItem(`${key}_${JWTUtils.getId()}`)
}

export const getLocalObj = <T>(key: string, defaultValue: T): T => {
  const objStr = getLocal(key);
  return objStr ? JSON.parse(objStr) as T : defaultValue
}

/**
 * 记录默认搜索引擎
 *
 * @author 𝓒𝓱𝓮𝓷𝓖𝓾𝓪𝓷𝓰𝓛𝓸𝓷𝓰
 * @since 2025/8/3 23:54
 */
export const _setDefaultEngine = (searchItem: ISearchEngines) => saveLocal('defaultEngine', searchItem)

/** 获取默认搜索引擎 */
export const _getDefaultEngine = () => {
  const defaultEngine = getLocal('defaultEngine');
  if (defaultEngine) return JSON.parse(defaultEngine)
  return {id: 0, engineUrl: 'https://www.baidu.com/s?wd=@@@', name: '百度'}
}


/** 背景来源：图片 URL 或内置动态背景协议 */
export const _setBackgroundUrl = (url: string) => saveLocal('backgroundUrl', url)
export const _getBackgroundUrl = () => getLocal('backgroundUrl')


/** 头像url */
export const _setNameAndAvatar = (user: IUser) => saveLocal('nameAndAvatar', user)
export const _getNameAndAvatar = (): IUser => getLocalObj('nameAndAvatar', {username: '-'})


/** 搜索引擎普通列表 */
export const _setSearchEngines = (searchEngines: ISearchEngines[]) => saveLocal('searchEngines', searchEngines)
export const _getSearchEngines = (): ISearchEngines[] | undefined => getLocalObj<ISearchEngines[] | undefined>('searchEngines', undefined)


/** 首页链接列表 */
export const _setHomeLinks = (searchEngines: ISearchEngines[]) => saveLocal('homeLinks', searchEngines)
export const _getHomeLinks = (): ISearchEngines[] => getLocalObj('homeLinks', [])
