import {useCallback, useEffect, useRef, useState} from 'react';
import type {ComponentType, Dispatch, MouseEvent, ReactNode, SetStateAction} from 'react';
import {observer} from 'mobx-react-lite'
import {
  BookOutlined,
  ColumnHeightOutlined, ExclamationCircleOutlined,
  PlusOutlined, QuestionCircleFilled, QuestionCircleOutlined,
  SyncOutlined,
  VerticalAlignMiddleOutlined
} from '@ant-design/icons';
import {
  Drawer, Skeleton, Button, Tag,
  Spin, Tooltip, Select, Divider,
  Space, App, DatePicker,
  Switch, Input, TimePicker, Image, Upload, Dropdown
} from 'antd';
import type {UploadFile, UploadProps} from 'antd';

import showOrNot from '@/store/ShowOrNot';
import UserStore from '@/store/UserStore';
import FormModal from '@/pages/MemoDrawer/compontets/FormModal';
import MemoTypeSegmented from '@/pages/MemoDrawer/compontets/MemoTypeSegmented';
import {sortingOptions, tagNameMapper} from '@/store/NoLoginData';
import SortSelect from '@/components/SortSelect';
import SearchBox from '@/components/common/SearchBox';
import {
  addLoopMemoItem,
  createMemoTag,
  deleteLoopMemoItem,
  deleteMemo,
  deleteMemoTag,
  getMemoIncompleteCounts,
  getMemoTags,
  getMemos,
  memoIncompleteCountsToMap,
  selectLoopMemoItemList, transferLoopMemoItems, updateLoopMemoItem, updateMemo, updateMemoTag
} from '@/request/memoApi'
import JWTUtils from '@/utils/JWTUtils';
import '@/pages/MemoDrawer/MemoDrawer.css'
import CommonStore from '@/store/CommonStore';
import dayjs from 'dayjs';
import type {Dayjs} from 'dayjs';
import {uploadImgByJD} from '@/request/toolsRequest';
import LoopMemoDrawer from '@/pages/MemoDrawer/compontets/LoopMemoDrawer';
import LoopMemoEditContent from '@/pages/MemoDrawer/compontets/LoopMemoEditContent';
import MemoListItem from '@/pages/MemoDrawer/compontets/MemoListItem';
import MemoPreviewContent from '@/pages/MemoDrawer/compontets/MemoPreviewContent';
import type IMemo from '@/interface/IMemo';
import type IMemoTag from '@/interface/IMemoTag';
import type ILoopMemoItem from '@/interface/ILoopMemoItem';
import type {
  MemoCompletedFilter,
  MemoCountMap,
  MemoDrawerListItem,
  LoopMemoTransferPayload,
  RenderLoopMemoDrawer,
} from '@/pages/MemoDrawer/types';

declare global {
  interface Window {
    /** 用于完成或+1时是否主动选择日期 */
    ikunSelectDate?: string
    /** 用于完成或+1时是否主动写备注 */
    ikunOkText?: string
  }
}

interface UploadImageResponse {
  /** 上传完成后的原图地址 */
  url?: string
}

interface SortSelectProps {
  /** 当前排序值 */
  value: number
  /** 排序改变回调 */
  onChange: (value: number) => void
  /** 排序选项 */
  options: {value: number, label: string}[]
  /** 是否显示加载态 */
  loading?: boolean
}

interface SearchBoxProps {
  /** 搜索关键字 */
  keyword: string
  /** 修改搜索关键字 */
  setKeyword: Dispatch<SetStateAction<string>>
  /** 刷新列表 */
  sxSj: () => void
  /** 搜索框是否为空 */
  searchEmpty: boolean
  /** 修改搜索框为空状态 */
  setSearchEmpty: Dispatch<SetStateAction<boolean>>
}

const MemoSortSelect = SortSelect as unknown as ComponentType<SortSelectProps>;
const MemoSearchBox = SearchBox as unknown as ComponentType<SearchBoxProps>;

/** 用于完成或+1时是否主动选择日期 */
window.ikunSelectDate = undefined
/** 用于完成或+1时是否主动写备注 */
window.ikunOkText = undefined

let i = 0;                   // 页面刷新次数
let total = -1;              // 初始化待办总数
let orderBy = 1;             // 《表单》默认排序方式
let isQueryOnClick = false; // 防止点太快了
let dates: Dayjs[] = [];              // 未处理的筛选日期
let filterDate = '';         // 筛选日期 格式： 开始时间戳/结束时间戳/0：修改时间 1：创建时间
let filterDateType = 1;     // 筛选日期类型 0：修改时间 1：创建时间
let editLoopMemoText = '';   // 循环备忘项备注修改
let editLoopMemoImgArr = ''; // 循环备忘项图片修改(逗号分隔)
let ikunLoopMemoImgArr = ''; // 循环备忘加一图片(逗号分隔)
let loopMemoUploadingCount = 0; // 循环备忘图片上传中数量
const {msg} = CommonStore

