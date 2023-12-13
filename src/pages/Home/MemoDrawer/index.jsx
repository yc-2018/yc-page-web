import {observer} from 'mobx-react-lite'
import {Drawer,List, Skeleton, Button, Tag} from "antd";
import React, {useEffect, useState} from "react";

import showOrNot from "../../../store/ShowOrNot";
import UserStore from "../../../store/UserStore";
import {getToDoItems} from "../../../request/homeRequest"
import './MemoDrawer.css'

const MemoDrawer = observer(({setModalIsOpen}) => {
        const [initLoading, setInitLoading] = useState(true);
        const [loading, setLoading] = useState(false);  //
        const [data, setData] = useState([]);
        const [list, setList] = useState([]);

        useEffect(() => {
             if(UserStore.jwt&&list.length===0)(async() => {
            const response = await getToDoItems(0);
            setData(response.records);
            setList(response.records);
            setInitLoading(false);
            })();
        }, [UserStore.jwt]);
        const onLoadMore = async() => {
            setLoading(true);
            // setList(
            //     data.concat(
            //         [...new Array(10)].map(() => ({
            //             loading: true,
            //             name: {},
            //             picture: {},
            //         })),
            //     ),
            // );

            // 使用 axios 发起请求
            const response = await getToDoItems(0);
            // 结合旧数据和新数据
            // const newData = data.concat(response.results);
            // // setData(newData);
            // setList(newData);
            // setLoading(false);
            // // 触发 resize 事件
            // window.dispatchEvent(new Event('resize'));

        };

        // 显示加载更多？还是到底了
        const loadMore =
            !initLoading && !loading ? (
                <div className="loadMore">
                    <Button onClick={onLoadMore}>加载更多</Button>
                </div>
            ) : <div className="loadMore">到底啦</div>;

        return (
            <Drawer placement="right"
                    onClose={() => showOrNot.setMemoDrawerShow(false)}
                    open={showOrNot.memoDrawerShow}
                    style={{opacity: 0.8}}
                    closable={false}
                    title={<><div>备忘录<Tag bordered={false} color="success">普通待办</Tag></div>
                        <Tag color="processing">循环</Tag>
                        <Tag color="processing">长期</Tag>
                        <Tag color="processing">紧急</Tag>
                        <Tag color="processing">日记</Tag>
                        <Tag color="processing">工作</Tag>
                    </>}
            >
                {UserStore.jwt?
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
                                            <span style={{fontSize:10}}> 创建时间:{item.createTime.replace('T',' ')}</span>
                                        </div>
                                    }
                                />
                            </Skeleton>
                        </List.Item>
                    )}
                />:<div className='loadMore' onClick={()=>setModalIsOpen(true)}><Button type="link">请先登录</Button><Skeleton/><Skeleton/><Skeleton/> </div>
                }

            </Drawer>
        )
    }
)
export default MemoDrawer