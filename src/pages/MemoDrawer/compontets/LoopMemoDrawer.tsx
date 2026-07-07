import {useState} from 'react';
import type {ReactNode} from 'react';
import {App, Button, Drawer, Empty, Image, Input, Space, Spin, Tag, Typography} from 'antd';
import type {UploadFile, UploadProps} from 'antd';
import {CommentOutlined, DeleteOutlined, EditOutlined, HistoryOutlined, MoreOutlined, SyncOutlined} from '@ant-design/icons';
import {fDate} from '@/utils/DateUtils';
import {thumbUrl} from '@/utils/urlUtils.js';
import {
  addLoopMemoItemComment,
  deleteLoopMemoItemComment,
  selectLoopMemoItemCommentList,
  updateLoopMemoItemComment,
} from '@/request/memoApi';
import LoopMemoCommentEditContent from '@/pages/MemoDrawer/compontets/LoopMemoCommentEditContent';
import type {
  CopyLoopMemoItemHandler,
  DeleteLoopMemoItemHandler,
  LoadLoopMemoItems,
  MemoDrawerListItem,
  MemoLoopItem,
  MemoLoopItemComment,
  StartLoopMemoTransferHandler,
  UpdateLoopMemoItemHandler,
} from '@/pages/MemoDrawer/types';

interface UploadImageResponse {
  /** 上传完成后的原图地址 */
  url?: string
}

interface LoopMemoDrawerProps {
  /** 循环备忘主项 */
  memo: MemoDrawerListItem
  /** 循环子项列表 */
  loopTimeList: MemoLoopItem[]
  /** 循环子项总数 */
  loopTimeTotal: number
  /** 循环子项加载状态 */
  loopTimeWebLoading: boolean
  /** 加载循环子项 */
  getLoopMemoTimeData: LoadLoopMemoItems
  /** 重置循环子项列表 */
  resetLoopMemoTimeData: () => void
  /** 修改循环子项 */
  updateLoopMemo: UpdateLoopMemoItemHandler
  /** 删除循环子项 */
  deleteLoopMemo: DeleteLoopMemoItemHandler
  /** 复制循环子项备注并直接加一 */
  copyAddLoopMemo: CopyLoopMemoItemHandler
  /** 复制循环子项备注后编辑加一 */
  copyEditLoopMemo: CopyLoopMemoItemHandler
  /** 上传图片按钮 */
  uploadButton: ReactNode
  /** 图片上传请求 */
  uploadLoopMemoImage: UploadProps<UploadImageResponse>['customRequest']
  /** 图片预览 */
  previewUploadImage: (file: UploadFile<UploadImageResponse>) => void
  /** 是否有循环图片正在上传 */
  hasLoopMemoUploading: () => boolean
  /** 进入主列表选择转移目标 */
  onStartTransfer: StartLoopMemoTransferHandler
}

let editLoopMemoCommentText = ''; // 循环记录评论文本修改
let editLoopMemoCommentImgArr = ''; // 循环记录评论图片修改

