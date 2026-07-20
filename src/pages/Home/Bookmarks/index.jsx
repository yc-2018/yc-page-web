import React, {useEffect, useState} from "react";
import {Button, Dropdown} from "antd";
import {HolderOutlined, PlusOutlined} from "@ant-design/icons";

import BookmarksItem from "@/pages/Home/Bookmarks/BookmarksItem";
import MyDnd from "@/components/MyDnd";
import FormModal from "./FormModal";
import UserStore from "@/store/UserStore";
import JWTUtils from "@/utils/JWTUtils";
import CommonStore from "@/store/CommonStore";
import ContextMenu from "@/components/ContextMenu";
import TryFavicon from "@/components/TryFavicon";
import action from "@/pages/Home/Bookmarks/action";
import {addBookmarks, dragSort, getBookmarks, updateBookmark} from "@/request/homeApi";
import styles from "./bookmark.module.css";

const BOOKMARK_GROUP_HANDLE_WIDTH = 23 // 书签组拖拽把手区域宽度

let setCurrentGroupItems;   //组内传过来的设置列表的方法 放在方法内会报错 应该是会重新变成空

export default function Bookmarks() {
  const [bookmarkGroupItems, setBookmarkGroupItems] = useState([])    // 初始不是书签组的书签列表
  const [bookmarkGroupOrder, setBookmarkGroupOrder] = useState()           // 书签组排序对象（拖动拿ID)
  const [bookmarkGroupList, setBookmarkGroupList] = useState([])     // 初始书签组列表

  const [openModal, setOpenModal] = useState(false)    // 是否打开表单模态框
  const [ModalType, setModalType] = useState(1)        // 表单模态框类型 书签还是书签组
  const [editObj, setEditObj] = useState()                    // 表单模态框编辑对象
  const [sort, setSort] = useState()                          // 那个书签组的新增点击了 它就是哪个书签组的id
  const [dropdownMinWidths, setDropdownMinWidths] = useState({}) // 每个书签组下拉框的最小宽度
  const dropdownTriggerRefs = React.useRef(new Map())          // 保存书签组下拉触发区域

  const {msg} = CommonStore

  /** 从云端重新读取书签树和所有排序版本。 */
  const refreshBookmarks = async () => {
    const bookmarks = await getBookmarks(); // 当前用户全部书签
    const groups = bookmarks.filter(item => item.type === 1); // 书签组
    const root = bookmarks.find(item => item.type === 0); // 根排序节点
    const order = root?.sort?.split('/').map(id => parseInt(id)); // 书签组顺序
    setBookmarkGroupList(groups.sort((a, b) => {
      if (!order) return 0
      return order.indexOf(a.id) - order.indexOf(b.id)
    }))
    setBookmarkGroupItems(bookmarks.filter(item => item.type !== 1))
    setBookmarkGroupOrder(root)
  }

  /** 下拉框打开时按触发区域宽度计算最小宽度，多出的23px用于覆盖拖拽把手区域 */
  const updateDropdownMinWidth = (id, open) => {
    if (!open) return
    const trigger = dropdownTriggerRefs.current.get(id)
    const width = trigger?.getBoundingClientRect().width
    if (!width) return
    const minWidth = width + BOOKMARK_GROUP_HANDLE_WIDTH
    setDropdownMinWidths(current => current[id] === minWidth
      ? current
      : {...current, [id]: minWidth}
    )
  }

  useEffect(() => {
    // 登录后获取本用户全部书签
    if (UserStore.jwt) refreshBookmarks()
  }, [UserStore.jwt])

  /** 分离并排序书签组里的书签 */
  const getSortBookmarks = (bookmarks) => {
    if (!bookmarks.sort) return []
    const Bookmarks = bookmarkGroupItems.filter(item => item.type === 2 && parseInt(item.sort) === bookmarks.id)
    const order = bookmarks.sort.toString().split('/').map(id => parseInt(id))
    return Bookmarks.sort((a, b) => {
      // 获取两个元素的id在排序顺序数组中的索引
      const indexA = order.indexOf(a.id)
      const indexB = order.indexOf(b.id)
      // 比较这两个索引来决定顺序
      return indexA - indexB
    })
  }

  /** 打开表单模态框设置数据 没登录就弹出登录框 */
  const setModal = (isOpen, type, obj = undefined) => {
    if (JWTUtils.isExpired()) {
      UserStore.setOpenModal(true)
      return msg.info('登录后方可添加书签')
    } else {
      setOpenModal(isOpen)
      setEditObj(obj)
      isOpen && setModalType(type)
    }
  }

  /** 给书签组设置书签分组：给新增表单用知道现在的表单是哪个分组 */
  const setGroup = (id, setItem) => {
    setSort(id)
    setCurrentGroupItems = setItem;
  }

  /** 添加书签|组请求 */
  const addBookmark = async (formData) => {
    const parent = ModalType === 1
      ? bookmarkGroupOrder
      : bookmarkGroupList.find(group => group.id === sort); // 本次排序要修改的父节点
    if (parent?.version === undefined) return '数据版本缺失，请刷新后重试'
    const bookmark = {...formData, type: ModalType, sort, parentVersion: parent.version};
    const id = await addBookmarks(bookmark)
    if (!id) {
      await refreshBookmarks()
      return '操作失败'
    }
    await refreshBookmarks()
  }

  /** 修改书签|组请求 */
  const updateBookmarks = async (formData) => {
    if (await updateBookmark(formData)) {
      await refreshBookmarks()
      return
    }
    await refreshBookmarks()
    return '操作失败'
  }

  /** 添加【书签组】按钮 */
  const addBookmarkGroupButton = () =>
    <Button
      size="small"
      type="dashed"
      onClick={() => setModal(true, 1)}
      className={styles.addGroupButton}
      icon={<PlusOutlined/>}
    >
    </Button>

  /** 拖动后请求排序 */
  const dragSortReq = async (dragEndList) => {
    const oldList = [...bookmarkGroupList]
    const sort = dragEndList.map(item => item.id).join('/')
    if (bookmarkGroupOrder?.version === undefined) return msg.error('数据版本缺失，请刷新后重试')
    const result = await dragSort({id: bookmarkGroupOrder.id, type: 0, sort, version: bookmarkGroupOrder.version})
    if (result) {
      await refreshBookmarks()
      msg.success('排序成功')
    }
    else {
      setBookmarkGroupList(oldList)
      await refreshBookmarks()
    }
  }

  /** 右键菜单点击后的功能 */
  const lambdaObj = action(
    setBookmarkGroupList,
    setModal,
    () => setGroup(null, setBookmarkGroupList),
    bookmarkGroupOrder?.version,
    refreshBookmarks,
  )


  return <>
    <FormModal
      open={openModal}
      setOpen={setOpenModal}
      obj={editObj}
      type={ModalType}
      addBookmark={addBookmark}
      updateBookmark={updateBookmarks}
    />
    {!JWTUtils.isExpired() && bookmarkGroupList.length > 0 &&
      <MyDnd
        dragEndFunc={dragSortReq}
        dndIds={bookmarkGroupList}
        setItems={setBookmarkGroupList}
        style={{display: 'flex', flexWrap: 'wrap', gap: 8, padding: 5}}
      >
        {bookmarkGroupList.map(group =>
          <MyDnd.Item
            key={group.id}
            id={group.id}
            className={styles.groupItem}
            drag={group.icon
              ? <TryFavicon iconUrl={group.icon} url={group.url} size={16} errSize={14}/>
              : <HolderOutlined className={styles.groupDragHandle}/>
            }
          >
            <Dropdown // 下拉菜单
              align={{offset: [-BOOKMARK_GROUP_HANDLE_WIDTH, 5]}}
              onOpenChange={open => updateDropdownMinWidth(group.id, open)}
              styles={{root: {minWidth: dropdownMinWidths[group.id]}}}
              popupRender={() =>
                <div className={'ant-dropdown-menu'}>
                  <BookmarksItem
                    bookmarkItems={getSortBookmarks(group)}
                    setModal={setModal}
                    setGroup={setGroup} // 新增时表单要用
                    group={group}
                    refreshBookmarks={refreshBookmarks}
                  />
                </div>
              }
            >
              <span
                ref={trigger => {
                  if (trigger) dropdownTriggerRefs.current.set(group.id, trigger)
                  else dropdownTriggerRefs.current.delete(group.id)
                }}
                className={styles.groupDropdownTrigger}
              > {/*不加一层span 2个下拉菜单直接嵌套控制台会有警告*/}
                <ContextMenu tag={group} lambdaObj={lambdaObj}>
                  <Button
                    type="text"
                    size="small"
                    href={group.url}
                    className={styles.groupButton}
                    target="_blank"
                  >
                    {group.name}
                  </Button>
                </ContextMenu>
              </span>
            </Dropdown>
          </MyDnd.Item>
        )}
        {/*添加书签组按钮*/ bookmarkGroupList.length < 16 && addBookmarkGroupButton()}
      </MyDnd>
    }
    {/*添加书签组按钮*/ bookmarkGroupList.length === 0 && addBookmarkGroupButton()}
  </>
}
