import {observer} from 'mobx-react-lite'

import showOrNot from "../../../store/ShowOrNot";
import {Drawer, Avatar, Divider, List, Skeleton, Button, Space} from "antd";
import React, {useEffect, useState} from "react";
import './MemoDrawer.css'
import axios from "axios";

const count = 5;
const fakeDataUrl = `https://randomuser.me/api/?results=${count}&inc=name,gender,email,nat,picture&noinfo`;

const MemoDrawer = observer(() => {
        const [initLoading, setInitLoading] = useState(true);
        const [loading, setLoading] = useState(false);
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
        const onLoadMore = () => {
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
            fetch(fakeDataUrl)
                .then((res) => res.json())
                .then((res) => {
                    const newData = data.concat(res.results);
                    setData(newData);
                    setList(newData);
                    setLoading(false);
                    // Resetting window's offsetTop so as to display react-virtualized demo underfloor.
                    // In real scene, you can using public method of react-virtualized:
                    // https://stackoverflow.com/questions/46700726/how-to-use-public-method-updateposition-of-react-virtualized
                    window.dispatchEvent(new Event('resize'));
                });
        };
        const loadMore =
            !initLoading && !loading ? (
                <div
                    style={{
                        textAlign: 'center',
                        marginTop: 12,
                        height: 32,
                        lineHeight: '32px',
                    }}
                >
                    <Button onClick={onLoadMore}>loading more</Button>
                </div>
            ) : null;

        return (
            <Drawer title="备忘录" placement="right" onClose={() => showOrNot.setMemoDrawerShow(false)}
                    open={showOrNot.memoDrawerShow} style={{opacity: 0.8}}
            >

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
                />

            </Drawer>
        )
    }
)
export default MemoDrawer