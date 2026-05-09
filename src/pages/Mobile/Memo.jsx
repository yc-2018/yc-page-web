import React, {useEffect, useRef, useState} from 'react'
import {
  InfiniteScroll, List, Popup, SwipeAction, Toast,
  Button, Tag, Radio, TextArea, Dialog, PullToRefresh,
  SearchBar, Badge, Ellipsis, CalendarPicker, Dropdown,
  Space, Modal, ImageViewer, Picker, ImageUploader, Image, Input
} from 'antd-mobile'
import dayjs from "dayjs";
import {
  addLoopMemoItem, addMemo,
  deleteLoopMemoItem,
  deleteMemo,
  getMemos,
  selectLoopMemoItemList,
  updateLoopMemoItem, updateMemo
} from "@/request/memoApi";
import {finishName, columns, leftActions, rightActions, orderByName} from "@/pages/Mobile/data";
import {sortingOptions} from "@/store/NoLoginData";
import HighlightKeyword from "@/utils/HighlightKeyword";
import {ExclamationCircleFilled} from "@ant-design/icons";
import LinkifyContent from "@/components/LinkifyContent/index";
import {symbols} from "@/pages/MemoDrawer/compontets/FormModal";
import styles from '@/pages/Mobile/mobile.module.css'
import {fDate} from "@/utils/DateUtils";
import {uploadImgByJD} from "@/request/toolsRequest";
import {thumbUrl} from "@/utils/urlUtils.js";

