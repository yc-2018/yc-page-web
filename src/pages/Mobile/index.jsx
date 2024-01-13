import React, { useState } from 'react'
import { InfiniteScroll, List } from 'antd-mobile'
import {getToDoItems} from "../../request/homeRequest";

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
                setPage(page + 1)
        }

        return (
            <>
                    <List>
                            {data.map(item => (
                                <List.Item key={item.id}>{item.content}</List.Item>
                            ))}
                    </List>
                    <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
            </>
        )
}