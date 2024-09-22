import React, {useEffect, useState} from "react";
import {observer} from 'mobx-react-lite'
import {
  BookOutlined,
  CaretDownOutlined, ColumnHeightOutlined,
  PlusOutlined, QuestionCircleFilled,
  SyncOutlined, VerticalAlignMiddleOutlined
} from "@ant-design/icons";
import {
  Drawer, List, Skeleton, Button, Tag,
  Spin, Tooltip, Select, Divider,
  Badge, Space, Dropdown, App, DatePicker,
  Switch
} from "antd";
import moment from 'moment';

import showOrNot from "../../store/ShowOrNot";
import UserStore from "../../store/UserStore";
import FormModal from "./compontets/FormModal";
import ShowOrNot from "../../store/ShowOrNot";
import JWTUtils from "../../utils/JWTUtils";
import {sortingOptions, tagNameMapper} from "../../store/NoLoginData";
import SortSelect from "../../compontets/SortSelect";
import {delToDoItem, getToDoItems, saveOrUpdateToDoItem, selectLoopMemoTimeList} from "../../request/memoRequest.js"
import SearchBox from "../../compontets/common/SearchBox";

import './MemoDrawer.css'
import styles from '../../common.module.css'
import ActionBtn from "./compontets/ActionBtn";
import HighlightKeyword from "../../utils/HighlightKeyword";

window.ikunSelectDate = undefined    // 用于完成或+1时是否主动选择日期

let i = 0;                   // 页面刷新次数
let total = -1;              // 初始化待办总数
let orderBy = 1;             // 《表单》默认排序方式
let isQueryOnClick = false; // 防止点太快了
let openMemoText = 0;       //  控制全部展开备忘录内容 1展开 非1收缩
let dates = [] ;              // 未处理的筛选日期
let filterDate = '';         // 筛选日期 格式： 开始时间戳/结束时间戳/0：修改时间 1：创建时间
let filterDateType = 1;     // 筛选日期类型 0：修改时间 1：创建时间


