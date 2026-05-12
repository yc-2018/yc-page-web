import {useEffect, useState} from 'react'
import dayjs from 'dayjs'
import {
  Button,
  CalendarPicker,
  InfiniteScroll,
  List,
  PullToRefresh,
  SearchBar,
  Space,
  Tag,
  Toast,
} from 'antd-mobile'
import IDeviceUsageLog from '@/interface/IDeviceUsageLog'
import {getDeviceUsageLogs} from '@/request/otherApi'

const PAGE_SIZE = 20
const MIN_DATE = new Date(2023, 0, 1)

const DeviceUsageLogs = () => {
  const [data, setData] = useState<IDeviceUsageLog[]>([]) // 设备使用日志列表
  const [page, setPage] = useState(1) // 当前页码
  const [hasMore, setHasMore] = useState(true) // 是否继续加载
  const [name, setName] = useState('') // App 名称输入值
  const [queryName, setQueryName] = useState('') // 生效的 App 名称查询值
  const [dateVisible, setDateVisible] = useState(false) // 日期选择器显示状态
  const [dateRange, setDateRange] = useState<[Date, Date] | null>(null) // 创建时间查询范围

  useEffect(() => {
    resetList()
  }, [queryName, dateRange])

  /** 重置设备日志列表 */
  const resetList = () => {
    setPage(1)
    setData([])
    setHasMore(true)
  }

  /** 加载更多设备日志 */
  const loadMore = async () => {
    const response = await getDeviceUsageLogs({
      page,
      pageSize: PAGE_SIZE,
      name: queryName,
      startTime: dateRange?.[0].getTime(),
      endTime: dateRange?.[1].getTime(),
    })
    if (!response.success) {
      Toast.show({icon: 'fail', content: '获取设备日志失败'})
      setHasMore(false)
      return
    }

    const records = response.data?.records ?? [] // 本页设备日志
    const total = response.data?.total ?? 0 // 设备日志总数
    setData(value => [...value, ...records])
    setHasMore(data.length + records.length < total)
    setPage(value => value + 1)
  }

  /** 清空创建时间筛选 */
  const clearDateRange = () => {
    setDateRange(null)
  }

  return (
    <>
      <div style={{padding: '8px 10px', background: '#fff'}}>
        <SearchBar
          value={name}
          placeholder="按 App 名称搜索"
          cancelText="清空"
          showCancelButton
          onChange={setName}
          onSearch={value => setQueryName(value.trim())}
          onClear={() => {
            setName('')
            setQueryName('')
          }}
          onCancel={() => {
            setName('')
            setQueryName('')
          }}
        />
        <Space wrap style={{marginTop: 8}}>
          <Button size="small" onClick={() => setDateVisible(true)}>
            筛选时间
          </Button>
          {dateRange &&
            <Tag color="primary" fill="outline" onClick={clearDateRange}>
              {dayjs(dateRange[0]).format('YYYY-MM-DD')} ~ {dayjs(dateRange[1]).format('YYYY-MM-DD')} ×
            </Tag>
          }
        </Space>
      </div>

      <PullToRefresh onRefresh={async () => resetList()}>
        <List>
          {data.map(item =>
            <List.Item key={item.id}>
              <div style={{display: 'grid', gap: 6}}>
                <div style={{display: 'flex', alignItems: 'baseline', gap: 8}}>
                  <span style={{fontWeight: 600, wordBreak: 'break-all'}}>
                    {item.name || '未知 App'}
                  </span>
                  <span style={{fontSize: 12, color: '#666', wordBreak: 'break-all'}}>
                    {item.packageName || '-'}
                  </span>
                </div>
                <Space wrap align="center">
                  <span style={{fontSize: 12, color: '#999'}}>
                    {item.time ? dayjs(item.time).format('YYYY-MM-DD HH:mm:ss') : '-'}
                  </span>
                  <Tag color="primary" fill="outline">{item.device || '未知设备'}</Tag>
                  {item.battery !== undefined && <Tag color="success" fill="outline">{item.battery}%</Tag>}
                  {item.charging !== undefined &&
                    <Tag color={item.charging ? 'warning' : 'default'} fill="outline">
                      {item.charging ? '充电中' : '未充电'}
                    </Tag>
                  }
                </Space>
              </div>
            </List.Item>
          )}
        </List>
        <InfiniteScroll loadMore={loadMore} hasMore={hasMore}/>
      </PullToRefresh>

      <CalendarPicker
        visible={dateVisible}
        selectionMode="range"
        min={MIN_DATE}
        max={new Date()}
        onClose={() => setDateVisible(false)}
        onMaskClick={() => setDateVisible(false)}
        onConfirm={value => {
          if (Array.isArray(value) && value[0] && value[1]) {
            const sortedDates = [...value].sort((a, b) => a.getTime() - b.getTime()) // 按时间顺序保存筛选范围
            setDateRange([
              dayjs(sortedDates[0]).startOf('day').toDate(),
              dayjs(sortedDates[1]).endOf('day').toDate(),
            ])
          }
          setDateVisible(false)
        }}
      />
    </>
  )
}

export default DeviceUsageLogs
