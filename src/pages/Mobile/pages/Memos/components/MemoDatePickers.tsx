import dayjs from 'dayjs'
import type {RefObject} from 'react'
import {CalendarPicker, Picker, Toast} from 'antd-mobile'

type MemoDatePickersProps = {
  dateVisible: boolean
  editDateVisible: boolean
  hhMmVisible: boolean
  dateRef: RefObject<HTMLElement>
  getOkTime: () => string | undefined
  setOkTime: (value: string) => void
  onCloseDate: () => void
  onCloseEditDate: () => void
  onCloseHhMm: () => void
  onInsertAtCursor: (text: string) => void
}

/** 从备忘时间中读取时分，未指定时间时使用当前时分 */
const getPickerTimeValue = (okTime?: string) => {
  const timeText = okTime?.split(' ')[1]; // 备忘时分秒文本
  const [hour, minute] = timeText?.split(':') ?? [];
  return hour && minute ? [hour, minute] : [dayjs().format('HH'), dayjs().format('mm')]
}

/** 移动端备忘日期和时间选择器 */
const MemoDatePickers = ({
  dateVisible,
  editDateVisible,
  hhMmVisible,
  dateRef,
  getOkTime,
  setOkTime,
  onCloseDate,
  onCloseEditDate,
  onCloseHhMm,
  onInsertAtCursor,
}: MemoDatePickersProps) => (
  <>
    <CalendarPicker
      popupStyle={{zIndex: 99999}}
      min={new Date(Date.now() - 59 * 24 * 60 * 60 * 1000)}
      max={new Date()}
      visible={dateVisible}
      selectionMode="single"
      onClose={onCloseDate}
      onMaskClick={onCloseDate}
      onConfirm={date => {
        if (!date) return
        const dayStr = dayjs(date).format('YYYY-MM-DD')
        const okTime = getOkTime()
        if (okTime) {
          setOkTime(`${dayStr} ${okTime.split(' ')[1]}`)
        } else setOkTime(`${dayStr} 00:00:00`)
        if (dateRef.current) dateRef.current.innerHTML = dayStr
        const element = window.document.querySelector('#timing') as HTMLElement | null
        if (element) element.style.display = 'inline-block'
      }}
    />

    <CalendarPicker
      popupStyle={{zIndex: 99999}}
      visible={editDateVisible}
      selectionMode="range"
      onClose={onCloseEditDate}
      onMaskClick={onCloseEditDate}
      onConfirm={date => {
        if (!date) return
        const startDate = dayjs(date[0]).format('YYYY-MM-DD')
        let endDate = dayjs(date[1]).format('YYYY-MM-DD')
        endDate = startDate === endDate ? '' : `~${endDate} `
        const textToInsert = `${startDate}${endDate}`
        onInsertAtCursor(textToInsert)
      }}
    />

    <Picker
      popupStyle={{zIndex: 99999}}
      value={getPickerTimeValue(getOkTime())}
      columns={[
        Array.from({length: 24}, (_, i) => ({
          label: i.toString().padStart(2, '0'),
          value: i.toString().padStart(2, '0'),
        })),
        Array.from({length: 60}, (_, i) => ({
          label: i.toString().padStart(2, '0'),
          value: i.toString().padStart(2, '0'),
        }))
      ]}
      visible={hhMmVisible}
      onClose={onCloseHhMm}
      onConfirm={value => {
        onCloseHhMm()
        const okTime = getOkTime()
        if (!okTime) return Toast.show({icon: 'fail', content: '未选择日期'})
        const time = ` ${value[0]}:${value[1]}:00`
        setOkTime(okTime.split(' ')[0] + time)
        const element = window.document.querySelector('#timing')
        if (element) element.textContent = `${value[0]}:${value[1]}`
      }}
    />
  </>
)

export default MemoDatePickers
