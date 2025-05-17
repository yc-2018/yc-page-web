/**
 * 日期工具类
 *
 * @author Yc
 * @since 2024/8/29 1:02
 */
export default class DateUtils {

  /**
   * 格式化时间为yyyy-MM-dd HH:mm:ss
   * @param date      时间对象
   * @param delimiter 分隔符
   * @author Yc
   * @since 2024/8/28 0:07
   */
  static format(date: Date = new Date(), delimiter: string = ' '): string {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    return `${year}-${this.addZero(month)}-${this.addZero(day)}${delimiter}${this.addZero(hour)}:${this.addZero(minute)}:${this.addZero(second)}`
  }

  /**
   * 时间戳(字符串)转日期时间
   * @param timestamp 时间戳(或字符串)
   * @author Yc
   * @since 2024/8/28 0:16
   */
  static timestampToDate(timestamp: string | number): Date {
    return new Date(typeof timestamp === "string" ? parseInt(timestamp) : timestamp)
  }

  /**
   * 毫秒格式化为 HH时mm分ss秒  如果HH是0，则不显示 如果mm是0，则不显示
   *
   * @author Yc
   * @since 2024/8/29 0:47
   */
  static millisecondFormat(millisecond: number): string {
    if (!millisecond || millisecond <= 0) return '0秒'

    let hour = Math.floor(millisecond / 3600000)
    let minute = Math.floor((millisecond - hour * 3600000) / 60000)
    let second = Math.floor((millisecond - hour * 3600000 - minute * 60000) / 1000)
    let result = ''
    if (hour !== 0) result += this.addZero(hour) + '时'
    if (minute !== 0) result += this.addZero(minute) + '分'
    result += this.addZero(second) + '秒'
    return result
  }

  /**
   * 秒格式化为 HH时mm分ss秒  如果HH是0，则不显示 如果mm是0，则不显示
   *
   * @author Yc
   * @since 2024/8/29 0:59
   */
  static secondFormat(second: number): string {
    return this.millisecondFormat(second * 1000)
  }

  /** 添加前导0 */
  private static addZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`
  }
}

/**
 * 格式化备忘录时间
 *
 * @author Yc
 * @since 2025/5/17 3:38
 */
export const formatMemoTime = (strTime?: string) => strTime?.replace(' 00:00:00', ' ')