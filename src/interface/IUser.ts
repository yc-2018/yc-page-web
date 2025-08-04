/**
 * (users)实体类
 *
 * @author yc
 * @since 2023-12-03 22:31:22
 */
export default interface IUser {

  /** 用户ID */
  id?: string

  /** 用户名 */
  username?: string

  /** 邮箱 */
  email?: string

  /** 电话号码 */
  phoneNumber?: string

  /** 密码 */
  password?: string

  /** 创建时间 */
  createTime?: string

  /** 修改时间 */
  updateTime?: string

  /** 是否已删除 */
  isDeleted?: number

  /** 头像 */
  avatar?: string
}
