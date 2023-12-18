import {observer} from 'mobx-react-lite'
import {Drawer, List, Skeleton, Button, Tag, Spin, Tooltip, Select, Divider} from "antd";
import {PlusOutlined, SyncOutlined} from "@ant-design/icons";
import React, {useEffect, useState} from "react";

import showOrNot from "../../../store/ShowOrNot";
import UserStore from "../../../store/UserStore";
import {delToDoItem, getToDoItems, saveOrUpdateToDoItem} from "../../../request/homeRequest"
import FormModal from "../../../compontets/FormModal";
import './MemoDrawer.css'

let total = -1;    // 初始化待办总数
const MemoDrawer = observer(({setModalIsOpen}) => {
        const [initLoading, setInitLoading] = useState(true);
        const [itemLoading, setItemItemLoading] = useState(false);  // 底部加载
        const [webLoading, setWebLoading] = useState(false);        // 网络加载
        const [refreshTrigger, setRefreshTrigger] = useState(true); // 刷新触发(值无意义，改变即刷新
        const [data, setData] = useState([]);
        const [list, setList] = useState([]);
        const [page, setPage] = useState(1);    // 待办翻页
        const [type, setType] = useState(0);    // 待办类型
        const [completed, setCompleted] = useState(0); // 查看待办状态（看未完成的：0,看已完成的：1,看全部的：-1）
        const [formModal, setFormModal] = useState(false);
        const [fModalData, setFModalData] = useState();



        useEffect(() => {
            if (UserStore.jwt) (async () => {
                setWebLoading(true)
                setList([]);
                setPage(1)
                total = -1;
                const response = await getToDoItems(type, 1, completed);
                if (!response.records) {
                    setInitLoading(false);
                    setWebLoading(false);
                    return;
                }
                setData(response.records);
                setList(response.records);
                total = response.total;
                setInitLoading(false);
                setWebLoading(false)
            })();

        }, [UserStore.jwt, type,completed,refreshTrigger]);
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
            const response = await getToDoItems(0, page + 1,completed);
            // 结合旧数据和新数据
            const newData = data.concat(response.records);
            setData(newData);
            setList(newData);
            setItemItemLoading(false);
            setPage(page + 1);  // 异步放前面也没用
            // 触发 resize 事件
            // window.dispatchEvent(new Event('resize'));

        };

        // 显示加载更多？还是到底了
        const loadMore =
            !initLoading && !itemLoading && list.length < total ? (
                <div className="loadMore">
                    <Button block onClick={onLoadMore}>加载更多</Button>
                </div>
            ) : !itemLoading && list.length && <Divider className='loadMore' plain>🥺到底啦🐾</Divider>;


    // 标签生成
    const getTag = (TypeNum,typeName) =>
            type===TypeNum?undefined:<Tag className='pointer' color="processing" onClick={()=>setType(TypeNum)} >{typeName}</Tag>

    // 当前所在标签名称
    const getNowTagName = () =>type===0? "普通" : type===1? "循环" : type===2? "长期" : type===3? "紧急" : type===5? "日记" : type===6? "工作" : "其他"

    const listHandleAction = async(event) => {

        const target = event.target;
        const action = target.getAttribute('data-action');
        const id = target.parentElement.getAttribute('data-id');

        switch(action) {
            case 'edit':
                setFModalData(list.find(item => item.id === parseInt(id)))
                setFormModal(true)
                break;

            case 'finish':
                setWebLoading(true)
                const finishResponse = await saveOrUpdateToDoItem({id, completed: 1},'put')
                if(finishResponse) setRefreshTrigger(!refreshTrigger)  // 刷新触发
                setWebLoading(false)
                break;
            case 'noFinish':
                setWebLoading(true)
                const noFinishResponse = await saveOrUpdateToDoItem({id, completed: 0},'put')
                if(noFinishResponse) setRefreshTrigger(!refreshTrigger)  // 刷新触发
                setWebLoading(false)
                break;
            case 'delete':
                // 如果按钮已经在删除确认状态
                if (target.classList.contains('confirm-delete')) {
                    setWebLoading(true)
                    const deleteResponse = await delToDoItem(id)
                    if (deleteResponse) setRefreshTrigger(!refreshTrigger)  // 刷新触发
                    setWebLoading(false)
                }else {
                    target.classList.add('confirm-delete');
                    target.textContent = '确定删除';
                    setTimeout(() => {
                        if (target?.classList?.contains('confirm-delete')) {
                            target.classList.remove('confirm-delete');
                            target.textContent = '删除';
                        }
                    }, 3000);
                }
                break;
            // 可以添加其他案例
        }
    }



        return (

            <Drawer placement="right"
                    onClose={() => showOrNot.setMemoDrawerShow(false)}
                    open={showOrNot.memoDrawerShow}
                    style={{opacity: 0.8}}
                    closeIcon={false}
                    title={<>
                    <Spin spinning={webLoading} indicator={<></>}>
                        <div style={{marginBottom: 6}}>
                            {/*新增和编辑表单*/}
                            <FormModal isOpen={formModal} setOpen={setFormModal} data={fModalData}/>
                            <Tooltip title={'刷新当前待办'} mouseEnterDelay={0.6}>
                                <SyncOutlined className='refresh' spin={webLoading} onClick={()=> setRefreshTrigger(!refreshTrigger)}/>
                            </Tooltip>
                            备忘录
                            <Tag bordered={false} color="success">当前：{getNowTagName()}待办</Tag>
                            {/*下拉框选择看那种待办*/}
                            <Select
                                value={completed}
                                options={[
                                    {label: '未完成', value: 0, disabled:completed===0},
                                    {label: '已完成', value: 1, disabled:completed===1},
                                    {label: '全部', value: -1, disabled:completed===-1}
                                ]}
                                size='small'
                                onChange={value => setCompleted(value)}
                                style={{width: '6em'}}
                            />
                            <Tooltip title={'添加一个待办'} mouseEnterDelay={1}>
                                <Button
                                    icon={<PlusOutlined />}
                                    onClick={() => {
                                        setFModalData(undefined)
                                        setFormModal(true)
                                    }}
                                    size={"small"} className={"addItemButton"}
                                />
                            </Tooltip>
                        </div>
                        {getTag(0, "普通")}
                        {getTag(1, "循环")}
                        {getTag(2, "长期")}
                        {getTag(3, "紧急")}
                        {getTag(5, "日记")}
                        {getTag(6, "工作")}
                        {getTag(7, "其他")}
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
                            <List.Item key={item.id} className={item.completed&&'finish'}>
                                <Skeleton avatar title={false} loading={item.loading} active>
                                    <List.Item.Meta
                                        description={
                                            <div data-id={item.id}>
                                                {item.content}
                                                <br/>
                                                [
                                                {item.completed?<a data-action="noFinish">取消完成</a>:<a data-action="finish">完成</a>}|
                                                {item.completed?undefined:<><a data-action="edit">编辑</a>|</> /*完成了就不要显示编辑了*/}
                                                <a data-action="delete">删除</a>]
                                                <span
                                                    style={{fontSize: 10}}> 创建时间:{item?.createTime?.replace('T', ' ')}</span>
                                            </div>
                                        }
                                    />
                                </Skeleton>
                            </List.Item>
                        )}
                    />
                    :
                    <div className='loadMore' onClick={() => setModalIsOpen(true)}>
                        <Divider plain>🥺<Button type="link">请先登录</Button>🐾</Divider>

                        <Skeleton/>
                        <Skeleton/>
                        <Skeleton/>
                    </div>
                }
                </Spin>
            </Drawer>

        )
    }
)
export default MemoDrawer