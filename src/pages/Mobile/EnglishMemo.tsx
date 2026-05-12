import {useRef, useState} from 'react'
import type {DropdownRef, InputRef, SwipeActionProps, TagProps} from 'antd-mobile'
import {
  Button,
  Dialog,
  Dropdown,
  InfiniteScroll,
  Input,
  List,
  Popup,
  PullToRefresh,
  Radio,
  SearchBar,
  Space,
  SwipeAction,
  Tag,
  Toast,
} from 'antd-mobile'
import {addMemo, deleteMemo, getMemos, updateMemo} from '@/request/memoApi'
import type IMemo from '@/interface/IMemo'
import {englishSortingOptions, tagList} from '@/store/NoLoginData'
import HighlightKeyword from '@/utils/HighlightKeyword'

const ENGLISH_MEMO_TYPE = 4 // 英语备忘类型

type EnglishContent = {
  english: string
  chinese: string
}

type EnglishMemoItem = IMemo & {
  id: number
  content: string
}

type EnglishEditVisible = false | '新增' | EnglishMemoItem

const englishActions: NonNullable<SwipeActionProps['rightActions']> = [
  {key: 'edit', text: '编辑', color: 'primary'},
  {key: 'delete', text: '删除', color: 'danger'},
]

const mobileTagColorMap: Record<string, TagProps['color']> = {
  processing: 'primary',
  success: 'success',
  error: 'danger',
  warning: 'warning',
}

/** 拆分英语备忘内容 */
const splitEnglishContent = (content = ''): EnglishContent => {
  const separatorIndex = content.indexOf('@@@') // 英文和中文的分隔位置
  if (separatorIndex === -1) return {english: content, chinese: ''}
  return {
    english: content.slice(0, separatorIndex),
    chinese: content.slice(separatorIndex + 3),
  }
}

/** 过滤出移动端英语备忘可渲染数据 */
const toEnglishMemos = (records: IMemo[] = []): EnglishMemoItem[] =>
  records.filter((item): item is EnglishMemoItem =>
    typeof item.id === 'number' && typeof item.content === 'string')

/** 获取移动端可用的标签颜色 */
const getMobileTagColor = (color: string): TagProps['color'] =>
  mobileTagColorMap[color] ?? 'primary'

/** 获取英语排序名称 */
const getEnglishOrderName = (value: number): string =>
  englishSortingOptions.find(item => item.value === value)?.label ?? 'A↓'

