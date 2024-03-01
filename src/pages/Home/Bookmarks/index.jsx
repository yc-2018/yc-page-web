import React, {useEffect, useState} from "react";
import {Button, Dropdown} from "antd";
import {PlusOutlined} from "@ant-design/icons";

import BookmarksItem from "./BookmarksItem";
import MyDnd from "../../../compontets/MyDnd";
import FormModal from "./FormModal";
import UserStore from "../../../store/UserStore";
import JWTUtils from "../../../utils/JWTUtils";
import {addBookmarks, getBookmarks} from "../../../request/homeRequest";
import CommonStore from "../../../store/CommonStore";

let setCurrentGroupItems;   // 放在方法内会报错 应该是会重新变成空

export default function Bookmarks() {
    const [bookmarkGroupItems, setBookmarkGroupItems] = useState([])    // 初始不是书签组的书签列表
    const [bookmarkGroupOrder, setBookmarkGroupOrder] = useState()           // 书签组排序对象（拖动拿ID)
    const [bookmarkGroupList, setBookmarkGroupList] = useState([])     // 初始书签组列表

    const [openModal, setOpenModal] = useState(false)    // 是否打开表单模态框
    const [ModalType, setModalType] = useState(1)        // 表单模态框类型 书签还是书签组
    const [editObj, setEditObj] = useState()                    // 表单模态框编辑对象
    const [sort, setSort] = useState()                          // 那个书签组的新增点击了 它就是哪个书签组的id

    const {msg} = CommonStore

    useEffect(() => {
        // 登录后获取本用户全部书签
        if (UserStore.jwt) (async()=>{
            // 获取云端全部书签
            const bookmarks = await getBookmarks()
            // 获取所有书签组 并整理
            setBookmarkGroupList(() => {
                const groups = bookmarks.filter(item => item.type === 1)
                const order = bookmarks.find(item => item.type === 0)?.sort?.split('/').map(id => parseInt(id))
                if (groups.length===0 || !order) return []
                return  groups.sort((a, b) => {
                    // 获取两个元素的id在排序顺序数组中的索引
                    const indexA = order.indexOf(a.id)
                    const indexB = order.indexOf(b.id)
                    // 比较这两个索引来决定顺序
                    return indexA - indexB
                })
            })
            setBookmarkGroupItems(bookmarks.filter(item => item.type !== 1)) // 保存不是书签组书签 给书签组里面的书签用
            setBookmarkGroupOrder(bookmarks.find(item => item.type === 0))  // 保存书签组排序对象
        })()
    }, [UserStore.jwt])

    /**
     * 分离并排序书签组里的书签
     */
    const getSortBookmarks = (bookmarks) => {
        if (!bookmarks.sort) return []
        const Bookmarks = bookmarkGroupItems.filter(item => item.type === 2 && parseInt(item.sort)===bookmarks.id)
        const order = bookmarks.sort.toString().split('/').map(id => parseInt(id))
        return  Bookmarks.sort((a, b) => {
            // 获取两个元素的id在排序顺序数组中的索引
            const indexA = order.indexOf(a.id)
            const indexB = order.indexOf(b.id)
            // 比较这两个索引来决定顺序
            return indexA - indexB
        })
    }

    /**
     * 打开表单模态框设置数据 没登录就弹出登录框
     */
    const setModal = (isOpen, type, obj) => {
        if (JWTUtils.isExpired()){
            UserStore.setOpenModal(true)
            return msg.info('登录后可添加书签')
        }else {
            setOpenModal(isOpen)
            setEditObj(obj)
            isOpen && setModalType(type)
        }
    }


    const setGroup = (id,setItem) => {
        setSort(id)
        setCurrentGroupItems=setItem;
    }

    /**
     * 添加书签|组请求
     */
    const addBookmark = async (formData) => {
        const bookmark = {...formData, type: ModalType, sort};
        const id = await addBookmarks(bookmark)
        if (id && ModalType===1) setBookmarkGroupList(bookmarkGroups => [...bookmarkGroups, {...bookmark,id}])
        else if (id && ModalType===2) setCurrentGroupItems(Items => [...Items, {...bookmark,id}])
        else return '操作失败'
    }

    /**
     * 添加【书签组】按钮
     */
    const addBookmarkGroupButton = () =>
        <Button type="dashed" ghost size={'small'}
                style={{
                    textShadow: ' 0px 0px 5px #abc9ec',
                    borderColor: 'rgb(0 0 0 / 18%)',
                    margin: '1px 7px',
                    width:30
                }}
                onClick={() => setModal(true, 1)}
        >
            <PlusOutlined/> {/*加号➕*/}
        </Button>

    return <>
        <FormModal open={openModal} setOpen={setOpenModal} obj={editObj} type={ModalType} addBookmark={addBookmark}/>
        {!JWTUtils.isExpired() && bookmarkGroupList.length > 0 &&
            <MyDnd dndIds={bookmarkGroupList} setItems={setBookmarkGroupList}>
                {bookmarkGroupList.map(group =>
                    <MyDnd.Item key={group.id} id={group.id} styles={{padding: '1px 0'}}
                                drag={<span style={{color: '#00000030'}}>☰</span>}>
                        <Dropdown
                            dropdownRender={() =>
                                <div className={'ant-dropdown-menu'}>
                                    <BookmarksItem bookmarkItems={getSortBookmarks(group)}
                                                   setModal={setModal}
                                                   setGroup={setGroup} // 新增时表单要用
                                                   groupId={group.id}
                                    />
                                </div>
                            }
                        >
                            <Button ghost           // 使按钮背景透明
                                    type="dashed"
                                    size='small'
                                    href={group.url}
                                    style={{textShadow: ' 0px 0px 5px #abc9ec', borderColor: 'rgb(0 0 0)'}}
                                    target="_blank"
                            >
                                {group.name}
                            </Button>
                        </Dropdown>
                    </MyDnd.Item>
                )}
                {/*添加书签组按钮*/ bookmarkGroupList.length < 16 && addBookmarkGroupButton()}
            </MyDnd>
        }
        {/*添加书签组按钮*/ bookmarkGroupList.length === 0 && addBookmarkGroupButton()}
    </>
}
