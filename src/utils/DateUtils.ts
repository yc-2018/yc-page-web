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
    return `${year}-${month}-${day}${delimiter}${hour}:${minute}:${second}`
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
}