const MemoDrawer = () => {
  const [initLoading, setInitLoading] = useState(true);       // 初始化加载
  const [itemLoading, setItemItemLoading] = useState(false);  // 底部加载
  const [webLoading, setWebLoading] = useState(false);        // 网络加载
  const [refreshTrigger, setRefreshTrigger] = useState(0);    // 刷新触发列表(值无意义，改变即刷新列表数据
  const [, setRefresh] = useState(0);                                 // 刷新触发：单纯驱动非状态变量改变页面
  const [data, setData] = useState<MemoDrawerListItem[]>([]);                         // 待办列表数据
  const [list, setList] = useState<MemoDrawerListItem[]>([]);                         // 待办展示列表
  const [page, setPage] = useState(1);                        // 待办翻页
  const [type, setType] = useState(0);                        // 待办类型
  const [loopTimeList, setLoopTimeList] = useState<ILoopMemoItem[]>([])          // 循环时间列表
  const [loopTimePage, setLoopTimePage] = useState(1);        // 循环时间页数
  const [loopTimeTotal, setLoopTimeTotal] = useState(0);      //循环时间总数
  const [loopTimeWebLoading, setLoopTimeWebLoading] = useState(true); // 循环时间网络加载
  const [unFinishCounts, setUnFinishCounts] = useState<MemoCountMap | null>(null);             // 待办未完成计数
  const [completed, setCompleted] = useState<MemoCompletedFilter>(0);              // 查看待办状态（看未完成的：0,看已完成的：1,看全部的：-1）
  const [formModal, setFormModal] = useState(false);          // 是否显示新增或编辑的模态框。
  const [fModalData, setFModalData] = useState<IMemo | null | undefined>();                     // 设置模态框数据
  const [keyword, setKeyword] = useState('');                   // 搜索关键字
  const [searchEmpty, setSearchEmpty] = useState(true);       // 搜索框为空（搜索框有值没点搜索，是就是删除图标变红）
  const [lastActionId, setLastActionId] = useState<number>();  // 最后操作的备忘 ID
  const [memoTags, setMemoTags] = useState<IMemoTag[]>([]);    // 当前类型标签列表
  const [activeTagId, setActiveTagId] = useState<number | null>(null); // 当前筛选标签ID
  const [loopTransfer, setLoopTransfer] = useState<LoopMemoTransferPayload | null>(null); // 循环记录转移目标选择状态

  const loadMoreRef = useRef<HTMLDivElement | null>(null);                // 自动翻页触底监听元素
  const keywordRef = useRef(keyword);              // 当前搜索关键字引用
  const itemLoadingRef = useRef(false);            // 自动翻页请求锁
  const autoLoadFailedRef = useRef(false);         // 自动翻页失败暂停标记
  const initNoticeShownRef = useRef(false);        // 首次紧急备忘提醒是否已展示
  const {notification, modal} = App.useApp();
  const {jwt} = UserStore;                         // 当前登录凭证
  const {memoDrawerShow} = showOrNot;              // 备忘抽屉是否显示

  const sxYm = () => setRefresh(++i)        // 刷新页面
  const sxSj = () => setRefreshTrigger(++i) // 刷新数据列表
  const refreshMemoTags = useCallback(async () => {
    if (JWTUtils.isExpired()) return;
    const resp = await getMemoTags(type);
    setMemoTags(resp?.data ?? []);
  }, [type])

  /** 上传图片按钮 */
  const uploadButton = (
    <button type="button" style={{border: 0, background: 'none', cursor: 'pointer'}}>
      <PlusOutlined/>
      <div style={{marginTop: 8}}>上传</div>
    </button>
  );

  /**
   * 上传图片到图床（桌面端）
   * @author Codex
   * @since 2026/5/9
   */
  const uploadToJD = async (file: File) => {
    if (file.size > 1024 * 1024 * 6) msg.info('图片超6M,自动压缩中...')
    const result = await uploadImgByJD(file);
    if (!result.success || !result.data?.url) {
      msg.error(result.message ?? '上传失败')
      throw new Error('上传失败')
    }
    return result.data.url
  }

  /** 循环备忘图片上传请求 */
  const uploadLoopMemoImage: UploadProps<UploadImageResponse>['customRequest'] = async ({file, onSuccess, onError}) => {
    loopMemoUploadingCount++
    try {
      const url = await uploadToJD(file as File);
      onSuccess?.({url});
    } catch (error) {
      onError?.(error as Error);
    } finally {
      loopMemoUploadingCount--
    }
  }

  /** 读取上传列表中的图片地址 */
  const getUploadImageUrl = (fileItem: UploadFile<UploadImageResponse>) =>
    fileItem.response?.url || fileItem.url

  /** 预览上传图片（避免浏览器打开空白窗口） */
  const previewUploadImage = (file: UploadFile<UploadImageResponse>) => {
    const previewUrl = file.url || file.response?.url || file.thumbUrl;
    if (!previewUrl) return msg.info('图片上传中，暂时无法预览');
    modal.info({
      title: '图片预览',
      icon: null,
      width: '70vw',
      centered: true,
      mask: {closable: true},
      okText: '关闭',
      content:
        <div style={{textAlign: 'center'}}>
          <Image
            src={previewUrl}
            preview={false}
            style={{maxWidth: '100%', maxHeight: '60vh', objectFit: 'contain'}}
          />
        </div>
    })
  }

  /** 同步当前搜索关键字给请求逻辑使用 */
  useEffect(() => {
    keywordRef.current = keyword
  }, [keyword])

  useEffect(() => {
    if (!JWTUtils.isExpired()) (async () => {
      setFModalData(null)     // 模态框数据重置 null和 undefined 来回切换
      setWebLoading(true)     // 网络加载
      setUnFinishCounts(null) // 待办未完成计数重置
      setList([]);            // 待办列表重置
      setPage(1)              // 待办翻页重置
      autoLoadFailedRef.current = false; // 自动翻页失败状态重置
      total = -1;                   // 待办总数重置
      // 使用 axios 发起请求 获取又一次初始化待办列表
      const [resp, countResp] = await Promise.all([
        getMemos({type, page: 1, completed, orderBy, keyword: keywordRef.current, dateRange: filterDate, tagId: activeTagId}),
        completed === 0 ? getMemoIncompleteCounts(type) : Promise.resolve(undefined)
      ]);
      if (!(resp?.code === 1)) {
        setInitLoading(false);
        setWebLoading(false);
        return;
      }
      const memoPage = resp.data; // 备忘分页数据
      const memoRecords = memoPage?.records ?? []; // 当前页备忘列表
      const currentTotal = memoPage?.total ?? memoRecords.length; // 当前页签总数
      const incompleteCounts: MemoCountMap | null = completed === 0 ? {
        ...memoIncompleteCountsToMap(countResp?.data),
        [type]: currentTotal
      } : null; // 类型未完成数量
      setData(memoRecords);
      setList(memoRecords);

      if (completed === 0) setUnFinishCounts(incompleteCounts)
      // 如果刚打开时有未完成的紧急备忘 而且抽屉没打开 就弹出提醒
      if (completed === 0 && !initNoticeShownRef.current && !memoDrawerShow && (incompleteCounts?.['3'] ?? 0) > 0 && total === -1) {
        initNoticeShownRef.current = true
        const key = `open${Date.now()}`;
        notification.info({
          title: '有未完成的紧急备忘',
          description: '是否要打开查看',
          key,
          actions: (
            <Space>
              <Button type="link" size="small" onClick={() => notification.destroy(key)}>
                不看了
              </Button>
              <Button type="primary" size="small" onClick={() => {
                notification.destroy(key)
                setType(3)
                showOrNot.setMemoDrawerShow(true)
              }}>
                打开看看
              </Button>
            </Space>
          )
        })

      }
      total = currentTotal;
      setInitLoading(false);
      setWebLoading(false);
    })();

  }, [jwt, type, completed, refreshTrigger, memoDrawerShow, notification, activeTagId]);

  /** 类型切换时加载标签 */
  useEffect(() => {
    refreshMemoTags();
  }, [refreshMemoTags])

  /** 点击加载更多数据触发 */
  const onLoadMore = useCallback(async () => {
    if (itemLoadingRef.current) return;
    if (list.length >= total) return;
    itemLoadingRef.current = true
    setItemItemLoading(true);
    const oldData = data; // 请求失败时恢复原列表
    setList(
      data.concat(
        [...new Array(2)].map(() => ({
          loading: true,
          content: undefined,
          createTime: undefined,
        })),
      ),
    );

    try {
      // 使用 axios 发起请求
      const {data: respData} = await getMemos({
        type,
        page: page + 1,
        completed,
        orderBy,
        keyword: keywordRef.current,
        dateRange: filterDate,
        tagId: activeTagId
      });
      if (!respData?.records) {      // 保持代码的健壮性
        autoLoadFailedRef.current = true
        setList(oldData)
        return;
      }
      autoLoadFailedRef.current = false
      // 结合旧数据和新数据
      const newData = data.concat(respData.records);
      setData(newData);
      setList(newData);
      setPage(page + 1);      // 异步放前面也没用
    } finally {
      itemLoadingRef.current = false
      setItemItemLoading(false);
    }

  }, [activeTagId, completed, data, list.length, page, type]);

  /** 触底自动加载下一页 */
  useEffect(() => {
    const loadMoreElement = loadMoreRef.current;  // 底部触发器元素
    if (!loadMoreElement || initLoading || itemLoading || JWTUtils.isExpired() || !memoDrawerShow) return;
    if (autoLoadFailedRef.current) return;
    if (list.length >= total) return;

    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) onLoadMore();
    }, {rootMargin: '120px'});

    observer.observe(loadMoreElement);
    return () => observer.disconnect();
  }, [initLoading, itemLoading, list.length, memoDrawerShow, jwt, onLoadMore])


  /** 判断 显示《加载更多》《到底了》还是什么都不显示 */
  const loadMore: ReactNode =
    !initLoading && !itemLoading && autoLoadFailedRef.current ? (
      <div className="loadMore">加载失败，点击刷新后重试</div>
    ) : !initLoading && !itemLoading && list.length < total ? (
      <div className="loadMore" ref={loadMoreRef}>
        下滑自动加载更多...
      </div>
    ) : !itemLoading && list.length > 0 ? <Divider className="loadMore" plain>🥺到底啦🐾</Divider> : null;

  const memoTypeCounts = completed === 0 ? { // 列表顶部备忘类型未完成条数
    ...(unFinishCounts ?? {}),
    [type]: total > 0 ? total : unFinishCounts?.[type],
  } : undefined;

  /** 新增当前类型标签 */
  const addMemoTag = () => {
    let tagName = ''; // 新标签名称
    modal.confirm({
      title: '新增标签',
      content: <Input placeholder="请输入标签名称" maxLength={32} onChange={e => tagName = e.target.value}/>,
      okText: '新增',
      cancelText: '取消',
      onOk: async () => {
        if (!tagName.trim()) {
          msg.error('标签名称不能为空')
          throw new Error('标签名称不能为空')
        }
        const id = await createMemoTag({itemType: type, name: tagName.trim()})
        if (id) await refreshMemoTags()
      }
    })
  }

  /** 修改当前类型标签 */
  const editMemoTag = (memoTag: IMemoTag) => {
    let tagName = memoTag.name ?? ''; // 修改后的标签名称
    modal.confirm({
      title: '编辑标签',
      content: <Input defaultValue={memoTag.name} maxLength={32} onChange={e => tagName = e.target.value}/>,
      okText: '保存',
      cancelText: '取消',
      onOk: async () => {
        if (!tagName.trim() || tagName.trim() === memoTag.name) return;
        const success = await updateMemoTag({id: memoTag.id, name: tagName.trim()})
        if (success) {
          await refreshMemoTags()
          sxSj()
        }
      }
    })
  }

  /** 删除当前类型标签 */
  const removeMemoTag = (memoTag: IMemoTag) => {
    modal.confirm({
      title: `删除标签「${memoTag.name}」？`,
      icon: <ExclamationCircleOutlined/>,
      content: '删除后会从已绑定的备忘中移除该标签，备忘本身不会删除。',
      okText: '删除',
      okButtonProps: {danger: true},
      cancelText: '取消',
      onOk: async () => {
        if (!memoTag.id) return;
        const success = await deleteMemoTag(memoTag.id)
        if (success) {
          if (activeTagId === memoTag.id) setActiveTagId(null)
          await refreshMemoTags()
          sxSj()
        }
      }
    })
  }

  /** 当前类型标签筛选行 */
  const memoTagFilter =
    <div className="memo-tag-filter">
      {memoTags.map(memoTag =>
        <Dropdown
          key={memoTag.id}
          trigger={['contextMenu']}
          menu={{
            items: [
              {key: 'edit', label: '编辑标签'},
              {key: 'delete', label: '删除标签', danger: true},
            ],
            onClick: ({key}) => key === 'edit' ? editMemoTag(memoTag) : removeMemoTag(memoTag)
          }}
        >
          <Tag
            className={`pointer memo-type-tag ${activeTagId === memoTag.id ? 'memo-type-tag-active' : ''}`}
            color={activeTagId === memoTag.id ? 'green' : 'default'}
            onClick={() => setActiveTagId(activeTagId === memoTag.id ? null : memoTag.id ?? null)}
          >
            {memoTag.name}
          </Tag>
        </Dropdown>
      )}
      <Tooltip title="新增当前类型标签">
        <Button size="small" shape="circle" icon={<PlusOutlined/>} onClick={addMemoTag}/>
      </Tooltip>
    </div>

  /**
   * 删除循环备忘子项
   * @author Yc
   * @since 2025/5/18 18:23
   */
  const deleteLoopMemo = (memoId: number, id: number) =>
    modal.confirm({
      title: '确定要删除吗？',
      icon: <ExclamationCircleOutlined/>,
      content: '删除后不可恢复',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        const resp = await deleteLoopMemoItem(memoId, id)
        if (!resp.success) return msg.error('删除失败')
        msg.success('删除成功')

        const memos = list.map(memo => memo.id === memoId
          ? {...memo, numberOfRecurrences: (memo.numberOfRecurrences ?? 1) - 1}
          : memo
        );
        setList(memos);
        setLoopTimeList(list => list.filter(item => item.id !== id))
        setLoopTimeTotal(total => Math.max(0, total - 1))
      }
    })

  const updateLoopMemo = (loopMemo: ILoopMemoItem) => {
    editLoopMemoText = loopMemo.loopText ?? ''
    editLoopMemoImgArr = loopMemo.imgArr ?? ''
    loopMemoUploadingCount = 0
    modal.confirm({
      title: '修改循环备忘子项备注',
      icon: <ExclamationCircleOutlined/>,
      content: (
        <LoopMemoEditContent
          loopMemo={loopMemo}
          uploadButton={uploadButton}
          uploadLoopMemoImage={uploadLoopMemoImage}
          previewUploadImage={previewUploadImage}
          onTextChange={text => editLoopMemoText = text}
          onImgArrChange={imgArr => editLoopMemoImgArr = imgArr}
        />
      ),
      onOk: async () => {
        if (loopMemoUploadingCount > 0) {
          msg.warning('图片还在上传中，请稍等')
          throw new Error('图片上传中')
        }
        const resp = await updateLoopMemoItem({
          memoId: loopMemo.memoId,
          id: loopMemo.id,
          loopText: editLoopMemoText,
          imgArr: editLoopMemoImgArr || undefined
        })
        if (resp.success) {
          msg.success('修改成功')
          setLoopTimeList(list => list.map(item => item.id === loopMemo.id ? {
            ...item,
            loopText: editLoopMemoText,
            imgArr: editLoopMemoImgArr,
            updateTime: new Date().toLocaleString()
          } : item))
        }
        else msg.error('修改失败')
      }
    })
  }

  /** 重置循环备忘录时间列表 */
  const resetLoopMemoTimeData = () => {
    setLoopTimeTotal(0)
    setLoopTimeList([])
    setLoopTimePage(1)
    setLoopTimeWebLoading(false)
  }

  /** 开始在主列表中选择循环记录转移目标 */
  const startLoopMemoTransfer = (payload: LoopMemoTransferPayload) => {
    setLoopTransfer(payload)
    setLastActionId(payload.sourceMemoId)
    msg.info('请选择转移目标')
  }

  /** 取消循环记录转移目标选择 */
  const cancelLoopMemoTransfer = () => {
    setLoopTransfer(null)
    msg.info('已取消转移')
  }

  /** 把转移返回的循环次数同步到当前列表 */
  const syncLoopTransferCounts = (sourceMemoId: number, targetMemoId: number, sourceCount?: number, targetCount?: number) => {
    const syncCounts = (memos: MemoDrawerListItem[]) => memos.map(memo => {
      if (memo.id === sourceMemoId) return {...memo, numberOfRecurrences: sourceCount ?? memo.numberOfRecurrences}
      if (memo.id === targetMemoId) return {...memo, numberOfRecurrences: targetCount ?? memo.numberOfRecurrences}
      return memo
    }); // 转移后本地同步循环次数
    setData(syncCounts)
    setList(syncCounts)
  }

  /** 确认并执行循环记录转移 */
  const confirmLoopMemoTransfer = (targetMemo: MemoDrawerListItem) => {
    if (!loopTransfer || !targetMemo.id) return;
    if (targetMemo.itemType !== 1) return msg.warning('只能转移到循环备忘')
    if (targetMemo.id === loopTransfer.sourceMemoId) return msg.warning('不能转移到原循环备忘')
    modal.confirm({
      title: '是否确定转移？',
      content: `将 ${loopTransfer.loopItemIds.length} 条循环记录转移到该循环备忘。`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        const resp = await transferLoopMemoItems({
          sourceMemoId: loopTransfer.sourceMemoId,
          targetMemoId: targetMemo.id!,
          loopItemIds: loopTransfer.loopItemIds,
        })
        if (!resp.success) {
          msg.error(resp.message ?? '转移失败')
          throw new Error('转移失败')
        }
        const result = resp.data; // 转移后两边最新循环次数
        syncLoopTransferCounts(
          result?.sourceMemoId ?? loopTransfer.sourceMemoId,
          result?.targetMemoId ?? targetMemo.id!,
          result?.sourceNumberOfRecurrences,
          result?.targetNumberOfRecurrences
        )
        setLoopTransfer(null)
        resetLoopMemoTimeData()
        msg.success('转移成功')
        sxSj()
      }
    })
  }

  /** 渲染循环备忘录时间二层抽屉 */
  const renderLoopMemoDrawer: RenderLoopMemoDrawer = memo => memo?.id &&
    <LoopMemoDrawer
      memo={memo}
      loopTimeList={loopTimeList}
      loopTimeTotal={loopTimeTotal}
      loopTimeWebLoading={loopTimeWebLoading}
      getLoopMemoTimeData={getLoopMemoTimeData}
      resetLoopMemoTimeData={resetLoopMemoTimeData}
      updateLoopMemo={updateLoopMemo}
      deleteLoopMemo={deleteLoopMemo}
      copyAddLoopMemo={copyAddLoopMemo}
      copyEditLoopMemo={copyEditLoopMemo}
      uploadButton={uploadButton}
      uploadLoopMemoImage={uploadLoopMemoImage}
      previewUploadImage={previewUploadImage}
      hasLoopMemoUploading={() => loopMemoUploadingCount > 0}
      onStartTransfer={startLoopMemoTransfer}
    />

  // 获取循环备忘录时间列表
  const getLoopMemoTimeData = async (id: number, nextPage = loopTimePage, replace = false, loopKeyword = '') => {
    setLoopTimeWebLoading(true)
    const resp = await selectLoopMemoItemList(id, nextPage, loopKeyword);
    setLoopTimeWebLoading(false)
    const result = resp.data
    const records = result?.records ?? []; // 新加载的循环子项
    if (resp.success) {
      setLoopTimeList(item => replace ? records : [...item, ...records])
      setLoopTimePage(nextPage + 1)     // 页码增加
      setLoopTimeTotal(result?.total ?? records.length)
    }
    return resp.success ? records : []
  }

  /** 刷新当前循环备忘录时间列表 */
  const refreshLoopMemoTimeData = async (memoId: number, loopKeyword = '') => {
    resetLoopMemoTimeData()
    await getLoopMemoTimeData(memoId, 1, true, loopKeyword)
  }

  /** 本地增加循环次数，避免刷新第一层列表导致二层抽屉关闭 */
  const increaseLoopMemoCount = (memoId: number) => {
    const addCount = (memos: MemoDrawerListItem[]) => memos.map(memo => memo.id === memoId
      ? {...memo, numberOfRecurrences: (memo.numberOfRecurrences ?? 0) + 1}
      : memo
    ); // 循环次数本地更新函数
    setData(addCount)
    setList(addCount)
  }

  /** 完成或加1时 可以选择日期 */
  const selectDate = (text: '完成' | '加一', content?: string, defaultText = '') => {
    setTimeout(() => {
      const memoRemarkInput = document.querySelector('#备注输入框'); // 完成或加一备注输入框
      if (memoRemarkInput instanceof HTMLTextAreaElement) {
        memoRemarkInput.focus()
        memoRemarkInput.selectionStart = memoRemarkInput.value.length
        memoRemarkInput.selectionEnd = memoRemarkInput.value.length
      }
      else if (memoRemarkInput instanceof HTMLElement) memoRemarkInput.focus()
    }, 100)
    return (
      <div id="完成或加一弹窗" style={{display: 'flex', flexDirection: 'column', gap: 12}}>
        <div className="memoCompleteOrAdd1Text" id="内容复现框">
          {content}
        </div>

        <div>
          <div>
            指定{text}时间：
            <Tooltip title="非必填,不填默认当前时间。填日期不填时间，则时间为空(0)">
              <QuestionCircleOutlined/>
            </Tooltip>
          </div>
          <DatePicker
            allowClear
            size="small"
            style={{width: '50%'}}
            minDate={dayjs().subtract(60, 'days')}
            maxDate={dayjs()}
            onChange={(_, dateStr) => {
              const selectedDate = Array.isArray(dateStr) ? dateStr[0] : dateStr; // 指定日期文本
              window.ikunSelectDate = selectedDate ? selectedDate + ' 00:00:00' : undefined
              const okTimeElement = window.document.querySelector('#okTimePicker');
              if (okTimeElement instanceof HTMLElement) okTimeElement.style.display = dateStr ? 'inline-block' : 'none'
            }}
          />
          <span id="okTimePicker" style={{display: 'none', marginLeft: 5}}>
          <TimePicker
            size="small"
            format="HH:mm"
            showSecond={false}
            onChange={(_time, ts) => {
              if (!window.ikunSelectDate) return CommonStore.msg.error('请选择时间');
              const selectedTime = Array.isArray(ts) ? ts[0] : ts; // 指定时间文本
              const dateTimeArr = window.ikunSelectDate.split(' ');
              dateTimeArr[1] = selectedTime ? `${selectedTime}:00` : '00:00:00';
              window.ikunSelectDate = dateTimeArr.join(' ');
            }}
          />
        </span>
        </div>

        <div id="备注输入块" style={{marginBottom: 12}}>
          {text}备注：
          <Input.TextArea
            id="备注输入框"
            allowClear
            count={{show: true, max: 99}}
            defaultValue={defaultText}
            onChange={e => window.ikunOkText = e.target.value}
          />
        </div>
        {text === '加一' &&
          <div id="加一上传图片区" style={{marginBottom: 12}}>
            上传图片：
            <Upload
              listType="picture-card"
              multiple
              maxCount={3}
              customRequest={uploadLoopMemoImage}
              onChange={({fileList}) => {
                ikunLoopMemoImgArr = fileList
                  .map(fileItem => getUploadImageUrl(fileItem))
                  .filter(Boolean)
                  .join(',')
              }}
              onPreview={previewUploadImage}
            >
              {uploadButton}
            </Upload>
          </div>
        }
      </div>
    )
  }

  /** 打开循环备忘加一弹窗 */
  const openAddLoopMemoModal = (
    memoId: number,
    content?: string,
    defaultLoopText = '',
    onSuccess?: () => void | Promise<void>,
    refreshMemoList = true
  ) => {
    window.ikunSelectDate = undefined
    window.ikunOkText = defaultLoopText || undefined
    ikunLoopMemoImgArr = ''
    loopMemoUploadingCount = 0
    return modal.confirm({
      title: '确定加一吗?',
      icon: <QuestionCircleFilled/>,
      content: selectDate('加一', content, defaultLoopText),
      mask: {closable: true},     // 点遮罩可以关闭
      onOk: async () => {
        if (loopMemoUploadingCount > 0) {
          msg.warning('图片还在上传中，请稍等')
          throw new Error('图片上传中')
        }
        const result = await addLoopMemoItem({
          memoId,
          memoDate: window.ikunSelectDate,
          loopText: window.ikunOkText,
          imgArr: ikunLoopMemoImgArr || undefined
        });
        if (!result.success) {
          msg.error('加一失败')
          return
        }
        msg.success('成功+1')
        if (refreshMemoList) sxSj()
        else increaseLoopMemoCount(memoId)
        await onSuccess?.()
      }
    })
  }

  /** 复制循环子项备注并直接 +1 */
  const copyAddLoopMemo = async (loopMemo: ILoopMemoItem, loopKeyword = '') => {
    if (!loopMemo.memoId) return;
    setLastActionId(loopMemo.memoId)
    const result = await addLoopMemoItem({
      memoId: loopMemo.memoId,
      loopText: loopMemo.loopText || undefined
    });
    if (!result.success) {
      msg.error('加一失败')
      return
    }
    msg.success('成功+1')
    increaseLoopMemoCount(loopMemo.memoId)
    await refreshLoopMemoTimeData(loopMemo.memoId, loopKeyword)
  }

  /** 复制循环子项备注后打开编辑加一弹窗 */
  const copyEditLoopMemo = (loopMemo: ILoopMemoItem, loopKeyword = '') => {
    if (!loopMemo.memoId) return;
    setLastActionId(loopMemo.memoId)
    const memoObj = list.find(item => item.id === loopMemo.memoId); // 当前循环备忘主项
    openAddLoopMemoModal(
      loopMemo.memoId,
      memoObj?.content,
      loopMemo.loopText ?? '',
      () => refreshLoopMemoTimeData(loopMemo.memoId!, loopKeyword),
      false
    )
  }

  /** 处理待办列表的操作 */
  const listHandleAction = async (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const itemEl = target.closest('[data-id]'); // 当前点击命中的备忘项
    const actionEl = target.closest('[data-action]');
    const id = itemEl?.getAttribute('data-id') ?? actionEl?.closest('[data-id]')?.getAttribute('data-id');
    const parsedId = Number(id); // 当前操作的备忘 ID
    const itemObj = list.find(item => item.id === parsedId);

    if (id && itemObj) setLastActionId(parsedId)
    if (loopTransfer) {
      if (itemObj) confirmLoopMemoTransfer(itemObj)
      return;
    }
    if (!(actionEl instanceof HTMLElement)) return;

    const action = actionEl.getAttribute('data-action');
    const actionTrigger = actionEl.getAttribute('data-action-trigger'); // 当前动作指定的触发方式
    const confirmAction = Array.from(actionEl.classList).some(className => className.startsWith('confirm-'))  // 防止快速重复点

    if (!action || !id || !itemObj) return;
    if (actionTrigger && actionTrigger !== event.type) return;
    // 防止点太快了
    if (isQueryOnClick && confirmAction) return // message.warning('哇，你点的好快呀👍');
    if (confirmAction) {
      isQueryOnClick = true
      window.setTimeout(() => isQueryOnClick = false, 1000)
    }

    const finishMemo = (func?: () => void) => {
      window.ikunSelectDate = undefined
      window.ikunOkText = undefined
      return modal.confirm({
        mask: {closable: true},     // 点遮罩可以关闭
        title: `确定${itemObj.completed ? '取消' : ''}完成?`,
        icon: <QuestionCircleFilled/>,
        content: itemObj.completed ? '' : selectDate('完成', itemObj.content),
        onOk: async () => {
          const finishResponse = await updateMemo({
            id: parsedId,
            completed: itemObj.completed ? 0 : 1,
            updateTime: window.ikunSelectDate,
            okText: itemObj.completed ? '' : window.ikunOkText,
          })
          if (finishResponse) {
            if (func) func()    // 执行传入方法（关闭查看窗口)
            sxSj()
          }
        }
      })
    }

    const actionObj: Record<string, () => unknown> = {
      see: () => {
        // 双击正文或单击查看按钮都可以查看
        if (event.type === 'dblclick' || actionTrigger === 'click') {
          const seeModel = modal.confirm({
            title: '查看备忘',
            mask: {closable: true},
            closable: true,
            width: '80vw',
            style: {top: '5vh'},
            icon: <BookOutlined/>,
            content: <MemoPreviewContent content={itemObj.content ?? ''} imgArr={itemObj.imgArr}/>,
          })
          seeModel.update({ // 添加按钮分开写是因为 seeModel直接写会没初始化完成 导致没发关闭
            footer:
              <div style={{display: 'flex', justifyContent: 'flex-end', gap: 5, position: 'relative', top: 9}}>
                <Button
                  onClick={() => finishMemo(seeModel.destroy)}>{`${itemObj.completed ? '取消' : ''}完成`}</Button>
                <Button onClick={() => {
                  seeModel.destroy()
                  setFModalData(itemObj)
                  setFormModal(true)
                }}>编辑</Button>
                <Button type="primary" onClick={seeModel.destroy}>关闭</Button>
              </div>
          })
        }
      },
      edit: () => {
        setFModalData(itemObj)
        setFormModal(true)
      },
      finish: () => finishMemo(),
      delete: async () => {
        return modal.confirm({
          mask: {closable: true},
          title: '确定删除?',
          icon: <QuestionCircleFilled/>,
          content: itemObj.content,
          okText: '删除',
          okButtonProps: {danger: true},
          onOk: async () => {
            setWebLoading(true)
            const deleteResponse = await deleteMemo(parsedId)
            if (deleteResponse) sxSj()
            setWebLoading(false)
          }
        })
      },
      addOne: () => {
        return openAddLoopMemoModal(parsedId, itemObj.content)
      },
    }
    actionObj[action]?.()
  }

  /**
   * 设置是否展开备忘录内容
   * @param {boolean} b 是否展开
   * @author 𝓒𝓱𝓮𝓷𝓖𝓾𝓪𝓷𝓰𝓛𝓸𝓷𝓰
   * @since 2024/7/6 16:52
   */
  const setOpenMemoText = (b: boolean) => {
    const label = b ? '展开' : '收起'
    document.querySelectorAll(`[aria-label="${label}"]`).forEach(item => {
      if (item instanceof HTMLElement) item.click()
    })
  };

  /**
   * 筛选日期
   * @author 𝓒𝓱𝓮𝓷𝓖𝓾𝓪𝓷𝓰𝓛𝓸𝓷𝓰
   * @since 2024/8/8 11:49
   */
  const handleFilterDate = () => {
    if (dates.length === 0 && !filterDate) return;  // 如果本来就没有日期筛选条件，现在给的日期数组又是空的，那就不用管
    if (dates.length === 0) {
      filterDate = ''
      sxSj()
    } else if (dates.length === 2) {
      const newFilterDate = `${dates[0].valueOf()}/${dates[1].endOf('day').valueOf()}/${filterDateType}`
      if (newFilterDate !== filterDate) {
        filterDate = newFilterDate
        sxSj()
      }
    }
  }

  return (
    <Drawer
      placement="right"
      onClose={() => showOrNot.setMemoDrawerShow(false)}
      open={showOrNot.memoDrawerShow}
      style={{opacity: 0.8}}
      size={700}
      closeIcon={false}
      title={JWTUtils.isExpired() ? '备忘录' :
        <>
          <Spin spinning={webLoading} indicator={<></>}>
            <div style={{marginBottom: 8}}>
              {/*新增和编辑表单*/}
              <FormModal
                isOpen={formModal}
                setOpen={setFormModal}
                data={fModalData}
                reList={sxSj}
                currentMemoType={type}
                currentMemoTags={memoTags}
              />

              <Tooltip title="刷新当前待办" mouseEnterDelay={0.6}>
                <SyncOutlined className="refresh" spin={webLoading} onClick={sxSj}/>
              </Tooltip>
              备忘录

              {/* 添加按钮 */}
              <Tooltip title="添加一个待办" mouseEnterDelay={1}>
                <Button
                  size="small"
                  className="addItemButton"
                  icon={<PlusOutlined/>}
                  onClick={() => {
                    setFModalData(undefined)
                    setFormModal(true)
                  }}
                />
              </Tooltip>

              <Select                 /*下拉框看《待办状态》*/
                size="small"
                value={completed}
                style={{width: '6em', marginLeft: 5}}
                onChange={(value: MemoCompletedFilter) => setCompleted(value)}
                options={[
                  {label: '未完成', value: 0},
                  {label: '已完成', value: 1},
                  {label: '全部', value: -1}
                ]}
              />

              <MemoSortSelect         /*自己搞的《排序下拉框》*/
                value={orderBy}
                onChange={(value: number) => {
                  orderBy = value
                  sxSj()
                }}
                options={sortingOptions}
                loading={webLoading}
              />

              {/*————日期筛选————*/}
              <DatePicker.RangePicker
                size="small"
                onOpenChange={open => !open && handleFilterDate()}  // 关闭日期选择器时触发
                onChange={dateArr => {                              // 改变日期触发记录它
                  dates = (dateArr?.filter(Boolean) ?? []) as Dayjs[]
                  if (!dateArr && filterDate) handleFilterDate()    // 清除了日期，但还有筛选条件，就触发筛选列表
                }}
                renderExtraFooter={() =>
                  <div className="flex-center m5 memo-dateRangeSwitch">
                    <Switch
                      checkedChildren="创建时间"
                      unCheckedChildren="修改时间"
                      checked={Boolean(filterDateType)}
                      onClick={checked => {
                        filterDateType = checked ? 1 : 0
                        sxYm()
                      }}
                    />
                  </div>}
              />
              &nbsp;&nbsp;

              {/*展开文本*/}
              <Tooltip title="展开文本，对全部长备忘录的展开">
                <Button
                  size="small"
                  shape="circle"
                  icon={<ColumnHeightOutlined/>}
                  onClick={() => setOpenMemoText(true)}
                />
                {' '}
              </Tooltip>

              {/*收起文本*/}
              <Tooltip title="收起文本，对全部长备忘录的收起">
                <Button
                  size="small"
                  shape="circle"
                  icon={<VerticalAlignMiddleOutlined/>}
                  onClick={() => setOpenMemoText(false)}
                />
              </Tooltip>

            </div>
            <div className="memo-category-nav">
              <MemoTypeSegmented
                size="large"
                block
                value={type}
                counts={memoTypeCounts}
                onChange={(nextType) => {
                  setSearchEmpty(true)    // 搜索框为空重置
                  setKeyword('')          // 搜索关键字重置
                  setActiveTagId(null)     // 切换类型时清空标签筛选
                  setType(nextType)
                }}
              />
            </div>
            {memoTagFilter}
          </Spin>
        </>
      }
      /* 底部搜索框*/
      footer={!JWTUtils.isExpired() &&
        <MemoSearchBox
          keyword={keyword}
          setKeyword={setKeyword}
          sxSj={sxSj}
          searchEmpty={searchEmpty}
          setSearchEmpty={setSearchEmpty}
        />
      }
    >
      <Spin spinning={webLoading} description={'正在加载' + (tagNameMapper as Record<number, string>)[type] + '待办'}>
        {UserStore.jwt ?
          <div
            onClick={listHandleAction} // 在这里设置事件监听器
            onDoubleClick={listHandleAction} // 在这里设置事件监听器
            className="demo-loadmore-list memo-list"
          >
            {loopTransfer &&
              <div className="memo-transfer-floating-tip">
                <span>请选择转移目标</span>
                <Button type="link" size="small" onClick={cancelLoopMemoTransfer}>取消</Button>
              </div>
            }
            {list.map((memo, index) =>
              <MemoListItem
                key={memo.id ?? `loading-${index}`}
                memo={memo}
                keyword={keyword}
                searchEmpty={searchEmpty}
                renderLoopMemoDrawer={renderLoopMemoDrawer}
                lastAction={memo.id === lastActionId}
              />
            )}
            {loadMore || null}
          </div>
          :
          <div className="loadMore" onClick={() => UserStore.setOpenModal(true)}>
            <Divider plain>🥺<Button type="link">请先登录</Button>🐾</Divider>

            <Skeleton/>
            <Skeleton/>
            <Skeleton/>
          </div>
        }
      </Spin>
    </Drawer>

  )
}

const ObservedMemoDrawer = observer(MemoDrawer);

export default ObservedMemoDrawer
