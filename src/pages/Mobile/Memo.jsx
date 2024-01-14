import React, {useEffect, useState} from 'react'
import {InfiniteScroll, List, SwipeAction, Toast} from 'antd-mobile'
import {getToDoItems, saveOrUpdateToDoItem} from "../../request/homeRequest";
import {leftActions, rightActions} from "./data";

export default () => {
    const [data, setData] = useState([])
    const [hasMore, setHasMore] = useState(true)
    const [page, setPage] = useState(1);    // 待办翻页
    const [type, setType] = useState(0);    // 待办类型
    const [unFinishCounts, setUnFinishCounts] = useState();      // 待办未完成计数
    const [completed, setCompleted] = useState(-1);      // 查看待办状态（看未完成的：0,看已完成的：1,看全部的：-1）
    async function loadMore() {
        const append = await getToDoItems({type, page, completed});
        setData(val => [...val, ...append.data.records])
        setHasMore(data.length < append.data.total)
        setPage(val => val + 1)
    }


    const showLoading = (icon, content) => {Toast.show({icon, content})}

    /** 执行动作 */
    const onAction =async action => {
        console.log('█████████',action)
        const {id, text} = action;
        switch (action.key) {
            // 取消|完成
            case 'success':
                showLoading('loading', '加载中…')
                const finishResp = await saveOrUpdateToDoItem({id, completed: text === '完成' ? 1 : 0}, 'put')
                finishResp?showLoading('success', '成功'):showLoading('fail', '失败')
                setData(val => val.map(item => item.id === id ? {...item, completed: text === '完成' ? 1 : 0} : item))
                break;

            // +1
            case 'addOne':
                break;
            case 'edit':
                // 编辑
                break;
            case 'delete':
                // 删除
                break;
            default:
                break;
        }
    }


    return(
        <>
            <List>
                {data.map(item => (
                    <SwipeAction key={item.id} leftActions={leftActions(item)} rightActions={rightActions(item.id)} onAction={onAction}>
                        <List.Item key={item.id} >{item.content}</List.Item>
                    </SwipeAction>
                ))}
            </List>
            <InfiniteScroll loadMore={loadMore} hasMore={hasMore}/>
        </>
    )

}