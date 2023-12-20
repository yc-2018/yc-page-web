import {observer} from 'mobx-react-lite'
import {Drawer, List, Skeleton, Button, Tag, Spin, Tooltip, Select, Divider, Badge,Space} from "antd";
import {PlusOutlined, SyncOutlined} from "@ant-design/icons";
import React, {useEffect, useState} from "react";

import showOrNot from "../../../store/ShowOrNot";
import UserStore from "../../../store/UserStore";
import {delToDoItem, getToDoItems, saveOrUpdateToDoItem} from "../../../request/homeRequest"
import FormModal from "../../../compontets/FormModal";
import './MemoDrawer.css'

let total = -1;    // 初始化待办总数
const MemoDrawer = observer(({setModalIsOpen}) => {
        const [initLoading, setInitLoading] = useState(true);       // 初始化加载
        const [itemLoading, setItemItemLoading] = useState(false);  // 底部加载
        const [webLoading, setWebLoading] = useState(false);        // 网络加载
        const [refreshTrigger, setRefreshTrigger] = useState(true); // 刷新触发(值无意义，改变即刷新
        const [data, setData] = useState([]);     // 待办列表数据
        const [list, setList] = useState([]);     // 待办展示列表
        const [page, setPage] = useState(1);    // 待办翻页
        const [type, setType] = useState(0);    // 待办类型
        const [unFinishCounts, setUnFinishCounts] = useState();     // 待办未完成计数
        const [completed, setCompleted] = useState(0);      // 查看待办状态（看未完成的：0,看已完成的：1,看全部的：-1）
        const [formModal, setFormModal] = useState(false);  // 是否显示新增或编辑的模态框。
        const [fModalData, setFModalData] = useState();             // 设置模态框数据



        useEffect(() => {
            if (UserStore.jwt) (async () => {
                setFModalData(null)     // 模态框数据重置 null和 undefined 来回切换
                setWebLoading(true)     // 网络加载
                setUnFinishCounts(null) // 待办未完成计数重置
                setList([]);            // 待办列表重置
                setPage(1)              // 待办翻页重置
                total = -1;                   // 待办总数重置
                // 使用 axios 发起请求 获取又一次初始化待办列表
                const resp = await getToDoItems(type, 1, completed);
                if (!(resp?.code === 1)) {
                    setInitLoading(false);
                    setWebLoading(false);
                    return;
                }
                const {data, map} = resp;
                setData(data.records);
                setList(data.records);
                total = data.total;
                if(completed===0) setUnFinishCounts(map.groupToDoItemsCounts)
                setInitLoading(false);
                setWebLoading(false);
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
            const {data:respData} = await getToDoItems(0, page + 1,completed);
            // 结合旧数据和新数据
            const newData = data.concat(respData.records);
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
            type===TypeNum?undefined:
                <Badge count={unFinishCounts?.[TypeNum]} size="small" offset={[-5, 2]} title={"未完成的条数"}>
                    <Tag className='pointer' color="processing" onClick={()=>setType(TypeNum)} >{typeName}</Tag>
                </Badge>
    // 当前所在标签名称
    const getNowTagName = () =>type===0? "普通" : type===1? "循环" : type===2? "长期" : type===3? "紧急" : type===5? "日记" : type===6? "工作" : "其他"

    const listHandleAction = async(event) => {

        const target = event.target;
        const action = target.getAttribute('data-action');
        const id = target.parentElement.getAttribute('data-id');
        const itemObj = list.find(item => item.id === parseInt(id));

        switch(action) {
            case 'edit':

                setFModalData(itemObj)
                setFormModal(true)
                break;

            case 'finish':
                // 如果按钮已经在完成确认状态
                if (target.classList.contains('confirm-finish')) {
                    setWebLoading(true)
                    // 是否完成状态的转换。
                    const finishResponse = await saveOrUpdateToDoItem({id, completed: itemObj.completed?0:1}, 'put')
                    if (finishResponse) setRefreshTrigger(!refreshTrigger)  // 刷新触发
                    setWebLoading(false)
                }else {
                    target.classList.add('confirm-finish');
                    target.textContent = `确定${itemObj.completed? '取消完成': '完成'}吗?`;
                    setTimeout(() => {
                        if (target?.classList?.contains('confirm-finish')) {
                            target.classList.remove('confirm-finish');
                            target.textContent = `${itemObj.completed?'取消完成':'完成'}`;
                        }
                    }, 3000);
                }
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
                    target.textContent = '确定删除?';
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
                        <div style={{marginBottom: 8}}>
                            {/*新增和编辑表单*/}
                            <FormModal isOpen={formModal} setOpen={setFormModal} data={fModalData} reList={setRefreshTrigger} currentMemoType={type}/>
                            <Tooltip title={'刷新当前待办'} mouseEnterDelay={0.6}>
                                <SyncOutlined className='refresh' spin={webLoading} onClick={()=> setRefreshTrigger(!refreshTrigger)}/>
                            </Tooltip>
                            备忘录
                            <Tag bordered={false} color="success" className={'ripple-tag'}>当前：{getNowTagName()}</Tag>
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
                        <Space>
                            {getTag(0, "普通")}
                            {getTag(1, "循环")}
                            {getTag(2, "长期")}
                            {getTag(3, "紧急")}
                            {getTag(5, "日记")}
                            {getTag(6, "工作")}
                            {getTag(7, "其他")}
                        </Space>
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

                                                <a data-action="finish">{item.completed? '取消': null}完成</a>
                                                {item.completed? null: <a data-action="edit">编辑</a> /*完成了就不要显示编辑了*/}
                                                <a data-action="delete">删除</a>
                                                <div style={{fontSize: 10}}>
                                                    创建于:{item?.createTime?.replace('T', ' ')}
                                                    {item.createTime !== item.updateTime? ` ${item.completed?'完成':'修改'}于:`+item.updateTime?.replace('T', ' '):null}
                                                </div>
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