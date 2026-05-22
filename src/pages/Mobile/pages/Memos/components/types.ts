export type MobileMemoItem = {
  id?: number
  itemType?: number
  completed?: number
  content?: string
  okText?: string
  okTime?: string
  createTime?: string
  updateTime?: string
  numberOfRecurrences?: number
}

export type MemoAction = {
  key: string
  id?: number
  text?: string
}
