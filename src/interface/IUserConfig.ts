/** 用户配置 */
export default interface IUserConfig {
  /** 主键 */
  id?: number

  /** 用户ID，与users表关联 */
  userId?: string

  /** 头像url */
  avatarUrl?: string

  /** 背景URL */
  backgroundUrl?: string

  /** 搜索引擎排序 id/id/id */
  searchSort?: string

  /** 不常用的搜索引擎排序 id/id/id */
  lowSearchSort?: string

  /** 首页大图标书签排序  id/id/id */
  homeBookmarkSort?: string
}
