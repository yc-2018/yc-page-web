import {observer} from 'mobx-react-lite'
import React, {useEffect, useState} from "react";
import {Button, Divider, Drawer, Input, Skeleton, Space, Tag} from "antd";

import showOrNot from "../../../store/ShowOrNot";
import UserStore from "../../../store/UserStore";
import {getToDoItems} from "../../../request/homeRequest";
import EmptyList from "../../../compontets/special/EmptyList";
import {englishSortingOptions, tagList} from "../../../store/NoLoginData";
import MyButton from "../../../compontets/MyButton";
import {DeleteOutlined, EditOutlined, SyncOutlined} from "@ant-design/icons";
import Msg from "../../../store/Msg";
import SortSelect from "../../../compontets/SortSelect";
import styles from "../../../common.module.css"

let total = 0;    // 初始化待办总数
let init = true  // 第一次加载
let page = 1     // 页码
let listData = [] // 列表数据

function EnglishDrawer() {
    const [webLoading, setWebLoading] = useState(false);        // 网络加载

    const {msg} = Msg

    /** 初始化第一次打开时刷新列表数据 */
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
            listData = ([...listData, ...resp.data?.records])
            total = resp.data.total;
            page++
        }
    }

    /** 刷新 */
    const refresh = () => {
        if (webLoading) return msg.info('正在加载中....')
        listData = []
        page = 1
        getListData()
    }

    /** 获取尾部 */
    const getTail = () =>
        webLoading ? <Skeleton/>    // 加载中占位组件
            :
            total > listData?.length ?
                <div className="loadMore">
                    <MyButton onClick={() => getListData()}>加载更多</MyButton>
                </div>
                :
                total ? <Divider className='loadMore' plain>🥺到底啦🐾</Divider>
                    : <EmptyList/>   // 没有数据

    /** 标签生成器 */
    const buildTag=(value, color="processing", bordered=false)=>
        <Tag key={value} bordered={bordered} color={color} className={styles.pointer}>
            {value}
        </Tag>

    /** 英语列表生成器 */
    const buildList = () => listData?.map(item => (
            <Space key={item.id} className={styles.topBottMargin5}>
                <Space.Compact>
                    <Button icon={<EditOutlined />} /> {/*查看时是编辑按钮 添加时是完成按钮*/}
                    <Input value={item?.content?.split("@@@")?.[0]} placeholder="请输入英文"/>
                    <Input value={item?.content?.split("@@@")?.[1]} placeholder="请输入中文"/>
                    <Button icon={<DeleteOutlined />} className={styles.rightRadius6}/> {/*查看时是删除按钮 编辑时是取消按钮*/}
                </Space.Compact>
            </Space>
        )
    )


    return (
        <Drawer placement="left"
                closeIcon={false}
                style={{opacity: 0.8}}
                open={showOrNot.englishDrawerShow}
                onClose={() => showOrNot.setEnglishDrawerShow(false)}
                title={
                    <>
                        <SyncOutlined className='refresh' spin={webLoading} onClick={refresh}/>
                        备忘英语
                        <SortSelect
                            defaultValue={'5'}
                            onChange={(value) => console.log(`selected ${value}`)}
                              options={englishSortingOptions}
                        />
                    </>
                }
        >
            {UserStore.jwt ?
                <>
                    <Space size={[0, 'small']} wrap>
                        { /*渲染26个字母*/ tagList.map(item => buildTag(item.value, item.color))}
                    </Space>
                    { /*渲染列表*/ buildList()}
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