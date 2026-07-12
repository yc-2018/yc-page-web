/**
 * 备忘录 实体类
 *
 * @author 𝓒𝓱𝓮𝓷𝓖𝓾𝓪𝓷𝓰𝓛𝓸𝓷𝓰
 * @since 2025/7/17 0:27
 */
import type IMemoTag from '@/interface/IMemoTag';

export default interface IMemo {
  /** 备忘录事项ID */
  id?: number

  /** 用户ID */
  userId?: string

  /** 备忘录待办类型 (0:普通待办，1：循环待办，2：长期待办，3：紧急待办，4：备忘英语，5、日记待办，6、公事待办 */
  itemType?: number

  /** 内容 */
  content?: string

  /** 是否已完成 （1：完成，0未完成） */
  completed?: number

  /** 重复次数(循环代办专属) */
  numberOfRecurrences?: number

  /** 完成时记录备注文本 */
  okText?: string

  /** 备忘图片地址，多个地址用逗号分隔 */
  imgArr?: string

  /** 创建时间 */
  createTime?: string

  /** 修改时间 */
  updateTime?: string

  /** 完成时间 */
  okTime?: string

  /** 备忘标签列表 */
  tags?: IMemoTag[]

  /** 备忘标签ID列表 */
  tagIds?: number[]
}
