/**
 * 备忘标签实体类
 *
 * @author Codex
 * @since 2026/7/3
 */
export default interface IMemoTag {
  /** 标签ID */
  id?: number

  /** 备忘类型 */
  itemType?: number

  /** 标签名称 */
  name?: string

  /** 创建时间 */
  createTime?: string

  /** 修改时间 */
  updateTime?: string
}
