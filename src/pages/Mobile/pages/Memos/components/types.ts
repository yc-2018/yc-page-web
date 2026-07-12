export type MobileMemoItem = {
  id?: number
  itemType?: number
  completed?: number
  content?: string
  okText?: string
  imgArr?: string
  okTime?: string
  createTime?: string
  updateTime?: string
  numberOfRecurrences?: number
  tagIds?: number[]
  tags?: {
    id?: number
    itemType?: number
    name?: string
  }[]
}

export type MemoAction = {
  key: string
  id?: number
  text?: string
}