let imgArr;     // 多张图片字符串，用,分割
let okTime;     // 待办更新时间
let okText;         // 待办完成或循环时可添加的文字
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
  let total;  // 总条数 给父组件显示

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
  const [editDateVisible, setEditDateVisible] = useState(false);     // 编辑框日期弹窗的显示和隐藏

  const [content, setContent] = useState('')                   // 表单内容
  const [itemType, setItemType] = useState(0)                 // 表单类型

  const [showQ, setShowQ] = useState();

  // 新增或修改类型是当前类型 说明要在当前列表有变化
  useEffect(() => {
    type === changeType && resetList()
  }, [changeType])

  // 筛选状态 或排序状态改变 就重置列表
  useEffect(() => {
    resetList()
  }, [completed, orderBy])

  const textRef = useRef()          // 搜索框的ref 让它能自动获得焦点
  const loading = useRef()          // 显示加载中
  const dateRef = useRef()          // 绑定日期
  const dropdownRef = useRef()      // 绑定排序和状态下拉菜单

  /** 重置列表 */
  const resetList = () => {
    setPage(1)
    setData([])
    setHasMore(true)
  }

  /** 加载更多 */
  const loadMore = async () => {
    const append = await getMemos({type, page, completed, orderBy, keyword});
    if (!append) return showLoading('fail', '获取数据失败') || setHasMore(false)
    setData(val => [...val, ...append.data?.records])
    setHasMore(data.length < append.data.total)
    setPage(val => val + 1)

    total = append.data.total
    // 给父组件传值：未完成总数s
    setIncompleteCounts(v => ({...v, ...append?.map.groupMemosCounts, [type]: total}))
  }

  /** 改变总数 给父组件传值：未完成总数s */
  const changeTotal = (add = '++') => {
    if (add === '++') ++total
    else --total
    setIncompleteCounts(v => ({...v, [type]: total}))
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
      throw new Error('上传失败')
    }
    return {url: result.data.url}
  }

  /** 执行动作 */
  const onAction = async (action, addText) => {
    const {id, text} = action;

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
              /*全部的还是要显示在列表上*/
              completed === -1 && setData(val => val.map(item => item.id === id ? {
                ...item,
                completed: text === '完成' ? 1 : 0,
                okText: text === '完成' ? okText : '',
                okTime: okTime || new Date().toLocaleString()
              } : item))
              /* 类型变了不属于显示范畴了 */
              completed !== -1 && setData(val => val.filter(item => item.id !== id))

              setVisible(undefined)

              changeTotal(text === '完成' ? '--' : '++')// █给父组件传值：未完成总数s
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
              setData(val => val.map(item => item.id === id ? {
                ...item,
                numberOfRecurrences: item.numberOfRecurrences + 1,
                okTime: okTime || new Date().toLocaleString()
              } : item))

              // 刷新列表
              if (loopTime) showLoopMemoItemList(null, {id})

              setVisible(undefined);
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
              setData(val => val.filter(item => item.id !== id))
              setVisible(undefined)
              action.completed === 0 && changeTotal('--')// █给父组件传值：未完成总数s
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
      Toast.show({icon: 'success', content: '成功'});                     // 显示成功
    }
  }

  /** 打开添加弹窗 */
  const openAdd = () => {
    setEditVisible('新增');
    setContent('');
    setItemType(type);
    window.setTimeout(() => textRef.current?.focus(), 100) // 点击添加按钮后自动获得焦点,但是没在页面上所以要延迟一点点
  }

  /** 编辑或新增的提交表单 */
  const submit = async () => {
    if (content?.length === 0) return Toast.show({icon: 'fail', content: '内容不能为空'})
    // if (!itemType) return Toast.show({icon: 'fail', content: '类型不能为空'})

    // 构造请求体
    let body = {};
    body.content = content === editVisible?.content ? null : content;       // 内容不一致时才更新
    body.itemType = itemType === editVisible?.itemType ? null : itemType;   // 内容不一致时才更新
    if (!body.content && !body.itemType) return Toast.show({
      icon: 'fail',
      content: '没有变化'
    }) && setEditVisible(false)
    body.id = editVisible?.id;
    showLoading('loading', '处理中…')
    let result = await (editVisible === '新增' ? addMemo : updateMemo)(body);
    if (result) {
      showLoading('success', '成功')
      setEditVisible(false);

      if (editVisible === '新增') {
        if (type !== body.itemType) return setChangeType(body.itemType);  /* 新增的待办不是当前类型，那个重置的数据 */
        // 新增的待办是当前类型，那么更新本地数据
        setData(data => [{
          ...body,
          id: result,
          createTime: new Date().toLocaleString(),
          okTime: new Date().toLocaleString(),
          numberOfRecurrences: 0,
          completed: 0
        }, ...data])
        changeTotal('++')/* █给父组件传值：未完成总数s */
        // 修改 而且修改的待办是当前类型，那么更新本地数据
      } else if (body.itemType === null)
        setData(data => data.map(item => item.id === editVisible?.id ? {
          ...item,
          itemType: body.itemType || item.itemType,
          content: body.content || item.content,
          okTime: new Date().toLocaleString()
        } : item))
      else {  // 把类型修改到别的地方去了 就不要它了
        setData(data => data.filter(item => item.id !== body.id))
        setChangeType(body.itemType)
      }
    } else showLoading('fail', '失败')
  }


  /** 获取循环时间显示 */
  const showLoopTime = async () => {
    if (v['翻页加载中'] || !v['循环次数继续加载']) return
    v['翻页加载中'] = true
    const resp = await selectLoopMemoItemList(v['循环备忘主键'], v['循环时间页数'], v['循环关键字']);
    loading.current?.close()    // 关闭加载蒙版

    const result = resp.data
    if (resp.success && result?.records?.length > 0) {
      v['循环时间页数']++
      setLoopTime(list => [...list ?? [], ...result.records])
    } else Toast.show({icon: 'fail', content: '获取失败'})

    v['循环次数继续加载'] = result?.current < result?.pages
    v['翻页加载中'] = false
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
          setLoopTime(val => val.map(item => item.id === loop.id ? {
            ...item,
            loopText: okText,
            imgArr: imgArr,
            updateTime: new Date().toLocaleString()
          } : item))
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
          setLoopTime(val => val.filter(item => item.id !== id))
          setLoopItemVisible(null)
        } else Toast.show({icon: 'fail', content: '删除失败'})
      },
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
    setLoopTime([]);
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
        <List>
          {data.map(item => (
            <SwipeAction    // 滑动操作
              key={item.id}
              leftActions={leftActions(item)}
              rightActions={rightActions(item)}
              onAction={(a, _e) => onAction(a)}
            >
              <List.Item
                key={item.id}
                style={{background: item.completed ? 'linear-gradient(270deg, #f2fff0, #fff)' : '#fff'}}
                onClick={() => setVisible(item)}
                clickable={false}
              >

                <div style={{width: '100%', position: 'relative'}}>
                  {/*循环待办显示次数*/}
                  <div
                    className={styles.loopCount}
                    onClick={e => showLoopMemoItemList(e, item)}
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
                </div>
              </List.Item>
            </SwipeAction>
          ))}
        </List>
        <InfiniteScroll loadMore={loadMore} hasMore={hasMore}/>
        <br/>
      </PullToRefresh>


      <Popup    /* 查看详细弹出层***************************************************/
        visible={!!visible}
        closeOnSwipe /* 组件内向下滑动关闭 */
        onMaskClick={() => setVisible(undefined)}
        bodyStyle={{
          height: '62vh',
          width: '95vw',
          padding: 10,
          overflow: 'scroll',
          borderRadius: '15px 15px 0 0'
        }}
      >
        {/*可左右滑动*/}
        <div style={{display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 5}}>
          {/*显示循环的次数*/ visible?.numberOfRecurrences > 0 && visible?.itemType === 1 &&
            <Tag
              color='warning'
              fill='outline'
              onClick={showLoopMemoItemList}
              style={{'--background-color': '#fcecd8'}}
              className={styles.memoPopupTag}
            >
              {`循环次数: ${visible.numberOfRecurrences}▼`}
            </Tag>
          }

          {/*显示完成或修改时间*/ visible?.createTime !== visible?.updateTime &&
            <Tag color='success' fill='outline' className={styles.memoPopupTag}
                 style={{'--background-color': '#c8f7c5'}}>
              {visible?.completed ?
                <span onClick={() => Toast.show({content: `修改:${visible.updateTime}`})}>
                  完成:{fDate(visible.okTime)}
                </span>
                :
                <span>修改:{fDate(visible.updateTime)}</span>
              }
            </Tag>
          }

          {/*显示创建时间*/}
          <Tag color='primary' fill='outline' className={styles.memoPopupTag} style={{'--background-color': '#c5f1f7'}}>
            创建:{fDate(visible?.createTime)}
          </Tag>
        </div>

        <div style={{height: '42vh', overflowY: 'scroll', border: '1px solid #ccc', borderRadius: 10, marginTop: 5}}>
          {visible?.okText && <div className={styles.okText}><b>完成备注：</b>{visible.okText}</div>}
          <pre
            style={{
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
              fontSize: 14,
              fontFamily: 'unset',
              padding: 8,
              margin: 0
            }}
          >
            <LinkifyContent
              linkImg={link => <a key={link} onClick={() => ImageViewer.show({image: link})}>{link}</a>}
            >
              {visible?.content}
            </LinkifyContent>
          </pre>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10}}>
          {/* 未完成的显示修改按钮 */ visible?.completed === 0 &&
            <Button
              block
              color='primary'
              onClick={() => onAction({key: 'edit', id: visible.id})}
            >
              修改
            </Button>
          }
          {/*未完成的显示完成按钮 */ visible?.completed === 0 &&
            <Button
              block
              color='success'
              onClick={() => onAction({key: 'success', text: '完成', id: visible?.id})}
            >
              完成
            </Button>
          }

          {/*完成的显示取消完成按钮 */ visible?.completed === 1 &&
            <Button
              block
              style={{background: '#f6b234', border: 'none', color: '#fff'}}
              onClick={() => onAction({key: 'success', text: '取消完成', id: visible.id})}
            >
              取消完成
            </Button>
          }

          {/*显示删除按钮*/
            <Button
              block
              color='danger'
              onClick={() => onAction({key: 'delete', id: visible?.id})}
            >
              删除
            </Button>
          }

          {/*循环的显示 +1 按钮*/visible?.itemType === 1 &&
            <Button
              block
              style={{background: '#a934f6', border: 'none', color: '#fff'}}
              onClick={() => onAction({key: 'addOne', id: visible.id})}
            >
              +1
            </Button>
          }
        </div>
      </Popup>


      <Popup      /* 编辑弹出层 **********************************************************/
        visible={!!editVisible}
        onMaskClick={async () => {
          if (!content || content === editVisible?.content) return setEditVisible(false)
          const result = await Dialog.confirm({
            content: '检测到内容已修改，直接返回已编辑的内容会丢失哦,确定退出吗？',
            closeOnMaskClick: true,     // 点击遮罩层关闭提示
          })
          if (result) setEditVisible(false)
        }}
        // onClose={() => {setEditVisible(false)}}
        position='top'
        bodyStyle={{height: '450px'}}
      >

        <div style={{padding: '10px'}}>

          <div style={{textAlign: 'center'}}>
            <Radio.Group value={itemType} onChange={value => setItemType(() => value)}>
              <Radio value={0} className={'█Radio'}>普通</Radio>
              <Radio value={1} className={'█Radio'}>循环</Radio>
              <Radio value={2} className={'█Radio'}>长期</Radio>
              <Radio value={3} className={'█Radio'}>紧急</Radio>
              <Radio value={5} className={'█Radio'}>日记</Radio>
              <Radio value={6} className={'█Radio'}>工作</Radio>
              <Radio value={7} className={'█Radio'}>其他</Radio>
            </Radio.Group>
          </div>

          <TextArea
            rows={13}
            showCount
            ref={textRef}
            value={content}
            className="contentText"
            style={{height: '300px'}}
            placeholder="请输入备忘内容"
            maxLength={itemType === 5 ? 4000 : 2000}
            onChange={value => setContent(value)}
          />
          <div style={{margin: '10px 0'}}>
            <Button size="small" onClick={() => setEditDateVisible(true)}>插入日期</Button>
            &nbsp;
            <Button
              size="small"
              onClick={() => {
                const handler = Modal.show({
                  content:
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 2}}>
                      {symbols.map((item) =>
                        <div
                          key={item}
                          style={{padding: 5, border: '1px solid #ccc', textAlign: 'center'}}
                          onClick={() => insertAtCursor(item) || handler.close()}
                        >
                          {item}
                        </div>
                      )}
                    </div>,
                  closeOnMaskClick: true,
                  closeOnAction: true,
                  actions: [{key: 'close', text: '关闭'}]
                })
              }}
            >
              插入符号
            </Button>
          </div>

          <Button block onClick={submit}> 提交 </Button>
        </div>
      </Popup>


      <Popup      /* 循环时间的弹出层 *******************************************************************/
        visible={!!loopTime}
        style={{zIndex: 1001}}
        bodyStyle={{height: '55vh', overflow: 'scroll'}}
        onMaskClick={() => {
          setLoopTime(undefined);
          setShowQ(undefined);
          v['循环关键字'] = null;
        }}
      >
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
                <List.Item key={item.id} onClick={() => setLoopItemVisible(item)}>
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
                </List.Item>
              )}
            </List>
            <InfiniteScroll loadMore={showLoopTime} hasMore={Boolean(v['循环次数继续加载'])}/>
          </>
        }
      </Popup>

      <Popup      /* 循环项操作的弹出层 *********/
        visible={Boolean(loopItemVisible)}
        onMaskClick={() => setLoopItemVisible(null)}
        bodyStyle={{height: Boolean(loopItemVisible?.loopText) ? 240 : 140}}
        style={{zIndex: 1002}}
      >
        {Boolean(loopItemVisible) &&
          <div style={{padding: 10, display: 'flex', flexWrap: 'wrap', gap: 10}}>
            {loopItemVisible?.loopText &&
              <Button block onClick={() => directAddOne(loopItemVisible)}>
                按当前备注直接 +1
              </Button>
            }
            {loopItemVisible?.loopText &&
              <Button
                block
                onClick={() => {
                  onAction({
                    key: 'addOne',
                    id: loopItemVisible.memoId
                  }, loopItemVisible?.loopText)
                  setLoopItemVisible(null)
                }}
              >
                +1 并按当前备注编辑
              </Button>
            }
            <Button block onClick={() => editLoopMemoItem(loopItemVisible)}>
              编辑备注
            </Button>
            <Button
              block
              color="danger"
              onClick={() => delLoopMemoItem(loopItemVisible.memoId, loopItemVisible.id)}
            >
              删除此项
            </Button>
            <div>创建时间:{loopItemVisible.createTime}</div>
            {loopItemVisible.updateTime && <div>更新时间:{loopItemVisible.updateTime}</div>}
          </div>
        }
      </Popup>


      {/*日期选择器（antd实验性组件）完成或+1 用 */}
      <CalendarPicker
        popupStyle={{zIndex: 99999}}
        min={new Date(Date.now() - 59 * 24 * 60 * 60 * 1000)}    // 前59天
        max={new Date()}                                              // 今天
        visible={dateVisible}
        selectionMode='single'
        onClose={() => setDateVisible(false)}
        onMaskClick={() => setDateVisible(false)}
        onConfirm={date => {
          if (!date) return;
          const dayStr = dayjs(date).format('YYYY-MM-DD');
          if (okTime) {
            okTime = `${dayStr} ${okTime.split(' ')[1]}`
          } else okTime = `${dayStr} 00:00:00`;
          dateRef.current.innerHTML = dayStr
          const element = window.document.querySelector('#timing');
          if (element) element.style.display = 'inline-block'

        }}
      />

      {/*日期选择器（antd实验性组件）编辑插入用*/}
      <CalendarPicker
        popupStyle={{zIndex: 99999}}
        visible={editDateVisible}
        selectionMode='range'
        onClose={() => setEditDateVisible(false)}
        onMaskClick={() => setEditDateVisible(false)}
        onConfirm={date => {
          if (!date) return;
          const startDate = dayjs(date[0]).format('YYYY-MM-DD')
          let endDate = dayjs(date[1]).format('YYYY-MM-DD')
          endDate = startDate === endDate ? '' : `~${endDate} `
          const textToInsert = `${startDate}${endDate}`
          insertAtCursor(textToInsert)
        }}
      />

      {/* 时分选择器 */}
      <Picker
        popupStyle={{zIndex: 99999}}
        defaultValue={[dayjs().format('HH'), dayjs().format('mm')]}
        columns={[
          // 小时列（0-23）
          Array.from({length: 24}, (_, i) => ({
            label: i.toString().padStart(2, '0'),
            value: i.toString().padStart(2, '0'),
          })),
          // 分钟列（0-59）
          Array.from({length: 60}, (_, i) => ({
            label: i.toString().padStart(2, '0'),
            value: i.toString().padStart(2, '0'),
          }))
        ]}
        visible={hhMmVisible}
        onClose={() => setHhMmVisible(false)}
        onConfirm={v => {
          setHhMmVisible(false)
          if (!okTime) return Toast.show({icon: 'fail', content: '未选择日期'});
          const time = ` ${v[0]}:${v[1]}:00`
          okTime = okTime.split(' ')[0] + time
          window.document.querySelector('#timing').innerText = `${v[0]}:${v[1]}`
        }}
      />
    </>
  )
}
export default Memo;
