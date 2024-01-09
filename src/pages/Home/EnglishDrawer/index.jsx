import {observer} from 'mobx-react-lite'
import React, {useEffect, useState} from "react";
import {Button, Divider, Drawer, Skeleton} from "antd";

import showOrNot from "../../../store/ShowOrNot";
import UserStore from "../../../store/UserStore";
import {getToDoItems} from "../../../request/homeRequest";
import EmptyList from "../../../compontets/special/EmptyList";

let total = 0;    // 初始化待办总数
let init = true // 第一次加载
function EnglishDrawer() {
    const [page, setPage] = useState(1);                         // 待办翻页
    const [listData, setListData] = useState([]);                  // 待办展示列表数据
    const [webLoading, setWebLoading] = useState(false);        // 网络加载
    const [refreshTrigger, setRefreshTrigger] = useState(true); // 刷新触发(值无意义，改变即刷新
    const [fModalData, setFModalData] = useState();            // 设置模态框数据
    const [formModal, setFormModal] = useState(false); // 是否显示新增或编辑的模态框。

    useEffect(() => {
        if (init && showOrNot.englishDrawerShow && UserStore.jwt) {
            init = false;
            getListData()
        }
    }, [showOrNot.englishDrawerShow])

    /** 获取列表数据 */
    const getListData = async () => {
        setWebLoading(true)     // 网络加载
        const resp = await getToDoItems(4, page)
        setWebLoading(false)    // 网络加载
        if (resp?.code === 1) {
            setListData([...listData, ...resp.data?.records])
            total = resp.data.total;
            setPage(page + 1)
        }
    }
    /** 获取尾部 */
    const getTail = () =>
        webLoading ? <Skeleton/>    // 加载中占位组件
            :
            total > listData.length ?
                <div className="loadMore">
                    <Button block onClick={() => getListData()}>加载更多</Button>
                </div>
                :
                total ? <Divider className='loadMore' plain>🥺到底啦🐾</Divider>
                    : <EmptyList/>   // 没有数据


    return (
        <Drawer placement="left"
                closeIcon={false}
                style={{opacity: 0.8}}
                open={showOrNot.englishDrawerShow}
                onClose={() => showOrNot.setEnglishDrawerShow(false)}
                title={<>备忘英语</>}
        >
            {UserStore.jwt ?
                <>
                    { /*获取列表数据*/ listData.map(item => <p key={item.id}>{item.content}</p>)}
                    { /*获取尾巴*/ getTail()}
                </>
                :
                <div className='loadMore' onClick={() => UserStore.setOpenModal(true)}>
                    <Divider plain>🥺<Button type="link">请先登录</Button>🐾</Divider>

                    <Skeleton/>
                    <Skeleton/>
                    <Skeleton/>
                </div>
            }
        </Drawer>
    )
}

export default observer(EnglishDrawer)