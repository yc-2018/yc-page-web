/**
 * (search_engines)实体类
 *
 * @author yc
 * @since 2023-12-03 22:31:22
 */
export default interface ISearchEngines {
  /** 搜索引擎ID  */
  id: number
  /** 搜索引擎URL  */
  engineUrl: string
  /** 是否快速搜索 1快 0普通  */
  isQuickSearch?: number
  /** 不常用 1是 0否  */
  lowUsage?: number
  /** 名称  */
  name: string
  /** 图标URL  */
  iconUrl?: string
  /** 用户id  */
  userId?: string
}
