import React, {useEffect, useRef, useState} from 'react'
import {
  InfiniteScroll, List, Popup, SwipeAction, Toast,
  Button, TextArea, Dialog, PullToRefresh,
  SearchBar, Badge, Ellipsis, Dropdown,
  Space, ImageViewer, ImageUploader, Image, Input, Radio, Tag
} from 'antd-mobile'
import {
  addLoopMemoItem, addMemo,
  addLoopMemoItemComment,
  createMemoTag,
  deleteLoopMemoItemComment,
  deleteLoopMemoItem,
  deleteMemo,
  deleteMemoTag,
  getMemoIncompleteCounts,
  getMemoTags,
  getMemos,
  memoIncompleteCountsToMap,
  selectLoopMemoItemCommentList,
  selectLoopMemoItemList,
  transferLoopMemoItems,
  updateLoopMemoItemComment,
  updateLoopMemoItem, updateMemo,
  updateMemoTag
} from "@/request/memoApi";
import {finishName, columns, leftActions, rightActions, orderByName} from "@/pages/Mobile/shared/data";
import {sortingOptions} from "@/store/NoLoginData";
import HighlightKeyword from "@/utils/HighlightKeyword";
import {CloseOutlined, ExclamationCircleFilled, FullscreenExitOutlined, FullscreenOutlined} from "@ant-design/icons";
import styles from '@/pages/Mobile/styles/mobile.module.css'
import {fDate} from "@/utils/DateUtils";
import {uploadImgByJD} from "@/request/toolsRequest";
import {thumbUrl} from "@/utils/urlUtils.js";
import MemoDetailPopup from './components/MemoDetailPopup'
import MemoEditPopup from './components/MemoEditPopup'
import MemoDatePickers from './components/MemoDatePickers'
import LoopMemoActionPopup from './components/LoopMemoActionPopup'
import MobileMemoImageGallery from './components/MobileMemoImageGallery'
import {isMemoImageValueValid, joinMemoImages, splitMemoImages} from '@/utils/memoImageUtils.js'

let imgArr;     // 多张图片字符串，用,分割
let okTime;     // 待办更新时间
let okText;         // 待办完成或循环时可添加的文字
let commentText;    // 循环记录评论文本
let commentImgArr;  // 循环记录评论图片
const COMMENT_PAGE_SIZE = 5; // 第三层评论默认加载数量
let v = {      // 循环装中文变量
  '循环时间页数': 1,
  '循环备忘主键': null,
  '循环次数继续加载': false,
  '翻页加载中': false,
  '循环关键字': null,
}

/**
 * @param type                要渲染的待办类型
 * @param setIncompleteCounts 给父组件传值：未完成总数s
 * @param changeType          监控值，如果和类型相同 就 重置该待办列表
 * @param setChangeType       如果新增或修改的类型不是目前待办的列表类型，就改变这个值为那个待办类型的值
 * */
