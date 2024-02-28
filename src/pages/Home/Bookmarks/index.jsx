import React, {useEffect, useState} from "react";
import {Button, Dropdown} from "antd";
import {PlusOutlined} from "@ant-design/icons";

import BookmarksItem from "./BookmarksItem";
import MyDnd from "../../../compontets/MyDnd";
import {simulateBookmarks} from "../../../store/NoLoginData";
import UserStore from "../../../store/UserStore";
import JWTUtils from "../../../utils/JWTUtils";

export default function Bookmarks() {
    const [allBookmark, setAllBookmark] = useState([])              // 所有书签
    const [bookmarkGroupList, setBookmarkGroupList] = useState([])  // 书签组列表

    useEffect(() => {
        // 登录后获取本用户全部书签
        if (UserStore.jwt) (async()=>{
            // 获取云端全部书签
            const bookmarks = simulateBookmarks
            // 获取所有书签组 并整理
            setBookmarkGroupList(() => {
                const groups = bookmarks.filter(item => item.type === 1)
                const order = bookmarks.find(item => item.type === 0).sort.split('/').map(id => parseInt(id))
                return  groups.sort((a, b) => {
                    // 获取两个元素的id在排序顺序数组中的索引
                    const indexA = order.indexOf(a.id)
                    const indexB = order.indexOf(b.id)
                    // 比较这两个索引来决定顺序
                    return indexA - indexB
                })
            })
            setAllBookmark(bookmarks)   // 保存所有书签 给书签组里面的书签用
        })()
    }, [UserStore.jwt])

    /**
     * 分离并排序书签组里的书签
     */
    const getSortBookmarks = (bookmarks) => {
        const Bookmarks = allBookmark.filter(item => item.type === 2 && parseInt(item.sort)===bookmarks.id)
        const order = bookmarks.sort.split('/').map(id => parseInt(id))
        return  Bookmarks.sort((a, b) => {
            // 获取两个元素的id在排序顺序数组中的索引
            const indexA = order.indexOf(a.id)
            const indexB = order.indexOf(b.id)
            // 比较这两个索引来决定顺序
            return indexA - indexB
        })
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
                }}>
            <PlusOutlined/> {/*加号➕*/}
        </Button>

    return <>
        {!JWTUtils.isExpired() && bookmarkGroupList.length > 0 &&
            <MyDnd dndIds={bookmarkGroupList} setItems={setBookmarkGroupList}>
                {bookmarkGroupList.map(group =>
                    <MyDnd.Item key={group.id} id={group.id} styles={{padding: '1px 0'}}
                                drag={<span style={{color: '#00000030'}}>☰</span>}>
                        <Dropdown
                            dropdownRender={() =>
                                <div className={'ant-dropdown-menu'}>
                                    <BookmarksItem bookmarkItems={getSortBookmarks(group)}/>
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
