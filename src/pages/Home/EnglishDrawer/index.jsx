import {observer} from 'mobx-react-lite'
import React, {useEffect, useState} from "react";
import {Button, Divider, Drawer, Input, Skeleton, Space, Tag} from "antd";

import showOrNot from "../../../store/ShowOrNot";
import UserStore from "../../../store/UserStore";
import {getToDoItems} from "../../../request/homeRequest";
import EmptyList from "../../../compontets/special/EmptyList";
import {tagList} from "../../../store/NoLoginData";
import MyButton from "../../../compontets/MyButton";

let total = 0;    // 初始化待办总数
let init = true // 第一次加载

function EnglishDrawer() {
    const [page, setPage] = useState(1);                         // 待办翻页
    const [listData, setListData] = useState([]);                  // 待办展示列表数据
    const [webLoading, setWebLoading] = useState(false);        // 网络加载
    const [refreshTrigger, setRefreshTrigger] = useState(true); // 刷新触发(值无意义，改变即刷新

    useEffect(() => {
        if (init && showOrNot.englishDrawerShow && UserStore.jwt) {
            init = false;
            getListData()
        }
    }, [showOrNot.englishDrawerShow, UserStore.jwt])

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
                    <MyButton onClick={() => getListData()}>加载更多</MyButton>
                </div>
                :
                total ? <Divider className='loadMore' plain>🥺到底啦🐾</Divider>
                    : <EmptyList/>   // 没有数据

    const buildTag=(value, color="processing", bordered=false)=>
        <Tag key={value} bordered={bordered} color={color}>
            {value}
        </Tag>

    const buildList = () => listData.map(item =>
        (<Space key={item.id} >
            <Space.Compact size="large">
                <Button></Button>   {/*查看时是编辑按钮 添加时是完成按钮*/}
                <Input defaultValue={item?.content?.split("@@@")?.[0]} placeholder="英文"/>
                <Input defaultValue={item?.content?.split("@@@")?.[1]} placeholder="中文"/>
                <Button></Button>   {/*查看时是删除按钮 编辑时是取消按钮*/}
            </Space.Compact>
        </Space>))


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
                    <Space size={[0, 'small']} wrap>
                        { /*渲染26个字母*/ tagList.map(item => buildTag(item.value, item.color))}
                        { /*渲染列表*/ buildList()}
                    </Space>
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