const MemoDrawer = () => {
  const [initLoading, setInitLoading] = useState(true);       // 初始化加载
  const [itemLoading, setItemItemLoading] = useState(false);  // 底部加载
  const [webLoading, setWebLoading] = useState(false);        // 网络加载
  const [refreshTrigger, setRefreshTrigger] = useState(0);    // 刷新触发列表(值无意义，改变即刷新列表数据
  const [, setRefresh] = useState(0);                                 // 刷新触发：单纯驱动非状态变量改变页面
  const [data, setData] = useState([]);                         // 待办列表数据
  const [list, setList] = useState([]);                         // 待办展示列表
  const [page, setPage] = useState(1);                        // 待办翻页
  const [type, setType] = useState(0);                        // 待办类型
  const [loopTimeList, setLoopTimeList] = useState([])          // 循环时间列表
  const [loopTimePage, setLoopTimePage] = useState(1);        // 循环时间页数
  const [loopTimeTotal, setLoopTimeTotal] = useState(0);      //循环时间总数
  const [loopTimeWebLoading, setLoopTimeWebLoading] = useState(true); // 循环时间网络加载
  const [unFinishCounts, setUnFinishCounts] = useState();             // 待办未完成计数
  const [completed, setCompleted] = useState(0);              // 查看待办状态（看未完成的：0,看已完成的：1,看全部的：-1）
  const [formModal, setFormModal] = useState(false);          // 是否显示新增或编辑的模态框。
  const [fModalData, setFModalData] = useState();                     // 设置模态框数据
  const [keyword, setKeyword] = useState('');                   // 搜索关键字
  const [searchEmpty, setSearchEmpty] = useState(true);       // 搜索框为空（搜索框有值没点搜索，是就是删除图标变红）

  const {notification, modal} = App.useApp();
  
  const sxYm = () => setRefresh(++i)        // 刷新页面
  const sxSj = () => setRefreshTrigger(++i) // 刷新数据列表

  useEffect(() => {
    if (!JWTUtils.isExpired()) (async () => {
      setFModalData(null)     // 模态框数据重置 null和 undefined 来回切换
      setWebLoading(true)     // 网络加载
      setUnFinishCounts(null) // 待办未完成计数重置
      setList([]);            // 待办列表重置
      setPage(1)              // 待办翻页重置
      total = -1;                   // 待办总数重置
      // 使用 axios 发起请求 获取又一次初始化待办列表
      const resp = await getToDoItems({type, page: 1, completed, orderBy, keyword, dateRange: filterDate});
      if (!(resp?.code === 1)) {
        setInitLoading(false);
        setWebLoading(false);
        return;
      }
      const {data, map} = resp;
      setData(data.records);
      setList(data.records);

      if (completed === 0) setUnFinishCounts(map.groupToDoItemsCounts)
      // 如果刚打开时有未完成的紧急备忘 而且抽屉没打开 就弹出提醒
      if (initLoading && !showOrNot.memoDrawerShow && map.groupToDoItemsCounts['3'] > 0 && total === -1) {
        const key = `open${Date.now()}`;
        notification.info({
          message: '有未完成的紧急备忘',
          description: '是否要打开查看',
          key,
          btn: (
            <Space>
              <Button type="link" size="small" onClick={() => notification.destroy(key)}>
                不看了
              </Button>
              <Button type="primary" size="small" onClick={() => {
                notification.destroy(key)
                setType(3)
                ShowOrNot.setMemoDrawerShow(true)
              }}>
                打开看看
              </Button>
            </Space>
          )
        })

      }
      total = data.total;
      setInitLoading(false);
      setWebLoading(false);
    })();

  }, [UserStore.jwt, type, completed, refreshTrigger]);


  /** 点击加载更多数据触发 */
  const onLoadMore = async () => {
    setItemItemLoading(true);
    setList(
      data.concat(
        [...new Array(2)].map(() => ({
          loading: true,
          content: undefined,
          createTime: undefined,
        })),
      ),
    );

    // 使用 axios 发起请求
    const {data: respData} = await getToDoItems({type, page: page + 1, completed, orderBy, keyword, dateRange: filterDate});
    if (!respData) return;      // 保持代码的健壮性
    // 结合旧数据和新数据
    const newData = data.concat(respData.records);
    setData(newData);
    setList(newData);
    setItemItemLoading(false);
    setPage(page + 1);      // 异步放前面也没用

  };


  /** 判断 显示《加载更多》《到底了》还是什么都不显示 */
  const loadMore =
    !initLoading && !itemLoading && list.length < total ? (
      <div className="loadMore">
        <Button block onClick={onLoadMore}>加载更多</Button>
      </div>
    ) : !itemLoading && list.length && <Divider className='loadMore' plain>🥺到底啦🐾</Divider>;


  /** 分类标签生成 */
  const getTag = (TypeNum, typeName, color) =>
    <Badge size="small" offset={[-5, 2]}
           title={"未完成的条数"}
           overflowCount={9999}    // 展示封顶的数字值
           count={type === TypeNum && total > 0 ? total : unFinishCounts?.[TypeNum]}
    >
      <Tag className={`${styles.pointer} ${type === TypeNum ? styles.currentTag : ''}`}
           color={color ?? "processing"}
           onClick={() => {
             setSearchEmpty(true)    // 搜索框为空重置
             setKeyword('')          // 搜索关键字重置
             setType(TypeNum)
           }}
      >
        &nbsp;&nbsp;{typeName}&nbsp;&nbsp;
      </Tag>
    </Badge>


  /** 获取循环备忘录时间列表 */
  const getLoopMemoTimeList = (id, updateTime) =>
    <Dropdown
      destroyPopupOnHide   // 关闭销毁
      trigger={['click']}
      onOpenChange={async open => {
        if (open) {
          await getLoopMemoTimeData(id)
        } else {
          setLoopTimeTotal(0)
          setLoopTimeList([])
          setLoopTimePage(1)
          setLoopTimeWebLoading(false)
        }
      }}
      dropdownRender={() =>
        <div className={`ant-dropdown-menu ${styles['dropdown-menu']} ${styles.gun}`}>
          {loopTimeList?.map(({id, memoDate}, index) =>
            <div key={id} style={{margin: '0 10px'}}>
              {index + 1}：{memoDate?.replace('T00:00:00', ' ').replace('T', ' ')}
            </div>
          )}
          {/* 尾部 */
            loopTimeWebLoading ? <><SyncOutlined spin/> 正在加载中</> :
              loopTimeTotal <= loopTimeList.length ? <>到底了</> :
                <Button block size={'small'} onClick={() => getLoopMemoTimeData(id)}>继续加载</Button>
          }
        </div>
      }
    >
        <span className={styles.pointer}>
          &nbsp;&nbsp;&nbsp;<CaretDownOutlined/>循环:{updateTime}<CaretDownOutlined/>
        </span>
    </Dropdown>

  // 获取循环备忘录时间列表
  const getLoopMemoTimeData = async id => {
    setLoopTimeWebLoading(true)
    const resp = await selectLoopMemoTimeList(id, loopTimePage);
    setLoopTimeWebLoading(false)
    if (resp?.records?.length > 0) {
      setLoopTimeList(item => ([...item, ...resp.records]))
      setLoopTimePage(v => v + 1)     // 页码增加
      setLoopTimeTotal(resp.total)
    }
  }

  /** 完成或加1时 可以选择日期 */
  const selectDate = text =>
    <>
      直接点击确定,【{text}时间】就是现在(带时分秒)
      <div>当然也允许您往前几天去选择日期(不带时分秒)</div>
      <DatePicker
        allowClear
        size={"small"}
        style={{width: '90%'}}
        placeholder={'选择日期,或默认当前时间:' + new Date().toLocaleString()}
        disabledDate={current => current && (current < moment().subtract(7, 'days') || current > moment())}
        onChange={(_, dateStr) => window.ikunSelectDate = dateStr ? dateStr + 'T00:00:00' : undefined}
      />
    </>

  /**
   * 格式化时间（去0去T）
   * @param strTime 时间字符串
   * @author ChenGuangLong
   * @since 2024/5/29 16:43
   */
  const formatTime = strTime => strTime?.replace('T00:00:00', ' ').replace('T', ' ')

  /** 处理待办列表的操作 */
  const listHandleAction = async event => {

    const target = event.target;
    const action = target.closest('[data-action]')?.getAttribute('data-action');
    const id = target.closest('[data-id]')?.getAttribute('data-id');
    const itemObj = list.find(item => item.id === parseInt(id));
    const confirmAction = Array.from(target.classList).some(className => className.startsWith('confirm-'))  // 防止快速重复点

    if (!action) return;
    // 防止点太快了
    if (isQueryOnClick && confirmAction) return // message.warning('哇，你点的好快呀👍');
    if (confirmAction) {
      isQueryOnClick = true
      window.setTimeout(() => isQueryOnClick = false, 1000)
    }

    const actionObj = {
      see: () => {
        // 双击查看
        if (event.type === 'dblclick') {
          const seeModel = modal.confirm({
            title: '查看备忘',
            maskClosable: true,
            closable: true,
            width: '80vw',
            style: {top: '5vh'},
            icon: <BookOutlined/>,
            content:
              <div
                className={styles.gun}
                style={{height: '70vh', border: '1px solid #ccc', borderRadius: '6px', padding: 9, overflow: 'auto'}}
              >
                <pre style={{whiteSpace: 'pre-wrap', fontSize: '14px', margin: 0, fontFamily: 'unset'}}>
                  {itemObj.content}
                </pre>
              </div>,
          })
          seeModel.update({ // 添加按钮分开写是因为 seeModel直接写会没初始化完成 导致没发关闭
            footer:
              <div style={{display: 'flex', justifyContent: 'flex-end', gap: 5, position: 'relative', top: 9}}>
                <Button onClick={() => actionObj.finish(seeModel.destroy)}>{`${itemObj.completed ? '取消' : ''}完成`}</Button>
                <Button onClick={() => seeModel.destroy() || setFModalData(itemObj) || setFormModal(true)}>编辑</Button>
                <Button type="primary" onClick={seeModel.destroy}>关闭</Button>
              </div>
          })
        }
      },
      edit: () => {
        setFModalData(itemObj)
        setFormModal(true)
      },
      finish: (func) => {
        window.ikunSelectDate = undefined
        return modal.confirm({
          maskClosable: true,         // 点遮罩可以关闭
          title: `确定${itemObj.completed ? '取消' : ''}完成?`,
          icon: <QuestionCircleFilled/>,
          content: itemObj.completed ? '' : selectDate('完成'),
          onOk() {
            return new Promise(async (resolve, reject) => {
              const finishResponse = await saveOrUpdateToDoItem({
                id,
                completed: itemObj.completed ? 0 : 1,
                updateTime: window.ikunSelectDate
              }, 'put')
              if (finishResponse) {
                if (func) func()    // 执行传入方法（关闭查看窗口)
                sxSj()
                return resolve()    // 成功,关闭按钮加载 关闭窗口
              }
              return reject() // 失败，关闭按钮加载,关闭窗口
            })
          }
        })
      },
      delete: async () => {
        // 如果按钮已经在删除确认状态
        if (target.classList.contains('confirm-delete')) {
          setWebLoading(true)
          const deleteResponse = await delToDoItem(id)
          if (deleteResponse) sxSj()
          setWebLoading(false)
        } else {
          target.classList.add('confirm-delete');
          target.textContent = '确定删除?';
          setTimeout(() => {
            if (target?.classList?.contains('confirm-delete')) {
              target.classList.remove('confirm-delete');
              target.textContent = '删除';
            }
          }, 3000);
        }
      },
      addOne: () => {
        window.ikunSelectDate = undefined
        return modal.confirm({
          title: `确定加一吗?`,
          icon: <QuestionCircleFilled/>,
          content: selectDate('加一'),
          maskClosable: true,         // 点遮罩可以关闭
          onOk() {
            return new Promise(async (resolve, reject) => {
              const body = {
                id,
                numberOfRecurrences: 666,
                updateTime: window.ikunSelectDate
              }
              if (await saveOrUpdateToDoItem(body, 'put')) {
                sxSj()
                return resolve()    // 成功,关闭按钮加载 关闭窗口
              }
              return reject() // 失败，关闭按钮加载,关闭窗口
            })
          }
        })
      },
    }
    if (actionObj[action]) actionObj[action]()
  }
  
  /**
   * 设置是否展开备忘录内容
   * @author ChenGuangLong
   * @since 2024/7/6 16:52
  */
  const setOpenMemoText = v => sxYm(openMemoText = v);
  
  /**
   * 筛选日期
   * @author ChenGuangLong
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
      width={700}
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
              />

              <Tooltip title={'刷新当前待办'} mouseEnterDelay={0.6}>
                <SyncOutlined className='refresh' spin={webLoading} onClick={sxSj}/>
              </Tooltip>
              备忘录
              
              {/* 添加按钮 */}
              <Tooltip title={'添加一个待办'} mouseEnterDelay={1}>
                <Button
                  icon={<PlusOutlined/>}
                  onClick={() => {
                    setFModalData(undefined)
                    setFormModal(true)
                  }}
                  size={"small"} className={"addItemButton"}
                />
              </Tooltip>
              
              <Select                 /*下拉框看《待办状态》*/
                size='small'
                value={completed}
                style={{width: '6em', marginLeft: 5}}
                onChange={value => setCompleted(value)}
                options={[
                  {label: '未完成', value: 0},
                  {label: '已完成', value: 1},
                  {label: '全部', value: -1}
                ]}
              />
              
              <SortSelect             /*自己搞的《排序下拉框》*/
                value={orderBy}
                onChange={value => sxSj(orderBy = value)/*这不是传参，就是赋值*/}
                options={sortingOptions}
                loading={webLoading}
              />

              {/*————日期筛选————*/}
              <DatePicker.RangePicker
                size={'small'}
                onOpenChange={open => !open && handleFilterDate()}  // 关闭日期选择器时触发
                onChange={dateArr => {                              // 改变日期触发记录它
                  dates = (dateArr ?? [])
                  !dateArr && filterDate && handleFilterDate()      // 清除了日期，但还有筛选条件，就触发筛选列表
                }}
                renderExtraFooter={() =>
                  <div className="flex-center m5 memo-dateRangeSwitch">
                    <Switch
                      checkedChildren="创建时间"
                      unCheckedChildren="修改时间"
                      checked={Boolean(filterDateType)}
                      onClick={checked => sxYm(filterDateType = checked ? 1 : 0)}
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
                  onClick={() => setOpenMemoText(1)}
                />
                {' '}
              </Tooltip>
              
              {/*收起文本*/}
              <Tooltip title="收起文本，对全部长备忘录的收起">
                <Button
                  size="small"
                  shape="circle"
                  icon={<VerticalAlignMiddleOutlined/>}
                  onClick={() => setOpenMemoText(-1)}
                />
              </Tooltip>
              
            </div>
            <Space size={'large'}>
              {getTag(0, "普通")}
              {getTag(6, "工作")}
              {getTag(3, "紧急","red")}
              {getTag(1, "循环", "magenta")}
              {getTag(2, "长期", "gold")}
              {getTag(5, "日记", "cyan")}
              {getTag(7, "其他", "purple")}
            </Space>
          </Spin>
        </>
      }
      /* 底部搜索框*/
      footer={!JWTUtils.isExpired() &&
        <SearchBox
          keyword={keyword}
          setKeyword={setKeyword}
          sxSj={sxSj}
          searchEmpty={searchEmpty}
          setSearchEmpty={setSearchEmpty}
        />
      }
    >
      <Spin spinning={webLoading} tip={'正在加载' + tagNameMapper[type] + '待办'}>
        {UserStore.jwt ?
          <List
            onClick={listHandleAction} // 在这里设置事件监听器
            onDoubleClick={listHandleAction} // 在这里设置事件监听器
            className="demo-loadmore-list"
            itemLayout="horizontal"
            loadMore={loadMore}
            dataSource={list}
            renderItem={({
                           id,
                           loading,
                           content,
                           itemType,
                           completed,
                           updateTime,
                           createTime,
                           numberOfRecurrences
                         }) => (
              <List.Item key={id} className={completed && 'finish'}>
                <Skeleton avatar title={false} loading={loading} active>
                  <List.Item.Meta
                    description={
                      <div data-id={id}>
                        <div
                          data-action="see"
                          style={{userSelect: 'auto'}}
                          className={(itemType === 3 && !completed && styles.gradientText) || null}
                        >
                          {!searchEmpty && <HighlightKeyword content={content} keyword={keyword}/>}
                          {searchEmpty && content?.slice(0, 100)}
                          {searchEmpty && content?.length > 100 &&
                            <span>
                              <span>{openMemoText === 1 && content.slice(100)}</span> {/*用来展开或收起的文字变化*/}
                              <span
                                className='expand-button'
                                onClick={event => {
                                  if (event.target.innerText === '...展开') {
                                    event.target.parentElement.childNodes[0].innerText = content.slice(100)
                                    event.target.innerText = '收起'
                                  } else {
                                    event.target.parentElement.childNodes[0].innerText = ''
                                    event.target.innerText = '...展开'
                                  }
                                }}
                              >
                                {openMemoText === 1 ? '收起' : '...展开'}
                              </span>
                            </span>
                          }
                        </div>

                        {/*————————————————备忘项 的功能按钮和 创建修改时间显示————————————————*/}
                        <div style={{display: 'flex',marginTop: 10}}>
                          {/*如果是循环待办显示循环按钮*/ itemType === 1 &&
                            <Badge count={numberOfRecurrences}
                                   style={{backgroundColor: '#52c41a'}} offset={[-13, -1]}
                                   size={'small'}>
                              <ActionBtn actionName={'addOne'}>循环+1</ActionBtn>
                            </Badge>
                          }
                          <ActionBtn actionName={'finish'}>{!!completed && '取消'}完成</ActionBtn>
                          <ActionBtn actionName={'edit'} show={!completed}>编辑</ActionBtn> {/*完成了就不要显示编辑了*/}
                          <ActionBtn actionName={'delete'}>删除</ActionBtn>
                          
                          <div style={{fontSize: 10, height: 22, lineHeight: '25px', marginLeft: 10}}>
                            创建于:{createTime?.replace('T', ' ')}
                            {createTime !== updateTime && itemType === 1 ?
                              getLoopMemoTimeList(id, formatTime(updateTime))
                              :
                              ` ${completed ? '完成' : '修改'}于:` + formatTime(updateTime)
                            }
                          </div>
                        </div>
                        
                      </div>
                    }
                  />
                </Skeleton>
              </List.Item>
            )}
          />
          :
          <div className='loadMore' onClick={() => UserStore.setOpenModal(true)}>
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

export default observer(MemoDrawer)