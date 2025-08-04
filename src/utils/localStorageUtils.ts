// 统一在这些地方进行localStorage的设置和获取

import ISearchEngines from "@/interface/ISearchEngines";
import JWTUtils from "@/utils/JWTUtils";
import IUser from "@/interface/IUser";

const saveLocal = (key: string, value: any) => {
  if (typeof value === 'object') value = JSON.stringify(value)
  localStorage.setItem(`${key}_${JWTUtils.getId()}`, value)
}

export const getLocal = (key: string) => {
  return localStorage.getItem(`${key}_${JWTUtils.getId()}`)
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
  return {id: 0, engineUrl: "https://www.baidu.com/s?wd=@@@", name: "百度"}
}

/** 背景图片url */
export const _setBackgroundUrl = (url: string) => saveLocal('backgroundUrl', url)
export const _getBackgroundUrl = () => getLocal('backgroundUrl')

/** 头像url */
export const _setNameAndAvatar = (user: IUser) => saveLocal('nameAndAvatar', user)
export const _getNameAndAvatar = (): IUser => {
  const nameAndAvatar = getLocal('nameAndAvatar');
  return nameAndAvatar ? JSON.parse(nameAndAvatar) : {name: '-'}
}