/** 移动端英语备忘 */
const EnglishMemo = () => {
  const [data, setData] = useState<EnglishMemoItem[]>([])
  const [hasMore, setHasMore] = useState(true)                    // 是否还能继续加载
  const [page, setPage] = useState(1)                              // 当前页码
  const [total, setTotal] = useState(0)                            // 英语备忘总数
  const [orderBy, setOrderBy] = useState(5)                        // 英语排序方式
  const [firstLetter, setFirstLetter] = useState<string>()         // 首字母筛选
  const [keyword, setKeyword] = useState<string | null>(null)      // 已提交搜索关键字
  const [searchValue, setSearchValue] = useState('')               // 搜索框内容
  const [editVisible, setEditVisible] = useState<EnglishEditVisible>(false) // 编辑弹层显示状态
  const [editEnglish, setEditEnglish] = useState('')               // 编辑英文
  const [editChinese, setEditChinese] = useState('')               // 编辑中文

  const dropdownRef = useRef<DropdownRef>(null)              // 排序下拉框
  const englishInputRef = useRef<InputRef>(null)             // 英文输入框
  const loadingVersionRef = useRef<number | null>(null)      // 当前加载版本，避免重复请求
  const queryVersionRef = useRef(0)                          // 查询版本，避免旧请求覆盖新筛选

  /** 重置英语列表 */
  const resetEnglishList = () => {
    queryVersionRef.current += 1
    loadingVersionRef.current = null
    setPage(1)
    setData([])
    setHasMore(true)
  }

  /** 加载英语备忘列表 */
  const loadMore = async () => {
    const queryVersion = queryVersionRef.current
    if (loadingVersionRef.current === queryVersion) return
    loadingVersionRef.current = queryVersion

    try {
      const append = await getMemos({
        type: ENGLISH_MEMO_TYPE,
        page,
        orderBy,
        firstLetter,
        keyword,
      })
      if (queryVersion !== queryVersionRef.current) return
      if (!append) {
        Toast.show({icon: 'fail', content: '获取数据失败'})
        setHasMore(false)
        return
      }

      const records = toEnglishMemos(append.data?.records)
      const nextTotal = append.data?.total ?? 0
      setTotal(nextTotal)
      setData(list => {
        const nextList = [...list, ...records]
        setHasMore(nextList.length < nextTotal)
        return nextList
      })
      setPage(value => value + 1)
    } finally {
      if (loadingVersionRef.current === queryVersion) loadingVersionRef.current = null
    }
  }

  /** 刷新并清空筛选 */
  const refreshEnglish = () => {
    setOrderBy(5)
    setFirstLetter(undefined)
    setKeyword(null)
    setSearchValue('')
    resetEnglishList()
  }

  /** 打开新增或编辑弹层 */
  const openEnglishEdit = (item: EnglishEditVisible) => {
    const {english, chinese} = splitEnglishContent(item === '新增' || !item ? '' : item.content)
    setEditVisible(item)
    setEditEnglish(english)
    setEditChinese(chinese)
    window.setTimeout(() => englishInputRef.current?.focus(), 100)
  }

  /** 关闭编辑弹层 */
  const closeEnglishEdit = async () => {
    const content = `${editEnglish}@@@${editChinese}`
    let changed = false // 弹层内容是否已修改
    if (editVisible === '新增') {
      changed = Boolean(editEnglish || editChinese)
    } else if (editVisible) {
      changed = content !== editVisible.content
    }
    if (changed) {
      const confirm = await Dialog.confirm({
        content: '检测到内容已修改，确定退出吗？',
        closeOnMaskClick: true,
      })
      if (!confirm) return
    }
    setEditVisible(false)
  }

  /** 提交新增或编辑 */
  const submitEnglish = async (): Promise<void> => {
    if (!editVisible) return

    const english = editEnglish.trim()
    const chinese = editChinese.trim()
    const content = `${english}@@@${chinese}`

    if (!english || !chinese) {
      Toast.show({icon: 'fail', content: '英文和中文不能为空'})
      return
    }
    if (english.length > 100 || chinese.length > 100) {
      Toast.show({icon: 'fail', content: '输入框最多100个字符'})
      return
    }
    if (editVisible !== '新增' && content === editVisible.content) {
      setEditVisible(false)
      Toast.show({content: '没有变化'})
      return
    }

    const loading = Toast.show({icon: 'loading', content: '处理中…', duration: 0})
    const result = editVisible === '新增'
      ? await addMemo({itemType: ENGLISH_MEMO_TYPE, content})
      : await updateMemo({id: editVisible.id, content})
    loading?.close()

    if (result) {
      Toast.show({icon: 'success', content: '成功'})
      setEditVisible(false)
      resetEnglishList()
    } else {
      Toast.show({icon: 'fail', content: '失败'})
    }
  }

  /** 删除英语备忘 */
  const removeEnglish = async (item: EnglishMemoItem) => {
    const {english, chinese} = splitEnglishContent(item.content)
    await Dialog.confirm({
      content:
        <div style={{textAlign: 'center'}}>
          <div style={{color: '#999', marginBottom: 8}}>{english} / {chinese}</div>
          确定删除该条英语备忘吗？
        </div>,
      onConfirm: async () => {
        const result = await deleteMemo(item.id)
        if (result) {
          setData(list => list.filter(dataItem => dataItem.id !== item.id))
          setTotal(value => Math.max(value - 1, 0))
          Toast.show({icon: 'success', content: '删除成功'})
        } else {
          Toast.show({icon: 'fail', content: '删除失败'})
        }
      },
    })
  }

  /** 提交搜索 */
  const searchEnglish = (value: string) => {
    setKeyword(value.trim() || null)
    resetEnglishList()
  }

  return (
    <>
      <div style={{display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 8, alignItems: 'center'}}>
        <div style={{color: '#999', whiteSpace: 'nowrap'}}>
          总数:{total}
        </div>
        <Dropdown ref={dropdownRef} style={{minWidth: 0}}>
          <Dropdown.Item key="orderBy" title={`排序:${getEnglishOrderName(orderBy)}`}>
            <div style={{padding: 12}}>
              <Radio.Group
                value={orderBy}
                onChange={value => {
                  setOrderBy(Number(value))
                  resetEnglishList()
                  dropdownRef.current?.close()
                }}
              >
                <Space direction="vertical">
                  {englishSortingOptions.map(item =>
                    <Radio key={item.value} value={item.value} style={{width: '90vw'}}>
                      {item.label}
                    </Radio>
                  )}
                </Space>
              </Radio.Group>
            </div>
          </Dropdown.Item>
        </Dropdown>
        <Button size="small" color="primary" onClick={() => openEnglishEdit('新增')}>
          添加
        </Button>
      </div>

      <div style={{display: 'flex', gap: 6, overflowX: 'auto', padding: '8px 8px 4px'}}>
        <Tag
          color={firstLetter ? 'default' : 'primary'}
          fill={firstLetter ? 'outline' : 'solid'}
          onClick={() => {
            setFirstLetter(undefined)
            resetEnglishList()
          }}
          style={{flex: '0 0 auto'}}
        >
          全部
        </Tag>
        {tagList.map(item =>
          <Tag
            key={item.value}
            color={getMobileTagColor(item.color)}
            fill={firstLetter === item.value ? 'solid' : 'outline'}
            onClick={() => {
              setFirstLetter(value => value === item.value ? undefined : item.value)
              resetEnglishList()
            }}
            style={{flex: '0 0 auto', textTransform: 'uppercase'}}
          >
            {item.value}
          </Tag>
        )}
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '1fr auto', gap: 8, padding: '6px 8px'}}>
        <SearchBar
          value={searchValue}
          placeholder="要搜索单词吗😶‍🌫️"
          cancelText="清空"
          showCancelButton
          maxLength={100}
          onChange={setSearchValue}
          onSearch={searchEnglish}
          onCancel={() => {
            setSearchValue('')
            searchEnglish('')
          }}
          onClear={() => {
            setSearchValue('')
            searchEnglish('')
          }}
        />
        <Button size="small" onClick={refreshEnglish}>
          重置
        </Button>
      </div>

      <PullToRefresh
        pullingText="用点力拉🤤"
        canReleaseText="放开就要刷新了🥺"
        completeText="哎呦，你干嘛🥴"
        onRefresh={async () => resetEnglishList()}
      >
        <List>
          {data.map(item => {
            const {english, chinese} = splitEnglishContent(item.content)
            return (
              <SwipeAction
                key={item.id}
                rightActions={englishActions}
                onAction={action => {
                  if (action.key === 'edit') {
                    openEnglishEdit(item)
                  } else {
                    removeEnglish(item)
                  }
                }}
              >
                <List.Item onClick={() => openEnglishEdit(item)}>
                  <div style={{display: 'grid', gap: 4}}>
                    <div style={{fontSize: 16, fontWeight: 600, wordBreak: 'break-word'}}>
                      {keyword ? <HighlightKeyword content={english} keyword={keyword}/> : english}
                    </div>
                    <div style={{fontSize: 13, color: '#666', wordBreak: 'break-word'}}>
                      {keyword ? <HighlightKeyword content={chinese} keyword={keyword}/> : chinese}
                    </div>
                  </div>
                </List.Item>
              </SwipeAction>
            )
          })}
        </List>
        {!hasMore && data.length === 0 && <div className="loadMore">暂无英语备忘</div>}
        <InfiniteScroll loadMore={loadMore} hasMore={hasMore}/>
      </PullToRefresh>

      <Popup
        visible={Boolean(editVisible)}
        onMaskClick={closeEnglishEdit}
        position="top"
        bodyStyle={{padding: 12, width: '100vw', boxSizing: 'border-box'}}
      >
        <div style={{display: 'grid', gap: 10, width: '100%', boxSizing: 'border-box'}}>
          <div className="editBoxTitle" style={{textAlign: 'center'}}>
            {editVisible === '新增' ? '新增英语' : '编辑英语'}
          </div>
          <Input
            ref={englishInputRef}
            value={editEnglish}
            clearable
            maxLength={100}
            placeholder="请输入英文"
            onChange={setEditEnglish}
            style={{border: '1px solid #ccc', borderRadius: 8, boxSizing: 'border-box', padding: '8px 10px', width: '100%'}}
          />
          <Input
            value={editChinese}
            clearable
            maxLength={100}
            placeholder="请输入中文"
            onChange={setEditChinese}
            style={{border: '1px solid #ccc', borderRadius: 8, boxSizing: 'border-box', padding: '8px 10px', width: '100%'}}
          />
          <Button block color="primary" onClick={submitEnglish}>
            提交
          </Button>
        </div>
      </Popup>
    </>
  )
}

export default EnglishMemo
