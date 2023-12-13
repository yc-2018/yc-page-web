import {observer} from 'mobx-react-lite'
import axios from "axios";
import {Drawer,List, Skeleton, Button, Tag} from "antd";
import React, {useEffect, useState} from "react";

import showOrNot from "../../../store/ShowOrNot";
import UserStore from "../../../store/UserStore";
import './MemoDrawer.css'

const count = 5;
const fakeDataUrl = `https://randomuser.me/api/?results=${count}&inc=name,gender,email,nat,picture&noinfo`;

const MemoDrawer = observer(({setModalIsOpen}) => {
        const [initLoading, setInitLoading] = useState(true);
        const [loading, setLoading] = useState(false);  //
        const [data, setData] = useState([]);
        const [list, setList] = useState([]);
        useEffect(() => {
            fetch(fakeDataUrl)
                .then((res) => res.json())
                .then((res) => {
                    setInitLoading(false);
                    setData(res.results);
                    setList(res.results);
                });
        }, []);
        const onLoadMore =async () => {
            setLoading(true);
            setList(
                data.concat(
                    [...new Array(count)].map(() => ({
                        loading: true,
                        name: {},
                        picture: {},
                    })),
                ),
            );
            try {
                // 使用 axios 发起请求
                const response = await axios.get(fakeDataUrl);

                // 结合旧数据和新数据
                const newData = data.concat(response.data.results);
                setData(newData);
                setList(newData);
                setLoading(false);

                // 触发 resize 事件
                window.dispatchEvent(new Event('resize'));
            } catch (error) {
                // 错误处理
                console.error(error);
                setLoading(false);
            }
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
                        <List.Item>
                            <Skeleton avatar title={false} loading={item.loading} active>
                                <List.Item.Meta
                                    description={
                                        <div>
                                            {item.name?.last}内容，内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容
                                            <br/>
                                            [<a key="list-loadmore-success">完成</a>|
                                            <a key="list-loadmore-edit">编辑</a>|
                                            <a key="list-loadmore-more">删除</a>]
                                        </div>
                                    }
                                />
                            </Skeleton>
                        </List.Item>
                    )}
                />:<div className='loadMore' onClick={()=>setModalIsOpen(true)}><Button type="link">请先登录</Button><Skeleton/><Skeleton/><Skeleton/> </div>}

            </Drawer>
        )
    }
)
export default MemoDrawer