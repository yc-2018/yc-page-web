/**
 * dy看时间
 *
 * @author 𝘊𝘩𝘦𝘯𝘎𝘶𝘢𝘯𝘨𝘓𝘰𝘯𝘨
 * @since 2024/05/31 17:24:18
 */
export default interface IDySeeTime {
  /** 主键 */
  id?: number
  /** 用户id */
  userId?: string
  /** 日期 */
  date?: string
  /** 聚合计次 */
  count?: number
  /** 开始时间戳 上传是秒级时间戳，下载是字符串2025-07-17T12:16:20Z*/
  startTime?: string | number
  /** 结束时间戳 */
  endTime?: string | number
  /** 这次看页面的时长（秒） */
  thisTime?: number
  /** 当天总时长（开始到结束中间可能有不算的时长）包括各个页面 */
  totalDuration?: number
  /** 描述 */
  remark?: string
}

export interface IDyDateDto {
  seeRange: number
  startDate: number
  endDate: number
}