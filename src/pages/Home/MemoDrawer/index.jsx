import {observer} from 'mobx-react-lite'
import {Drawer, List, Skeleton, Button, Tag} from "antd";
import React, {useEffect, useState} from "react";

import showOrNot from "../../../store/ShowOrNot";
import UserStore from "../../../store/UserStore";
import {getToDoItems} from "../../../request/homeRequest"
import './MemoDrawer.css'

let total = 999;    // 待办总数
const MemoDrawer = observer(({setModalIsOpen}) => {
        const [initLoading, setInitLoading] = useState(true);
        const [loading, setLoading] = useState(false);  //
        const [data, setData] = useState([]);
        const [list, setList] = useState([]);
        const [page, setPage] = useState(1);    // 待办翻页
        const [type, setType] = useState(0);    // 待办类型


        useEffect(() => {
            setPage(1)
            if (UserStore.jwt) (async () => {
                const response = await getToDoItems(type, 1);
                setData(response.records);
                setList(response.records);
                total = response.total;
                setInitLoading(false);
            })();
        }, [UserStore.jwt, type]);
        const onLoadMore = async () => {
            setLoading(true);
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
            setLoading(false);
            setPage(page + 1);  // 异步放前面也没用
            // 触发 resize 事件
            window.dispatchEvent(new Event('resize'));

        };

        // 显示加载更多？还是到底了
        const loadMore =
            !initLoading && !loading && list.length < total ? (
                <div className="loadMore">
                    <Button onClick={onLoadMore}>加载更多</Button>
                </div>
            ) : !loading && <div className="loadMore">到底啦</div>;


    // 标签生成
    const getTag = (TypeNum,typeName) =>
            type===TypeNum?undefined:<Tag className='pointer' color="processing" onClick={()=>setType(TypeNum)} >{typeName}</Tag>

    // 当前所在标签名称
    const getNowTagName = () => type===0? "普通" : type===1? "循环" : type===2? "长期" : type===3? "紧急" : type===5? "日记" : type===6? "工作" : "未知"

        return (
            <Drawer placement="right"
                    onClose={() => showOrNot.setMemoDrawerShow(false)}
                    open={showOrNot.memoDrawerShow}
                    style={{opacity: 0.8}}
                    closable={false}
                    title={<>
                        <div>备忘录<Tag bordered={false} color="success">{getNowTagName()}待办</Tag></div>
                        {getTag(0, "普通")}
                        {getTag(1, "循环")}
                        {getTag(2, "长期")}
                        {getTag(3, "紧急")}
                        {getTag(5, "日记")}
                        {getTag(6, "工作")}

                    </>}
            >
                {UserStore.jwt ?
                    <List
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
                                            <div>
                                                {item.content}
                                                <br/>
                                                [<a key="list-loadmore-success">完成</a>|
                                                <a key="list-loadmore-edit">编辑</a>|
                                                <a key="list-loadmore-more">删除</a>]
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

            </Drawer>
        )
    }
)
export default MemoDrawer