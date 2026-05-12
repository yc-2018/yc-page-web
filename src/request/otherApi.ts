import IDeviceUsageLog from '@/interface/IDeviceUsageLog'
import IPage from '@/interface/Ipage'
import {myGet} from './myAxios'

type DeviceUsageLogParams = {
  page?: number
  pageSize?: number
  name?: string
  startTime?: number
  endTime?: number
}

/**
 * 分页查询设备使用日志
 *
 * @param page 当前页码
 * @param pageSize 每页条数
 * @param name App 名称关键字
 * @param startTime 创建时间起始时间戳
 * @param endTime 创建时间结束时间戳
 */
export const getDeviceUsageLogs = ({
  page = 1,
  pageSize = 20,
  name,
  startTime,
  endTime,
}: DeviceUsageLogParams = {}) => {
  const params = new URLSearchParams() // 查询参数
  params.set('page', String(page))
  params.set('pageSize', String(pageSize))
  if (name) params.set('name', name)
  if (startTime) params.set('startTime', String(startTime))
  if (endTime) params.set('endTime', String(endTime))
  return myGet<IPage<IDeviceUsageLog>>(`/other/deviceUsageLog?${params.toString()}`)
}