/** 循环备忘子项二层抽屉 */
const LoopMemoDrawer = ({
  memo,
  loopTimeList,
  loopTimeTotal,
  loopTimeWebLoading,
  getLoopMemoTimeData,
  resetLoopMemoTimeData,
  updateLoopMemo,
  deleteLoopMemo,
  copyAddLoopMemo,
  copyEditLoopMemo,
  uploadButton,
  uploadLoopMemoImage,
  previewUploadImage,
  hasLoopMemoUploading,
  onStartTransfer,
}: LoopMemoDrawerProps) => {
  const [open, setOpen] = useState(false); // 二层抽屉显示状态
  const [loopKeyword, setLoopKeyword] = useState(''); // 循环记录搜索输入值
  const [activeLoopKeyword, setActiveLoopKeyword] = useState(''); // 当前生效的循环记录关键字
  const [transferSelecting, setTransferSelecting] = useState(false); // 循环记录转移选择模式
  const [selectedLoopIds, setSelectedLoopIds] = useState<number[]>([]); // 已选择转移的循环记录主键
  const [commentMap, setCommentMap] = useState<Record<number, {
    loop?: MemoLoopItem
    records?: MemoLoopItemComment[]
    page?: number
    total?: number
    hasMore?: boolean
    loading?: boolean
  }>>({}); // 循环记录评论按循环项id分组
  const {message, modal} = App.useApp();
  const memoId = memo.id; // 循环备忘主项 ID

  /** 打开二层抽屉并从第一页加载循环记录 */
  const openDrawer = async () => {
    if (!memoId) return;
    resetLoopMemoTimeData()
    setOpen(true)
    setLoopKeyword('')
    setActiveLoopKeyword('')
    setCommentMap({})
    setTransferSelecting(false)
    setSelectedLoopIds([])
    const records = await getLoopMemoTimeData(memoId, 1, true)
    initLoopMemoCommentMap(records)
  }

  /** 关闭二层抽屉并清理循环记录 */
  const closeDrawer = () => {
    setOpen(false)
    setLoopKeyword('')
    setActiveLoopKeyword('')
    setCommentMap({})
    setTransferSelecting(false)
    setSelectedLoopIds([])
    resetLoopMemoTimeData()
  }

  /** 按关键字搜索循环记录 */
  const searchLoopMemos = async (keyword = loopKeyword) => {
    if (!memoId) return;
    const nextKeyword = keyword.trim(); // 本次生效的循环记录搜索关键字
    setLoopKeyword(nextKeyword)
    setActiveLoopKeyword(nextKeyword)
    resetLoopMemoTimeData()
    setCommentMap({})
    const records = await getLoopMemoTimeData(memoId, 1, true, nextKeyword)
    initLoopMemoCommentMap(records)
  }

  /** 清空循环记录搜索 */
  const clearLoopMemoSearch = () => {
    if (!activeLoopKeyword && !loopKeyword) return;
    void searchLoopMemos('')
  }

  /** 切换循环记录转移选中状态 */
  const toggleTransferLoopItem = (loopItemId?: number) => {
    if (!loopItemId) return;
    setSelectedLoopIds(ids => ids.includes(loopItemId)
      ? ids.filter(id => id !== loopItemId)
      : [...ids, loopItemId]
    )
  }

  /** 取消循环记录转移选择模式 */
  const cancelTransferSelecting = () => {
    setTransferSelecting(false)
    setSelectedLoopIds([])
  }

  /** 关闭二层抽屉并进入主列表选择目标 */
  const startTransferTargetSelecting = () => {
    if (!memoId) return;
    if (!selectedLoopIds.length) return message.warning('请选择循环记录')
    onStartTransfer({sourceMemoId: memoId, loopItemIds: [...selectedLoopIds]})
    closeDrawer()
  }

  /** 加载循环记录评论 */
  const loadLoopMemoComments = async (
    target: MemoLoopItem,
    nextPage = commentMap[target.id ?? 0]?.page ?? 1,
    replace = false
  ) => {
    if (!target?.id) return;
    setCommentMap(map => ({
      ...map,
      [target.id!]: {
        ...(map[target.id!] ?? {}),
        loop: target,
        loading: true,
      }
    }))
    const resp = await selectLoopMemoItemCommentList(target.id, nextPage);
    const result = resp.data
    const records = result?.records ?? []; // 新加载的评论
    if (!resp.success) {
      setCommentMap(map => ({
        ...map,
        [target.id!]: {...(map[target.id!] ?? {}), loop: target, loading: false}
      }))
      return message.error('获取评论失败')
    }
    setCommentMap(map => {
      const current = map[target.id!] ?? {}; // 当前循环记录的评论状态
      return {
        ...map,
        [target.id!]: {
          loop: target,
          records: replace ? records : [...current.records ?? [], ...records],
          page: nextPage + 1,
          total: result?.total ?? records.length,
          hasMore: (result?.current ?? 0) < (result?.pages ?? 0),
          loading: false,
        }
      }
    })
  }

  /** 使用循环记录接口自带的评论预览初始化评论状态 */
  const initLoopMemoCommentMap = (records?: MemoLoopItem[]) => {
    setCommentMap(map => {
      const nextMap = {...map}; // 合并本页循环记录自带的评论预览
      records
        ?.filter(loopMemo => loopMemo?.id)
        .forEach(loopMemo => {
          nextMap[loopMemo.id!] = {
            loop: loopMemo,
            records: loopMemo.comments ?? [],
            page: 2,
            total: loopMemo.commentTotal ?? loopMemo.comments?.length ?? 0,
            hasMore: Boolean(loopMemo.commentHasMore),
            loading: false,
          }
        })
      return nextMap
    })
  }

  /** 渲染循环备忘子项图片缩略图，并让预览从被点击的原图开始 */
  const renderLoopMemoImages = (imgArr: string, previewEnabled = true) => {
    const imageUrls = imgArr.split(',').filter(Boolean); // 循环备忘图片原图地址列表
    if (!imageUrls.length) return null;

    return (
      <Image.PreviewGroup items={imageUrls}>
        <div className="loop-memo-img-list">
          {imageUrls.map(url =>
            <Image
              width={58}
              height={58}
              src={thumbUrl(url)}
              preview={previewEnabled ? {src: url} : false}
              key={url}
            />
          )}
        </div>
      </Image.PreviewGroup>
    )
  }

  /** 渲染循环子项列表底部状态 */
  const renderListFooter = () => {
    if (loopTimeWebLoading) return <div className="loop-memo-footer"><SyncOutlined spin/> 正在加载中</div>;
    if (!memoId) return null;
    if (!loopTimeList.length) return null;
    if (loopTimeTotal <= loopTimeList.length) return <div className="loop-memo-footer">到底了</div>;
    return (
      <Button block size="small" onClick={async () => {
        const records = await getLoopMemoTimeData(memoId, undefined, false, activeLoopKeyword);
        initLoopMemoCommentMap(records)
      }}>
        继续加载
      </Button>
    );
  }

  /** 编辑或新增循环记录评论 */
  const editLoopMemoComment = (loopMemo: MemoLoopItem, comment?: MemoLoopItemComment) => {
    if (!loopMemo?.id || !loopMemo.memoId) return;
    editLoopMemoCommentText = comment?.commentText ?? ''
    editLoopMemoCommentImgArr = comment?.imgArr ?? ''
    modal.confirm({
      title: comment?.id ? '修改循环记录评论' : '新增循环记录评论',
      icon: <CommentOutlined/>,
      content: (
        <LoopMemoCommentEditContent
          comment={comment}
          uploadButton={uploadButton}
          uploadLoopMemoImage={uploadLoopMemoImage}
          previewUploadImage={previewUploadImage}
          onTextChange={text => editLoopMemoCommentText = text}
          onImgArrChange={imgArr => editLoopMemoCommentImgArr = imgArr}
        />
      ),
      onOk: async () => {
        if (hasLoopMemoUploading()) {
          message.warning('图片还在上传中，请稍等')
          throw new Error('图片上传中')
        }
        if (!editLoopMemoCommentText && !editLoopMemoCommentImgArr) {
          message.warning('评论不能为空')
          throw new Error('评论不能为空')
        }
        const resp = comment?.id
          ? await updateLoopMemoItemComment({
            ...comment,
            commentText: editLoopMemoCommentText,
            imgArr: editLoopMemoCommentImgArr || undefined,
          })
          : await addLoopMemoItemComment({
            memoId: loopMemo.memoId,
            loopItemId: loopMemo.id,
            commentText: editLoopMemoCommentText,
            imgArr: editLoopMemoCommentImgArr || undefined,
          })
        if (!resp.success) {
          message.error('保存失败')
          throw new Error('保存失败')
        }
        message.success('保存成功')
        await loadLoopMemoComments(loopMemo, 1, true)
      }
    })
  }

  /** 删除循环记录评论 */
  const deleteLoopMemoComment = (loopMemo: MemoLoopItem, comment: MemoLoopItemComment) => {
    if (!comment.memoId || !comment.loopItemId || !comment.id) return;
    modal.confirm({
      title: '确定要删除评论吗？',
      content: '删除后不可恢复',
      okText: '删除',
      okButtonProps: {danger: true},
      onOk: async () => {
        const resp = await deleteLoopMemoItemComment(comment.memoId!, comment.loopItemId!, comment.id!)
        if (!resp.success) return message.error('删除失败')
        message.success('删除成功')
        await loadLoopMemoComments(loopMemo, 1, true)
      }
    })
  }

  /** 渲染循环记录评论图片 */
  const renderCommentImages = (imgArr: string) => renderLoopMemoImages(imgArr, !transferSelecting)

  return (
    <>
      <Button
        type="link"
        size="small"
        icon={<HistoryOutlined/>}
        className="loop-drawer-trigger"
        onClick={openDrawer}
      >
        循环记录
      </Button>

      <Drawer
        title={
          <div className="loop-memo-title">
            <Space>
              <span>循环记录</span>
              <Tag color="green">{loopTimeTotal || loopTimeList.length} 条</Tag>
            </Space>
            {transferSelecting ?
              <Space size={4}>
                <Button
                  type="link"
                  size="small"
                  disabled={!selectedLoopIds.length}
                  onClick={startTransferTargetSelecting}
                >
                  转移
                </Button>
                <Button type="link" size="small" onClick={cancelTransferSelecting}>
                  取消
                </Button>
              </Space>
              :
              <Button
                type="text"
                size="small"
                className="loop-memo-more-button"
                icon={<MoreOutlined/>}
                title="选择循环记录"
                aria-label="选择循环记录"
                onClick={() => setTransferSelecting(true)}
              />
            }
          </div>
        }
        placement="right"
        size={520}
        open={open}
        onClose={closeDrawer}
        mask
        className="loop-memo-drawer"
      >
        <div className="loop-memo-sticky-head">
          <Typography.Paragraph
            className="loop-memo-main-content"
            ellipsis={{rows: 4, expandable: 'collapsible', symbol: expanded => expanded ? '收起' : '展开'}}
          >
            {memo.content}
          </Typography.Paragraph>
          <Input.Search
            allowClear
            className="loop-memo-search"
            placeholder="搜索循环记录备注"
            value={loopKeyword}
            onChange={event => {
              setLoopKeyword(event.target.value)
              if (!event.target.value) clearLoopMemoSearch()
            }}
            onSearch={value => searchLoopMemos(value)}
          />
        </div>

        <Spin spinning={loopTimeWebLoading && !loopTimeList.length}>
          {!loopTimeWebLoading && !loopTimeList.length ?
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={activeLoopKeyword ? '暂无匹配循环记录' : '暂无循环记录'}
            />
            :
            <div className="loop-memo-record-list">
              {loopTimeList.map((loopMemo, index) => {
                const commentState = loopMemo.id ? commentMap[loopMemo.id] : undefined; // 当前循环记录评论状态
                const commentRecords = commentState?.records ?? []; // 当前循环记录评论列表
                return (
                  <div
                    key={loopMemo.id ?? index}
                    className={`loop-memo-record ${transferSelecting ? 'loop-memo-record-selectable' : ''} ${loopMemo.id && selectedLoopIds.includes(loopMemo.id) ? 'loop-memo-record-selected' : ''}`}
                    onClick={transferSelecting ? () => toggleTransferLoopItem(loopMemo.id) : undefined}
                  >
                    <div className="loop-memo-record-head">
                      <div>
                        <div className="loop-memo-date">{index + 1}：{fDate(loopMemo.memoDate)}</div>
                      </div>
                      {!transferSelecting &&
                        <Space>
                          <Button
                            size="small"
                            icon={<CommentOutlined/>}
                            onClick={() => editLoopMemoComment(loopMemo)}
                          >
                            评论
                          </Button>
                          {loopMemo.loopText &&
                            <Button
                              size="small"
                              onClick={() => copyAddLoopMemo(loopMemo, activeLoopKeyword)}
                            >
                              复制+1
                            </Button>
                          }
                          {loopMemo.loopText &&
                            <Button
                              size="small"
                              onClick={() => copyEditLoopMemo(loopMemo, activeLoopKeyword)}
                            >
                              复制编辑
                            </Button>
                          }
                          <Button
                            size="small"
                            shape="circle"
                            icon={<EditOutlined/>}
                            title="修改"
                            aria-label="修改"
                            onClick={() => loopMemo.id && loopMemo.memoId && updateLoopMemo(loopMemo)}
                          />
                          <Button
                            size="small"
                            shape="circle"
                            icon={<DeleteOutlined/>}
                            title="删除"
                            aria-label="删除"
                            danger
                            onClick={() => loopMemo.id && loopMemo.memoId && deleteLoopMemo(loopMemo.memoId, loopMemo.id)}
                          />
                        </Space>
                      }
                    </div>

                    {loopMemo.loopText && <div className="loop-text loop-memo-text">{loopMemo.loopText}</div>}
                    {loopMemo.imgArr && renderLoopMemoImages(loopMemo.imgArr, !transferSelecting)}
                    {commentRecords.length > 0 &&
                      <div className="loop-memo-comment-list">
                        {commentRecords.map(comment =>
                          <div key={comment.id} className="loop-memo-comment-item">
                            <div className="loop-memo-record-head">
                              <div className="loop-memo-comment-date">{fDate(comment.commentDate)}</div>
                              {!transferSelecting &&
                                <Space>
                                  <Button
                                    size="small"
                                    shape="circle"
                                    icon={<EditOutlined/>}
                                    title="修改"
                                    aria-label="修改"
                                    onClick={() => editLoopMemoComment(loopMemo, comment)}
                                  />
                                  <Button
                                    size="small"
                                    shape="circle"
                                    icon={<DeleteOutlined/>}
                                    title="删除"
                                    aria-label="删除"
                                    danger
                                    onClick={() => deleteLoopMemoComment(loopMemo, comment)}
                                  />
                                </Space>
                              }
                            </div>
                            {comment.commentText && <div className="loop-text loop-memo-text">{comment.commentText}</div>}
                            {comment.imgArr && renderCommentImages(comment.imgArr)}
                          </div>
                        )}
                      </div>
                    }
                    {!transferSelecting && commentState?.hasMore &&
                      <Button
                        block
                        size="small"
                        className="loop-memo-comment-more"
                        onClick={() => loadLoopMemoComments(loopMemo)}
                      >
                        {commentState.loading ? <><SyncOutlined spin/> 加载中</> : '加载更多评论'}
                      </Button>
                    }
                  </div>
                )
              })}
              {renderListFooter()}
            </div>
          }
        </Spin>
      </Drawer>
    </>
  )
}

export default LoopMemoDrawer;
