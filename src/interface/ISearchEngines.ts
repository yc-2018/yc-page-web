
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
  /** 搜索引擎乐观锁版本号 */
  version?: number
  /** 当前分类的排序版本号 */
  sortVersion?: number
  /** URL  */
  engineUrl: string
  /** 直达URL，搜索框为空时直接打开  */
  directUrl?: string
  /** 不常用 1是 0否  */
  type: ILinkType
  /** 名称  */
  name: string
  /** 图标URL  */
  iconUrl?: string
  /** 用户id  */
  userId?: string
}

/** 搜索引擎或首页链接的可选示例，不包含用户数据ID和业务类型 */
export type ISearchEngineExample = Pick<ISearchEngines, 'name' | 'engineUrl'> &
  Partial<Pick<ISearchEngines, 'directUrl' | 'iconUrl'>>
