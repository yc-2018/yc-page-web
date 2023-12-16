import {observer} from 'mobx-react-lite'
import {Drawer, List, Skeleton, Button, Tag, Spin, Tooltip} from "antd";
import React, {useEffect, useState} from "react";

import showOrNot from "../../../store/ShowOrNot";
import UserStore from "../../../store/UserStore";
import {getToDoItems, saveOrUpdateToDoItem} from "../../../request/homeRequest"
import './MemoDrawer.css'
import {SyncOutlined} from "@ant-design/icons";

let total = 999;    // 待办总数
const MemoDrawer = observer(({setModalIsOpen}) => {
        const [initLoading, setInitLoading] = useState(true);
        const [itemLoading, setItemItemLoading] = useState(false);  // 底部加载
        const [webLoading, setWebLoading] = useState(false);        // 网络加载
        const [refreshTrigger, setRefreshTrigger] = useState(true); // 刷新触发(值无意义，改变即刷新
        const [data, setData] = useState([]);
        const [list, setList] = useState([]);
        const [page, setPage] = useState(1);    // 待办翻页
        const [type, setType] = useState(0);    // 待办类型



        useEffect(() => {
            setWebLoading(true)
            setPage(1)
            if (UserStore.jwt) (async () => {
                const response = await getToDoItems(type, 1);
                setData(response.records);
                setList(response.records);
                total = response.total;
                setInitLoading(false);
                setWebLoading(false)
            })();

        }, [UserStore.jwt, type,refreshTrigger]);
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
            const response = await getToDoItems(0, page + 1);
            // 结合旧数据和新数据
            const newData = data.concat(response.records);
            setData(newData);
            setList(newData);
            setItemItemLoading(false);
            setPage(page + 1);  // 异步放前面也没用
            // 触发 resize 事件
            window.dispatchEvent(new Event('resize'));

        };

        // 显示加载更多？还是到底了
        const loadMore =
            !initLoading && !itemLoading && list.length < total ? (
                <div className="loadMore">
                    <Button onClick={onLoadMore}>加载更多</Button>
                </div>
            ) : !itemLoading && list.length && <div className="loadMore">到底啦</div>;


    // 标签生成
    const getTag = (TypeNum,typeName) =>
            type===TypeNum?undefined:<Tag className='pointer' color="processing" onClick={()=>setType(TypeNum)} >{typeName}</Tag>

    // 当前所在标签名称
    const getNowTagName = () =>type===0? "普通" : type===1? "循环" : type===2? "长期" : type===3? "紧急" : type===5? "日记" : type===6? "工作" : "未知"

    const listHandleAction = async(event) => {

        const target = event.target;
        const action = target.getAttribute('data-action');
        const id = target.parentElement.getAttribute('data-id');

        switch(action) {
            case 'edit':
                console.log('编辑操作，ID:', id);

                // 实现编辑逻辑
                break;
            case 'finish':
                setWebLoading(true)
                const response = await saveOrUpdateToDoItem({id, completed: 1},'put')
                if(response) setRefreshTrigger(!refreshTrigger)  // 刷新触发
                setWebLoading(false)
                break;
            case 'delete':
                console.log('删除操作，ID:', id);
                // 实现删除逻辑
                break;
            // 可以添加其他案例
        }
    }

        return (

            <Drawer placement="right"
                    onClose={() => showOrNot.setMemoDrawerShow(false)}
                    open={showOrNot.memoDrawerShow}
                    style={{opacity: 0.8}}
                    closable={false}
                    title={<>
                    <Spin spinning={webLoading} indicator={<></>}>
                        <div style={{marginBottom: 6}}>备忘录
                            <Tooltip title={'刷新当前待办'} mouseEnterDelay={0.6}>
                                <SyncOutlined className='refresh' spin={webLoading} onClick={()=> setRefreshTrigger(!refreshTrigger)}/>
                            </Tooltip>
                            <Tag bordered={false} color="success">当前：{getNowTagName()}待办</Tag>
                        </div>
                        {getTag(0, "普通")}
                        {getTag(1, "循环")}
                        {getTag(2, "长期")}
                        {getTag(3, "紧急")}
                        {getTag(5, "日记")}
                        {getTag(6, "工作")}
                    </Spin>
                    </>}
            >
                <Spin spinning={webLoading} tip={'正在加载'+getNowTagName()+'待办'}>
                {UserStore.jwt ?
                    <List
                        onClick={listHandleAction} // 在这里设置事件监听器
                        className="demo-loadmore-list"
                        loading={initLoading}
                        itemLayout="horizontal"
                        loadMore={loadMore}
                        dataSource={list}
                        renderItem={(item) => (
                            <List.Item key={item.id}>
                                <Skeleton avatar title={false} loading={item.loading} active>
                                    <List.Item.Meta
                                        description={
                                            <div data-id={item.id}>
                                                {item.content}
                                                <br/>
                                                [<a data-action="finish">完成</a>|
                                                <a data-action="edit">编辑</a>|
                                                <a data-action="delete">删除</a>]
                                                <span
                                                    style={{fontSize: 10}}> 创建时间:{item?.createTime?.replace('T', ' ')}</span>
                                            </div>
                                        }
                                    />
                                </Skeleton>
                            </List.Item>
                        )}
                    /> : <div className='loadMore' onClick={() => setModalIsOpen(true)}><Button
                        type="link">请先登录</Button><Skeleton/><Skeleton/><Skeleton/></div>
                }
                </Spin>
            </Drawer>

        )
    }
)
export default MemoDrawer