const Memo = ({type, setIncompleteCounts, changeType, setChangeType}) => {
  const [data, setData] = useState([])
  const [hasMore, setHasMore] = useState(true)                // 是否自动翻页
  const [page, setPage] = useState(1);                        // 待办翻页
  const [completed, setCompleted] = useState(0);              // 查看待办状态（看未完成的：0,看已完成的：1,看全部的：-1）
  const [orderBy, setOrderBy] = useState(1)                   // 排序
  const [keyword, setKeyword] = useState(null)                        // 搜索关键字
  const [visible, setVisible] = useState(undefined);                  // 查看弹窗的显示和隐藏
  const [editVisible, setEditVisible] = useState(undefined);          // 编辑弹窗的显示和隐藏(新增时值是“新增"，编辑时值是item对象，关闭时值是false
  const [dateVisible, setDateVisible] = useState(false);     // 日期弹窗的显示和隐藏
  const [loopTime, setLoopTime] = useState(undefined)                 // 循环时间弹窗的显示和隐藏(用数据来控制)
  const [hhMmVisible, setHhMmVisible] = useState(false);     // 时分弹窗的显示和隐藏
  const [loopItemVisible, setLoopItemVisible] = useState(null);       // 备忘循环项 弹窗的显示和隐藏 有对象就是显示然有没有好有
  const [loopCommentMap, setLoopCommentMap] = useState({});           // 循环记录评论按循环项id分组
  const [loopMemoContent, setLoopMemoContent] = useState('');          // 当前循环记录弹窗的备忘内容
  const [editDateVisible, setEditDateVisible] = useState(false);     // 编辑框日期弹窗的显示和隐藏
  const [lastActionId, setLastActionId] = useState();                  // 最后操作的备忘 ID
  const [memoTags, setMemoTags] = useState([]);                        // 当前类型标签列表
  const [activeTagId, setActiveTagId] = useState(null);                 // 当前筛选标签
  const [formMemoTags, setFormMemoTags] = useState([]);                 // 表单当前类型标签列表
  const [loopTransferSelecting, setLoopTransferSelecting] = useState(false); // 循环记录转移选择模式
  const [selectedLoopIds, setSelectedLoopIds] = useState([]);                 // 已选择转移的循环记录主键
  const [loopTransferTarget, setLoopTransferTarget] = useState(null);         // 主列表转移目标选择状态
  const [loopPopupFullscreen, setLoopPopupFullscreen] = useState(false);      // 循环记录弹窗是否全屏

  const [content, setContent] = useState('')                   // 表单内容
  const [itemType, setItemType] = useState(0)                 // 表单类型
  const [tagIds, setTagIds] = useState([])                    // 表单标签ID列表
  const [memoImages, setMemoImages] = useState([])            // 当前备忘原图与缩略图
  const [memoImageUploading, setMemoImageUploading] = useState(false) // 是否正在上传备忘图片
  const [initialMemoForm, setInitialMemoForm] = useState(null) // 打开表单时的数据快照

  const [showQ, setShowQ] = useState();

  // 新增或修改类型是当前类型 说明要在当前列表有变化
  useEffect(() => {
    type === changeType && resetList()
  }, [changeType])

  // 筛选状态 或排序状态改变 就重置列表
  useEffect(() => {
    resetList()
  }, [completed, orderBy, activeTagId])

  // 当前类型标签加载
  useEffect(() => {
    refreshMemoTags()
  }, [type])

  // 表单类型变化时加载可选标签
  useEffect(() => {
    if (!editVisible) return;
    getMemoTags(itemType).then(resp => {
      const tags = resp?.data ?? []; // 表单可选标签
      setFormMemoTags(tags)
      setTagIds(ids => ids.filter(id => tags.some(tag => tag.id === id)))
    })
  }, [editVisible, itemType])

  const textRef = useRef()          // 搜索框的ref 让它能自动获得焦点
  const loading = useRef()          // 显示加载中
  const dateRef = useRef()          // 绑定日期
  const dropdownRef = useRef()      // 绑定排序和状态下拉菜单
  const tagPressTimer = useRef()    // 标签长按计时器
  const tagLongPressed = useRef(false) // 是否已经触发长按菜单

  /** 重置列表 */
  const resetList = () => {
    setPage(1)
    setData([])
    setHasMore(true)
  }

  /** 刷新当前类型标签 */
  const refreshMemoTags = async () => {
    const resp = await getMemoTags(type);
    setMemoTags(resp?.data ?? [])
  }

  /** 刷新待办未完成预加载统计 */
  const refreshIncompleteCounts = async (currentTotal) => {
    if (completed !== 0) return
    const countResp = await getMemoIncompleteCounts(type);
    setIncompleteCounts(v => ({
      ...v,
      ...memoIncompleteCountsToMap(countResp?.data),
      [type]: currentTotal,
    }))
  }

  /** 加载更多 */
  const loadMore = async () => {
    const isFirstPage = page === 1  // 首次加载需要同步标签计数
    const append = await getMemos({type, page, completed, orderBy, keyword, tagId: activeTagId});
    if (!(append?.code === 1)) return showLoading('fail', '获取数据失败') || setHasMore(false)
    const records = append.data?.records ?? []
    const total = append.data?.total ?? 0  // 总条数 给父组件显示
    setData(val => [...val, ...records])
    setHasMore(data.length + records.length < total)
    setPage(val => val + 1)
    if (isFirstPage) await refreshIncompleteCounts(total)
  }

  /** 从云端刷新当前列表 */
  const refreshListFromCloud = async () => {
    setPage(1)
    setData([])
    setHasMore(false)
    const append = await getMemos({type, page: 1, completed, orderBy, keyword, tagId: activeTagId});
    if (!(append?.code === 1)) return showLoading('fail', '获取数据失败')
    const records = append.data?.records ?? []
    const total = append.data?.total ?? 0  // 总条数 给父组件显示
    setData(records)
    setHasMore(records.length < total)
    setPage(2)
    await refreshIncompleteCounts(total)
  }

  /** 显示加载动画 */
  const showLoading = (icon, content) => {
    Toast.show({icon, content})
  }

  /**
   * 上传图片
   * @author 𝓒𝓱𝓮𝓷𝓖𝓾𝓪𝓷𝓰𝓛𝓸𝓷𝓰
   * @since 2025/7/18 2:33
   */
  const uploadToJD = async (file) => {
    if (file.size > 1024 * 1024 * 6) Toast.show({content: '图片超6M,自动压缩中...'})
    const result = await uploadImgByJD(file);
    if (!result.success || !result.data?.url) {
      Toast.show({icon: 'fail', content: result.message ?? '上传失败'})
      throw new Error(result.message ?? '上传失败')
    }
    return {url: result.data.url, thumbnailUrl: thumbUrl(result.data.url)}
  }

  /** 执行动作 */
  const onAction = async (action, addText) => {
    const {id, text} = action;
    if (id) setLastActionId(id)

    const showContent = () => {
      const obj = data.find(item => item.id === id);
      if (!obj) return
      return (<div className={styles.tipContent}>{obj.content}</div>)
    }

    switch (action.key) {
      // 取消|完成 //////////////////////////////////////////////////////////////
      case 'success':
        okTime = undefined  // 重置更新时间
        okText = undefined      // 重置完成文字
        await Dialog.confirm({
          content: text === '完成' ?
            <div>
              {showContent()}
              <div>完成时间:</div>
              <a ref={dateRef} onClick={() => setDateVisible(true)}>现在</a>
              <a
                id="timing"
                onClick={() => setHhMmVisible(true)}
                style={{marginLeft: 9, display: 'none'}}
              >
                (可选)选择时间
              </a>
              <div style={{marginTop: 9}}>完成备注：</div>
              <TextArea
                rows={4}
                autoFocus
                placeholder="可输入完成备注"
                onChange={v => okText = v}
              />
            </div>
            :
            '确定取消完成吗？',
          onConfirm: async () => {
            showLoading('loading', '加载中…')
            const finishResp = await updateMemo({
              id,
              okTime,
              completed: text === '完成' ? 1 : 0,
              okText: text === '完成' ? okText : '',
            })
            if (finishResp) {
              Toast.show({icon: 'success', content: '成功'})
              setVisible(undefined)
              await refreshListFromCloud()
            } else Toast.show({icon: 'fail', content: '失败'})
          }
        })
        break;

      // +1 ///////////////////////////////////////////////////////////////////////
      case 'addOne':
        okTime = undefined      // 重置更新时间
        okText = addText        // 重置完成文字
        imgArr = undefined      // 重置图片

        window.setTimeout(() => {
          if (!addText) return
          const textarea = document.getElementById('addOneText');
          if (textarea) {
            textarea.focus();
            textarea.selectionStart = textarea.selectionEnd = textarea.value.length;
          }
        }, 100)

        await Dialog.confirm({
          style: {zIndex: 1003},
          content:
            <div>
              {showContent()}
              <div>循环时间:</div>
              <a ref={dateRef} onClick={() => setDateVisible(true)}>现在</a>
              <a
                id="timing"
                onClick={() => setHhMmVisible(true)}
                style={{marginLeft: 9, display: 'none'}}
              >
                (可选)选择时间
              </a>
              <div style={{marginTop: 9}}>加一备注：</div>
              <TextArea
                rows={4}
                id="addOneText"
                autoFocus
                defaultValue={addText}
                placeholder="可输入循环备注"
                onChange={v => okText = v}
              />
              <ImageUploader
                columns={3}
                maxCount={3}
                capture="camera"
                showFailed={false}
                upload={uploadToJD}
                onChange={(items) => imgArr = items.map(item => item.url).join(',')}
              />
            </div>
          ,
          onConfirm: async () => {
            showLoading('loading', '加载中…')
            imgArr = imgArr ?? undefined
            const addOneResp = await addLoopMemoItem({
              memoId: id,
              memoDate: okTime,
              loopText: okText,
              imgArr
            })
            if (addOneResp) {
              Toast.show({icon: 'success', content: '成功'})
              // 刷新列表
              if (loopTime) showLoopMemoItemList(null, {id})

              setVisible(undefined);
              await refreshListFromCloud()
            } else Toast.show({icon: 'fail', content: '失败'})
          }
        });
        break;

      // 编辑 //////////////////////////////////////////////////////////////////////
      case 'edit':
        setVisible(undefined)
        const obj = data.find(item => item.id === id);
        setEditVisible(obj);
        setContent(obj.content);
        setItemType(obj.itemType)
        setTagIds(obj.tagIds ?? [])
        setMemoImages(splitMemoImages(obj.imgArr).map(url => ({url, thumbnailUrl: thumbUrl(url)})))
        setMemoImageUploading(false)
        setInitialMemoForm({
          content: obj.content ?? '',
          itemType: obj.itemType,
          tagIds: obj.tagIds ?? [],
          imgArr: obj.imgArr ?? '',
        })
        window.setTimeout(() => {
          textRef.current?.focus()                                            // 获得焦点
          const length = obj.content.length                                  // 获取输入框字符串的长度
          textRef.current.nativeElement.setSelectionRange(length, length)   // 设置光标位置在最后
        }, 100)                                                       // 没在页面那么快，所以要延迟一点点
        break;

      // 删除 ///////////////////////////////////////////////////////////////////////
      case 'delete':
        await Dialog.confirm({
          content:
            <div style={{textAlign: 'center'}}>
              {showContent()}
              <ExclamationCircleFilled style={{color: 'red'}}/> 确定删除该条备忘吗
            </div>,
          onConfirm: async () => {
            const deleteResponse = await deleteMemo(id)
            if (deleteResponse) {
              Toast.show({icon: 'success', content: '删除成功'})
              // 刷新列表
              setVisible(undefined)
              await refreshListFromCloud()
            } else Toast.show({icon: 'fail', content: '删除失败'})
          },
        })
        break;
      default:
        Toast.show({icon: 'fail', content: '你是怎么做到的？🧐'})
    }
  }

  /** 直接+1 */
  const directAddOne = async ({memoId, loopText}) => {
    const addOneResp = await addLoopMemoItem({memoId, loopText});
    if (addOneResp.success) {
      setLoopItemVisible(null);
      if (loopTime) showLoopMemoItemList(null, {id: memoId});   // 刷新列表
      await refreshListFromCloud()
      Toast.show({icon: 'success', content: '成功'});                     // 显示成功
    }
  }

  /** 打开添加弹窗 */
  const openAdd = () => {
    setEditVisible('新增');
    setContent('');
    setItemType(type);
    setTagIds([]);
    setMemoImages([])
    setMemoImageUploading(false)
    setInitialMemoForm({content: '', itemType: type, tagIds: [], imgArr: ''})
    window.setTimeout(() => textRef.current?.focus(), 100) // 点击添加按钮后自动获得焦点,但是没在页面上所以要延迟一点点
  }

  /** 判断标签ID是否一致 */
  const sameIds = (a, b) => {
    const left = [...(a ?? [])].sort((x, y) => x - y).join(',');
    const right = [...(b ?? [])].sort((x, y) => x - y).join(',');
    return left === right;
  }

  const currentMemoImgArr = joinMemoImages(memoImages.map(item => item.url)); // 当前表单图片字段
  const memoFormChanged = Boolean(initialMemoForm) && (
    content !== initialMemoForm.content
    || itemType !== initialMemoForm.itemType
    || !sameIds(tagIds, initialMemoForm.tagIds)
    || currentMemoImgArr !== initialMemoForm.imgArr
  ); // 表单是否存在未保存修改

  /** 编辑或新增的提交表单 */
  const submit = async () => {
    if (content?.length === 0) return Toast.show({icon: 'fail', content: '内容不能为空'})
    if (memoImageUploading) return Toast.show({icon: 'fail', content: '图片还在上传中，请稍等'})
    const nextImgArr = joinMemoImages(memoImages.map(item => item.url)); // 待提交图片字段
    if (!isMemoImageValueValid(nextImgArr)) {
      return Toast.show({icon: 'fail', content: '图片地址总长度不能超过999个字符，请删除部分图片'})
    }
    // if (!itemType) return Toast.show({icon: 'fail', content: '类型不能为空'})

    // 构造请求体
    let body = {};
    body.content = content === editVisible?.content ? null : content;       // 内容不一致时才更新
    body.itemType = itemType === editVisible?.itemType ? null : itemType;   // 内容不一致时才更新
    if (!sameIds(tagIds, editVisible?.tagIds)) body.tagIds = tagIds;
    if (nextImgArr !== (editVisible?.imgArr ?? '')) body.imgArr = nextImgArr;
    if (body.content === null && body.itemType === null && body.tagIds === undefined && body.imgArr === undefined) {
      Toast.show({icon: 'fail', content: '没有变化'})
      setEditVisible(false)
      return
    }
    body.id = editVisible?.id;
    showLoading('loading', '处理中…')
    let result = await (editVisible === '新增' ? addMemo : updateMemo)(body);
    if (result) {
      showLoading('success', '成功')
      setEditVisible(false);

      if (editVisible === '新增') {
        if (type !== body.itemType) return setChangeType(body.itemType);  /* 新增的待办不是当前类型，那个重置的数据 */
        await refreshListFromCloud()
        // 修改 而且修改的待办是当前类型，那么刷新当前列表
      } else if (body.itemType === null) await refreshListFromCloud()
      else {  // 把类型修改到别的地方去了 就刷新两边列表
        setChangeType(body.itemType)
        await refreshListFromCloud()
      }
    } else showLoading('fail', '失败')
  }

  /** 新增当前类型标签 */
  const addMemoTag = async () => {
    let tagName = ''; // 新标签名称
    await Dialog.confirm({
      content: <Input placeholder="请输入标签名称" maxLength={32} onChange={value => tagName = value}/>,
      confirmText: '新增',
      onConfirm: async () => {
        if (!tagName.trim()) {
          Toast.show({icon: 'fail', content: '标签名称不能为空'})
          throw new Error('标签名称不能为空')
        }
        const id = await createMemoTag({itemType: type, name: tagName.trim()})
        if (id) await refreshMemoTags()
      }
    })
  }

  /** 修改当前类型标签 */
  const editMemoTag = async (memoTag) => {
    let tagName = memoTag.name ?? ''; // 修改后的标签名称
    await Dialog.confirm({
      content: <Input defaultValue={memoTag.name} maxLength={32} onChange={value => tagName = value}/>,
      confirmText: '保存',
      onConfirm: async () => {
        if (!tagName.trim() || tagName.trim() === memoTag.name) return;
        const success = await updateMemoTag({id: memoTag.id, name: tagName.trim()})
        if (success) {
          await refreshMemoTags()
          await refreshListFromCloud()
        }
      }
    })
  }

  /** 删除当前类型标签 */
  const removeMemoTag = async (memoTag) => {
    await Dialog.confirm({
      content: `删除标签「${memoTag.name}」？删除后会从已绑定的备忘中移除该标签。`,
      confirmText: '删除',
      onConfirm: async () => {
        const success = await deleteMemoTag(memoTag.id)
        if (success) {
          await refreshMemoTags()
          if (activeTagId === memoTag.id) {
            setActiveTagId(null)
            resetList()
          } else await refreshListFromCloud()
        }
      }
    })
  }

  /** 打开标签操作菜单 */
  const openMemoTagMenu = (memoTag) => {
    const handler = Dialog.show({
      content: `标签：${memoTag.name}`,
      closeOnMaskClick: true,
      actions: [
        [{
          key: 'edit',
          text: '编辑',
          onClick: () => {
            handler.close()
            editMemoTag(memoTag)
          }
        }],
        [{
          key: 'delete',
          text: '删除',
          danger: true,
          onClick: () => {
            handler.close()
            removeMemoTag(memoTag)
          }
        }],
        [{key: 'cancel', text: '取消', onClick: () => handler.close()}]
      ]
    })
  }

  /** 标签长按开始 */
  const startTagPress = (memoTag) => {
    window.clearTimeout(tagPressTimer.current)
    tagLongPressed.current = false
    tagPressTimer.current = window.setTimeout(() => {
      tagLongPressed.current = true
      openMemoTagMenu(memoTag)
    }, 600)
  }

  /** 标签长按结束 */
  const cancelTagPress = () => window.clearTimeout(tagPressTimer.current)


  /** 获取循环时间显示 */
  const showLoopTime = async () => {
    if (v['翻页加载中'] || !v['循环次数继续加载']) return
    v['翻页加载中'] = true
    const resp = await selectLoopMemoItemList(v['循环备忘主键'], v['循环时间页数'], v['循环关键字']);
    loading.current?.close()    // 关闭加载蒙版

    const result = resp.data
    if (resp.success) {
      if (result?.records?.length > 0) {
        v['循环时间页数']++
        setLoopTime(list => [...list ?? [], ...result.records])
        initLoopCommentMap(result.records)
      }
    } else Toast.show({icon: 'fail', content: '获取失败'})

    v['循环次数继续加载'] = result?.current < result?.pages
    v['翻页加载中'] = false
  }

  /** 加载单条循环记录的评论 */
  const loadLoopCommentPage = async (loop, page = 1, replace = false) => {
    if (!loop?.id) return
    setLoopCommentMap(map => ({
      ...map,
      [loop.id]: {
        ...(map[loop.id] ?? {}),
        loading: true,
        loop,
      }
    }))
    const resp = await selectLoopMemoItemCommentList(loop.id, page, COMMENT_PAGE_SIZE);
    const result = resp.data
    if (!resp.success) {
      setLoopCommentMap(map => ({
        ...map,
        [loop.id]: {...(map[loop.id] ?? {}), loading: false, loop}
      }))
      return Toast.show({icon: 'fail', content: '评论获取失败'})
    }
    const records = result?.records ?? []
    setLoopCommentMap(map => {
      const current = map[loop.id] ?? {}; // 当前循环记录的评论状态
      return {
        ...map,
        [loop.id]: {
          loop,
          records: replace ? records : [...current.records ?? [], ...records],
          page: page + 1,
          total: result?.total ?? records.length,
          hasMore: result?.current < result?.pages,
          loading: false,
        }
      }
    })
  }

  /** 批量预加载循环记录评论 */
  const initLoopCommentMap = (records) => {
    setLoopCommentMap(map => {
      const nextMap = {...map}; // 合并本页循环记录自带的评论预览
      records
        ?.filter(loop => loop?.id)
        .forEach(loop => {
          nextMap[loop.id] = {
            loop,
            records: loop.comments ?? [],
            page: 2,
            total: loop.commentTotal ?? loop.comments?.length ?? 0,
            hasMore: Boolean(loop.commentHasMore),
            loading: false,
          }
        })
      return nextMap
    })
  }

  /**
   * 编辑循环备忘子项备注
   *
   * @author Yc
   * @since 2025/5/20 1:15
   */
  const editLoopMemoItem = async (loop) => {
    okText = loop.loopText ?? ''
    imgArr = loop.imgArr;
    window.setTimeout(() => {
      const textarea = document.getElementById('editAddOneText');
      if (textarea) textarea.selectionStart = textarea.selectionEnd = 9999;
    }, 100)
    await Dialog.confirm({
      style: {zIndex: 1004},
      content:
        <div id="编辑循环备忘子项框">
          <div style={{marginTop: 9}}>备注：</div>
          <TextArea
            rows={4}
            autoFocus
            id="editAddOneText"
            defaultValue={okText}
            placeholder="请输入循环备注,空为不修改"
            onChange={v => okText = v}
          />
          <ImageUploader
            defaultValue={imgArr ? imgArr.split(',').map(url => ({url})) : undefined} // 防止空字符串生成一个无效的
            maxCount={3}
            showFailed={false}
            upload={uploadToJD}
            onChange={(items) => imgArr = items.map(item => item.url).join(',')}
          />
        </div>
      ,
      onConfirm: async () => {
        const resp = await updateLoopMemoItem({...loop, loopText: okText, imgArr})
        setLoopItemVisible(null)
        if (resp.success) {
          Toast.show({icon: 'success', content: '成功'})
          showLoopMemoItemList(null, {id: loop.memoId})
          await refreshListFromCloud()
        } else Toast.show({icon: 'fail', content: '失败'})
      }
    })
  }

  /**
   * 删除循环备忘子项
   * @author Yc
   * @since 2025/5/20 1:09
   */
  const delLoopMemoItem = async (memoId, id) => {
    await Dialog.confirm({
      style: {zIndex: 1004},
      content:
        <div style={{textAlign: 'center'}}>
          <ExclamationCircleFilled style={{color: 'red'}}/>
          确定删除该条循环吗
        </div>,
      onConfirm: async () => {
        const result = await deleteLoopMemoItem(memoId, id)
        if (result.success) {
          Toast.show({icon: 'success', content: '删除成功'})
          // 刷新列表
          setLoopItemVisible(null)
          showLoopMemoItemList(null, {id: memoId})
          await refreshListFromCloud()
        } else Toast.show({icon: 'fail', content: '删除失败'})
      },
    })
  }

  /** 切换循环记录转移选中状态 */
  const toggleLoopTransferItem = (loopId) => {
    if (!loopId) return
    setSelectedLoopIds(ids => ids.includes(loopId)
      ? ids.filter(id => id !== loopId)
      : [...ids, loopId]
    )
  }

  /** 取消循环记录选择模式 */
  const cancelLoopTransferSelecting = () => {
    setLoopTransferSelecting(false)
    setSelectedLoopIds([])
  }

  /** 关闭循环记录列表弹窗 */
  const closeLoopMemoPopup = () => {
    setLoopTime(undefined);
    setLoopMemoContent('');
    setShowQ(undefined);
    setLoopTransferSelecting(false);
    setSelectedLoopIds([]);
    setLoopPopupFullscreen(false);
    v['循环关键字'] = null;
  }

  /** 进入主列表选择循环记录转移目标 */
  const startLoopTransferTargetSelecting = () => {
    if (!v['循环备忘主键']) return
    if (!selectedLoopIds.length) return Toast.show({content: '请选择循环记录'})
    setLoopTransferTarget({
      sourceMemoId: v['循环备忘主键'],
      loopItemIds: [...selectedLoopIds],
    })
    setLoopTransferSelecting(false)
    setSelectedLoopIds([])
    setLoopTime(undefined)
    setLoopItemVisible(null)
    setLoopMemoContent('')
    setShowQ(undefined)
    v['循环关键字'] = null
    Toast.show({content: '请选择转移目标'})
  }

  /** 取消主列表转移目标选择 */
  const cancelLoopTransferTarget = () => {
    setLoopTransferTarget(null)
    Toast.show({content: '已取消转移'})
  }

  /** 同步循环记录转移后的循环次数 */
  const syncLoopTransferCounts = (sourceMemoId, targetMemoId, sourceCount, targetCount) => {
    setData(list => list.map(item => {
      if (item.id === sourceMemoId) return {...item, numberOfRecurrences: sourceCount ?? item.numberOfRecurrences}
      if (item.id === targetMemoId) return {...item, numberOfRecurrences: targetCount ?? item.numberOfRecurrences}
      return item
    }))
  }

  /** 选择并确认循环记录转移目标 */
  const selectLoopTransferTarget = async (targetMemo) => {
    if (!loopTransferTarget || !targetMemo?.id) return
    if (targetMemo.itemType !== 1) return Toast.show({icon: 'fail', content: '只能转移到循环备忘'})
    if (targetMemo.id === loopTransferTarget.sourceMemoId) return Toast.show({icon: 'fail', content: '不能转移到原循环备忘'})
    const transferState = loopTransferTarget; // 当前转移状态快照
    await Dialog.confirm({
      content: '是否确定转移？',
      confirmText: '确定',
      onConfirm: async () => {
        const resp = await transferLoopMemoItems({
          sourceMemoId: transferState.sourceMemoId,
          targetMemoId: targetMemo.id,
          loopItemIds: transferState.loopItemIds,
        })
        if (!resp.success) {
          Toast.show({icon: 'fail', content: resp.message ?? '转移失败'})
          throw new Error('转移失败')
        }
        const result = resp.data; // 转移后两边最新循环次数
        syncLoopTransferCounts(
          result?.sourceMemoId ?? transferState.sourceMemoId,
          result?.targetMemoId ?? targetMemo.id,
          result?.sourceNumberOfRecurrences,
          result?.targetNumberOfRecurrences
        )
        setLoopTransferTarget(null)
        Toast.show({icon: 'success', content: '转移成功'})
        await refreshListFromCloud()
      }
    })
  }

  /**
   * 显示循环子项列表
   *
   * @author 𝓒𝓱𝓮𝓷𝓖𝓾𝓪𝓷𝓰𝓛𝓸𝓷𝓰
   * @since 2025/10/3 2:58
   */
  const showLoopMemoItemList = (e, visibleObj) => {
    e?.stopPropagation()
    visibleObj = visibleObj ?? visible
    if (visibleObj?.id) setLastActionId(visibleObj.id)
    const loopMemo = visibleObj?.content ? visibleObj : data.find(item => item.id === visibleObj?.id); // 当前循环备忘主项
    setLoopMemoContent(content => loopMemo?.content ?? (visibleObj?.id === v['循环备忘主键'] ? content : ''))
    setLoopTime([]);
    setLoopCommentMap({})
    setLoopTransferSelecting(false)
    setSelectedLoopIds([])
    v['循环次数继续加载'] = visibleObj.id
    v['循环时间页数'] = 1
    v['循环备忘主键'] = visibleObj.id
    v['翻页加载中'] = false
    showLoopTime()
    loading.current = Toast.show({
      icon: 'loading',
      content: '加载中…',
      duration: 0,
    })
  }

  /** 编辑循环记录评论 */
  const editLoopMemoComment = async (loop, comment) => {
    setLoopItemVisible(null)
    commentText = comment?.commentText ?? ''
    commentImgArr = comment?.imgArr
    window.setTimeout(() => {
      const textarea = document.getElementById('editLoopCommentText');
      if (textarea) textarea.selectionStart = textarea.selectionEnd = 9999;
    }, 100)
    await Dialog.confirm({
      style: {zIndex: 1005},
      content:
        <div id="编辑循环记录评论框">
          <div style={{marginTop: 9}}>评论：</div>
          <TextArea
            rows={4}
            autoFocus
            id="editLoopCommentText"
            defaultValue={commentText}
            placeholder="请输入评论"
            onChange={v => commentText = v}
          />
          <ImageUploader
            defaultValue={commentImgArr ? commentImgArr.split(',').map(url => ({url})) : undefined}
            maxCount={3}
            showFailed={false}
            upload={uploadToJD}
            onChange={(items) => commentImgArr = items.map(item => item.url).join(',')}
          />
        </div>
      ,
      onConfirm: async () => {
        if (!commentText && !commentImgArr) return Toast.show({icon: 'fail', content: '评论不能为空'})
        const request = comment?.id
          ? updateLoopMemoItemComment({...comment, commentText, imgArr: commentImgArr})
          : addLoopMemoItemComment({
            memoId: loop.memoId,
            loopItemId: loop.id,
            commentText,
            imgArr: commentImgArr
          })
        const resp = await request
        if (resp.success) {
          Toast.show({icon: 'success', content: '成功'})
          loadLoopCommentPage(loop, 1, true)
        } else Toast.show({icon: 'fail', content: '失败'})
      }
    })
  }

  /** 删除循环记录评论 */
  const delLoopMemoComment = async (loop, comment) => {
    await Dialog.confirm({
      style: {zIndex: 1005},
      content:
        <div style={{textAlign: 'center'}}>
          <ExclamationCircleFilled style={{color: 'red'}}/>
          确定删除该条评论吗
        </div>,
      onConfirm: async () => {
        const result = await deleteLoopMemoItemComment(comment.memoId, comment.loopItemId, comment.id)
        if (result.success) {
          Toast.show({icon: 'success', content: '删除成功'})
          loadLoopCommentPage(loop, 1, true)
        } else Toast.show({icon: 'fail', content: '删除失败'})
      },
    })
  }

  /** 在光标位置后面插入文本的函数 */
  const insertAtCursor = (textToInsert) => {
    textRef.current?.focus()
    const selectionStart = textRef.current.nativeElement.selectionStart;  // 获取光标开始位置
    const selectionEnd = textRef.current.nativeElement.selectionEnd;      // 获取光标结束位置

    const currentValue = content ?? ''
    const beforeText = currentValue.slice(0, selectionStart);
    const afterText = currentValue.slice(selectionEnd);

    setContent(beforeText + `${textToInsert}` + afterText)
    window.setTimeout(() => { // setContent是异步的哇 所以一定要比它还要晚一点 因为它是属于全覆盖 光标自然在最后
      // 重新定位光标到插入点之后
      if (textRef.current) {
        textRef.current?.nativeElement.setSelectionRange(selectionStart + textToInsert.length, selectionStart + textToInsert.length)
        textRef.current.focus();
      }
    }, 100)
  }

  return (
    <>
      <Dropdown ref={dropdownRef}>   {/*下拉菜单：antd的实验性组件*/}
        <Button onClick={openAdd} size={'small'} style={{margin: 5}}>添加一条</Button>
        {/*排序类型*/}
        <Dropdown.Item key='sorter' title={<div style={{fontSize: 15}}>排序:{orderByName(orderBy)}</div>}>
          <div style={{padding: 12}}>
            <Radio.Group
              value={orderBy}
              onChange={e => setOrderBy(e) || dropdownRef.current.close()}
            >
              <Space direction='vertical'>
                {sortingOptions.map(item =>
                  <Radio key={item.value} value={item.value} style={{width: '90vw'}}>
                    {item.label}
                  </Radio>
                )}
              </Space>
            </Radio.Group>
          </div>
        </Dropdown.Item>
        {/*完成状态*/}
        <Dropdown.Item key='toDoStatus' title={<div style={{fontSize: 15}}>状态:{finishName(completed)}</div>}>
          <div style={{padding: 12}}>
            <Radio.Group
              value={completed}
              onChange={e => setCompleted(e) || dropdownRef.current.close()}
            >
              <Space direction='vertical'>
                {columns.map(item =>
                  <Radio key={item.value} value={item.value} style={{width: '90vw'}}>
                    {item.label}
                  </Radio>
                )}
              </Space>
            </Radio.Group>
          </div>
        </Dropdown.Item>
      </Dropdown>

      <div className={styles.memoTagFilter}>
        {memoTags.map(memoTag =>
          <span
            key={memoTag.id}
            className={styles.memoFilterTag}
            onPointerDown={() => startTagPress(memoTag)}
            onPointerUp={cancelTagPress}
            onPointerLeave={cancelTagPress}
            onPointerCancel={cancelTagPress}
            onClick={() => {
              if (tagLongPressed.current) {
                tagLongPressed.current = false
                return;
              }
              setActiveTagId(activeTagId === memoTag.id ? null : memoTag.id)
            }}
            onContextMenu={e => {
              e.preventDefault()
              openMemoTagMenu(memoTag)
            }}
          >
            <Tag
              color={activeTagId === memoTag.id ? 'success' : 'default'}
              fill={activeTagId === memoTag.id ? 'solid' : 'outline'}
            >
              {memoTag.name}
            </Tag>
          </span>
        )}
        <Button size="mini" onClick={addMemoTag}>+</Button>
      </div>


      {/*有数据时显示搜索框*/ (data?.length > 0 || keyword) &&
        <SearchBar
          cancelText={'清空'}
          placeholder='要搜索内容吗😶‍🌫️'
          onSearch={e => setKeyword(e) || resetList()}
          // onBlur={onSearch}  // 输入框失去焦点时触发（搜索也会触发 如果想就可以改成e.target.value
          onCancel={() => keyword && (setKeyword(null) || resetList())}
          onClear={() => keyword && (setKeyword(null) || resetList())}
          showCancelButton
          maxLength={100}
        />
      }
      <PullToRefresh
        pullingText="用点力拉🤤"
        canReleaseText="放开就要刷新了🥺"
        completeText="哎呦，你干嘛🥴"
        onRefresh={async () => resetList()}
      >
        {loopTransferTarget &&
          <div className={styles.loopTransferTargetTip}>
            <span>请选择转移目标</span>
            <Button size="mini" fill="none" onClick={cancelLoopTransferTarget}>取消</Button>
          </div>
        }
        <List>
          {data.map(item => (
            <SwipeAction    // 滑动操作
              key={item.id}
              leftActions={loopTransferTarget ? [] : leftActions(item)}
              rightActions={loopTransferTarget ? [] : rightActions(item)}
              onActionsReveal={() => !loopTransferTarget && setLastActionId(item.id)}
              onAction={(a, _e) => !loopTransferTarget && onAction(a)}
            >
              <List.Item
                key={item.id}
                className={item.id === lastActionId ? styles.memoLastAction : ''}
                style={{
                  background: item.id === lastActionId ?
                    item.completed ? 'linear-gradient(270deg, #f1fff0, #f0f7ff)' : '#f0f7ff'
                    :
                    item.completed ? 'linear-gradient(270deg, #f2fff0, #fff)' : '#fff'
                }}
                onClick={() => {
                  if (loopTransferTarget) {
                    setLastActionId(item.id)
                    selectLoopTransferTarget(item)
                    return
                  }
                  setLastActionId(item.id)
                  setVisible(item)
                }}
                clickable={false}
              >

                <div style={{width: '100%', position: 'relative'}}>
                  {/*循环待办显示次数*/}
                  <div
                    className={styles.loopCount}
                    onClick={e => {
                      if (!loopTransferTarget) showLoopMemoItemList(e, item)
                    }}
                    style={{display: type === 1 && item.numberOfRecurrences ? 'block' : 'none'}}
                  >
                    <Badge
                      color="#987ee7"
                      style={{padding: 3}}
                      content={item.numberOfRecurrences}
                    />
                  </div>

                  {keyword ?
                    <HighlightKeyword content={item.content} keyword={keyword}/>
                    :
                    <Ellipsis                       // 省略文本
                      direction='end'             // 省略尾部
                      content={item.content}      // 内容
                      expandText='展开'
                      collapseText='收起'
                      rows={3}                                    // 超过3行才省略
                      stopPropagationForActionButtons={['click']} // 阻止冒泡事件
                    />
                  }
                  <MobileMemoImageGallery imgArr={item.imgArr}/>
                  {item.tags?.length > 0 &&
                    <div className={styles.memoItemTags}>
                      {item.tags.map(tag => <Tag key={tag.id} color="default" fill="outline">{tag.name}</Tag>)}
                    </div>
                  }
                </div>
              </List.Item>
            </SwipeAction>
          ))}
        </List>
        <InfiniteScroll loadMore={loadMore} hasMore={hasMore}/>
        <br/>
      </PullToRefresh>


      <MemoDetailPopup
        visibleMemo={visible}
        onClose={() => setVisible(undefined)}
        onShowLoopItems={showLoopMemoItemList}
        onAction={onAction}
      />

      <MemoEditPopup
        editVisible={editVisible}
        content={content}
        itemType={itemType}
        textRef={textRef}
        onClose={() => setEditVisible(false)}
        onContentChange={setContent}
        onItemTypeChange={value => {
          setItemType(value)
          setTagIds([])
        }}
        memoTags={formMemoTags}
        tagIds={tagIds}
        onTagIdsChange={setTagIds}
        hasUnsavedChanges={memoFormChanged}
        memoImages={memoImages}
        onMemoImagesChange={setMemoImages}
        onImageUploadQueueChange={tasks => setMemoImageUploading(tasks.some(task => task.status === 'pending'))}
        onUploadImage={uploadToJD}
        onOpenDatePicker={() => setEditDateVisible(true)}
        onInsertAtCursor={insertAtCursor}
        onSubmit={submit}
      />


      <Popup      /* 循环时间的弹出层 *******************************************************************/
        visible={!!loopTime}
        style={{zIndex: 1001}}
        bodyStyle={{height: loopPopupFullscreen ? '100vh' : '55vh', overflow: 'scroll'}}
        onMaskClick={closeLoopMemoPopup}
      >
        <div className={styles.loopMemoPopupHeader}>
          {loopMemoContent &&
            <div className={styles.loopMemoPopupContent}>{loopMemoContent}</div>
          }
          <div className={styles.loopMemoPopupActions}>
            {loopTransferSelecting ?
              <div className={styles.loopTransferActions}>
                <Button size="mini" fill="none" disabled={!selectedLoopIds.length} onClick={startLoopTransferTargetSelecting}>转移</Button>
                <Button size="mini" fill="none" onClick={cancelLoopTransferSelecting}>取消</Button>
              </div>
              :
              <Button
                size="mini"
                fill="none"
                className={styles.loopTransferMore}
                onClick={() => setLoopTransferSelecting(true)}
              >
                ...
              </Button>
            }
            <Button
              size="mini"
              fill="none"
              aria-label={loopPopupFullscreen ? '半屏显示' : '全屏显示'}
              title={loopPopupFullscreen ? '半屏显示' : '全屏显示'}
              onClick={() => setLoopPopupFullscreen(fullscreen => !fullscreen)}
            >
              {loopPopupFullscreen ? <FullscreenExitOutlined/> : <FullscreenOutlined/>}
            </Button>
            <Button
              size="mini"
              fill="none"
              aria-label="关闭循环记录"
              title="关闭循环记录"
              onClick={closeLoopMemoPopup}
            >
              <CloseOutlined/>
            </Button>
          </div>
        </div>
        {showQ?.length >= 0 ?
          <div
            style={{display: 'grid', gridTemplateColumns: '1fr 3rem', padding: 3, alignItems: 'center'}}
          >
            <Input
              style={{zIndex: 2}}
              clearable
              id="loopQ"
              value={showQ}
              placeholder='请输入内容'
              onChange={v => setShowQ(v)}
              onEnterPress={() => {
                v['循环关键字'] = showQ;
                showLoopMemoItemList(null, {id: v['循环备忘主键']});
                setShowQ(null);
              }}
            />
            <div
              style={{
                zIndex: 2,
                width: '100%',
                height: '100%',
                lineHeight: '25px',
                textAlign: 'center',
                background: '#cbf3fa',
                border: '1px solid #ccc',
                borderRadius: 5
              }}
              onClick={() => {
                v['循环关键字'] = showQ;
                showLoopMemoItemList(null, {id: v['循环备忘主键']});
                setShowQ(null);
              }}
            >
              搜索
            </div>
            <div
              onClick={() => setShowQ(null)}
              style={{
                opacity: 0.7,
                zIndex: 1,
                background: '#eee',
                position: 'absolute',
                right: 0,
                top: 0,
                width: '100vw',
                height: '100vh'
              }}
            />
          </div>
          :
          <div>
            {v['循环关键字'] ?
              <div style={{display: 'grid', gridTemplateColumns: '1fr 2rem', alignItems: 'center', padding: 5}}>
                <div
                  onClick={() => {
                    setShowQ(v['循环关键字']);
                    window.setTimeout(() => {
                      document.querySelector('#loopQ').focus()
                    }, 200)
                  }}
                >
                  {v['循环关键字']}
                </div>
                <div
                  style={{
                    background: '#f8e0e0',
                    padding: 2,
                    borderRadius: 5,
                    border: '1px solid red',
                    textAlign: 'center'
                  }}
                  onClick={() => {
                    v['循环关键字'] = null;
                    showLoopMemoItemList(null, {id: v['循环备忘主键']});
                  }}
                >
                  X
                </div>
              </div>
              :
              <div
                style={{color: '#a09af6', padding: 5}}
                onClick={() => {
                  setShowQ('');
                  window.setTimeout(() => {
                    document.querySelector('#loopQ').focus()
                  }, 200)
                }}
              >
                搜索循环项备注
              </div>
            }
          </div>
        }
        {loopTime?.length > 0 &&
          <>
            <List>
              {loopTime?.map((item, index) =>
                <List.Item
                  key={item.id}
                  className={`${loopTransferSelecting ? styles.loopTransferSelectable : ''} ${selectedLoopIds.includes(item.id) ? styles.loopTransferSelected : ''}`}
                  onClick={() => loopTransferSelecting ? toggleLoopTransferItem(item.id) : setLoopItemVisible(item)}
                >
                  <div style={{display: 'flex', gap: 10}}>
                    {index + 1}：{fDate(item.memoDate)}
                    {item.imgArr && item.imgArr.split(',').map((url, i) =>
                      <Image
                        src={thumbUrl(url)}
                        width={25}
                        height={25}
                        fit='fill'
                        style={{borderRadius: 5}}
                        onClick={(e) => {
                          e.stopPropagation()
                          if (loopTransferSelecting) {
                            toggleLoopTransferItem(item.id)
                            return
                          }
                          ImageViewer.Multi.show({
                            images: item.imgArr.split(','),
                            defaultIndex: i,
                            classNames: {mask: styles.imgListViewer},
                          })
                        }}
                      />
                    )}
                  </div>
                  {item.loopText && <div className={styles.loopText}>{item.loopText}</div>}
                  {loopCommentMap[item.id]?.records?.length > 0 &&
                    <div className={styles.loopCommentList}>
                      {loopCommentMap[item.id].records.map(comment =>
                        <div
                          key={comment.id}
                          className={styles.loopCommentItem}
                          onClick={(e) => {
                            e.stopPropagation()
                            if (loopTransferSelecting) {
                              toggleLoopTransferItem(item.id)
                              return
                            }
                            setLoopItemVisible(null)
                            const handler = Dialog.show({
                              style: {zIndex: 1004},
                              content: '请选择评论操作',
                              closeOnMaskClick: true,
                              actions: [
                                [{
                                  key: 'edit',
                                  text: '编辑',
                                  onClick: () => {
                                    handler.close()
                                    editLoopMemoComment(item, comment)
                                  }
                                }],
                                [{
                                  key: 'delete',
                                  text: '删除',
                                  danger: true,
                                  onClick: () => {
                                    handler.close()
                                    delLoopMemoComment(item, comment)
                                  }
                                }],
                                [{
                                  key: 'cancel',
                                  text: '取消',
                                  onClick: () => handler.close()
                                }]
                              ]
                            })
                          }}
                        >
                          <div className={styles.loopCommentMeta}>{fDate(comment.commentDate)}</div>
                          {comment.commentText && <div>{comment.commentText}</div>}
                          {comment.imgArr && <div style={{display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4}}>
                            {comment.imgArr.split(',').filter(Boolean).map((url, i) =>
                              <Image
                                key={url}
                                src={thumbUrl(url)}
                                width={30}
                                height={30}
                                fit='fill'
                                style={{borderRadius: 5}}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  if (loopTransferSelecting) {
                                    toggleLoopTransferItem(item.id)
                                    return
                                  }
                                  ImageViewer.Multi.show({
                                    images: comment.imgArr.split(',').filter(Boolean),
                                    defaultIndex: i,
                                    classNames: {mask: styles.imgListViewer},
                                  })
                                }}
                              />
                            )}
                          </div>}
                        </div>
                      )}
                    </div>
                  }
                  {loopCommentMap[item.id]?.hasMore &&
                    <div
                      className={styles.loopCommentMore}
                      onClick={(e) => {
                        e.stopPropagation()
                        if (loopTransferSelecting) {
                          toggleLoopTransferItem(item.id)
                          return
                        }
                        const commentState = loopCommentMap[item.id]; // 当前评论分页状态
                        if (!commentState?.loading) loadLoopCommentPage(item, commentState?.page ?? 1)
                      }}
                    >
                      {loopCommentMap[item.id]?.loading ? '加载中…' : '加载更多评论'}
                    </div>
                  }
                </List.Item>
              )}
            </List>
            <InfiniteScroll loadMore={showLoopTime} hasMore={Boolean(v['循环次数继续加载'])}/>
          </>
        }
      </Popup>

      <LoopMemoActionPopup
        loopItemVisible={loopItemVisible}
        onClose={() => setLoopItemVisible(null)}
        onDirectAddOne={directAddOne}
        onAddOneWithText={loopItem => {
          onAction({
            key: 'addOne',
            id: loopItem.memoId
          }, loopItem?.loopText)
          setLoopItemVisible(null)
        }}
        onEditLoopItem={editLoopMemoItem}
        onEditLoopComment={loopItem => editLoopMemoComment(loopItem, null)}
        onDeleteLoopItem={delLoopMemoItem}
      />


      <MemoDatePickers
        dateVisible={dateVisible}
        editDateVisible={editDateVisible}
        hhMmVisible={hhMmVisible}
        dateRef={dateRef}
        getOkTime={() => okTime}
        setOkTime={value => { okTime = value }}
        onCloseDate={() => setDateVisible(false)}
        onCloseEditDate={() => setEditDateVisible(false)}
        onCloseHhMm={() => setHhMmVisible(false)}
        onInsertAtCursor={insertAtCursor}
      />
    </>
  )
}
export default Memo;
