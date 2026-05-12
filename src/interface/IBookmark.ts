/**
 * 书签 实体类
 *
 * @author yc
 * @since 2023-12-03 22:31:22
 */
export default interface IBookmark {
  /** 书签ID */
  id?: number
  /** 用户ID */
  userId?: string
  /** 名称 */
  name?: string
  /** URL */
  url?: string
  /** 排序  书签组：所属书签排序，如：id/id/id    书签：书签组id */
  sort?: string
  /** 类型 状态0:正常书签(默认)  1:排序书签组(一个账号一个)  2:快捷图标书签 */
  type?: number
  /** 图标 */
  icon?: string
}