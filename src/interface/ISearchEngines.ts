
export const SEARCH = 0
export const LOW_SEARCH = 1
export const HOME_LINK = 2
export type ILinkType = 0 | 'SEARCH' | 1 | 'LOW_SEARCH' | 2 | 'HOME_LINK'

/**
 * (search_engines)实体类
 *
 * @author yc
 * @since 2023-12-03 22:31:22
 */
export default interface ISearchEngines {
  /** ID  */
  id: number
  /** URL  */
  engineUrl: string
  /** 不常用 1是 0否  */
  type: ILinkType
  /** 名称  */
  name: string
  /** 图标URL  */
  iconUrl?: string
  /** 用户id  */
  userId?: string
}

