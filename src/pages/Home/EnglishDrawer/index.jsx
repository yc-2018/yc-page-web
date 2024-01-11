import {observer} from 'mobx-react-lite'
import React, {useEffect, useState} from "react";
import {Button, Divider, Drawer, Input, Skeleton, Space, Tag, Tooltip} from "antd";

import showOrNot from "../../../store/ShowOrNot";
import UserStore from "../../../store/UserStore";
import {getToDoItems} from "../../../request/homeRequest";
import EmptyList from "../../../compontets/special/EmptyList";
import {englishSortingOptions, tagList} from "../../../store/NoLoginData";
import MyButton from "../../../compontets/MyButton";
import {
    CheckOutlined,
    CloseOutlined,
    DeleteOutlined,
    EditOutlined,
    ExclamationCircleFilled, PlusOutlined,
    SyncOutlined
} from "@ant-design/icons";
import Msg from "../../../store/Msg";
import SortSelect from "../../../compontets/SortSelect";
import styles from "../../../common.module.css"

let total = 0;    // 初始化待办总数
let init = true  // 第一次加载
let page = 1     // 页码
let listData = [] // 列表数据

function EnglishDrawer() {
    const [webLoading, setWebLoading] = useState(false);        // 网络加载
    const [editId, setEditId] = useState(-1)                    // 编辑的id
    const [editEnglish, setEditEnglish] = useState(null)                // 编辑英语
    const [editChinese, setEditChinese] = useState(null)                // 编辑中文

    const {msg,md} = Msg

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

    /*添加一个单词的输入框而已*/
    const addEnglish = () => {
        if (!editId) return;  // 防止点太快了
        ++total
        listData = [{id: undefined}, ...listData]
        setEditId(undefined)
        setEditEnglish(undefined)
        setEditChinese(editChinese === undefined ? null : undefined) // 有效驱动页面变化
    }

    /** 编辑|新增 and 保存 */
    const editOrSave = item => {
        const {id, content} = item
        const [english, chinese] = content?.split('@@@')??[undefined, undefined]
        if (id===editId) {  // 编辑完成保存了
            if(!editEnglish?.trim() || !editChinese?.trim()) return msg.warning('输入框不能为空')
            if(editEnglish?.trim()?.length > 100 || editChinese?.trim()?.length > 100) return msg.warning('输入框最多100个字符')
            if(english?.trim()===editEnglish?.trim() && chinese?.trim()===editChinese?.trim()) return msg.info('没有变化',setEditId(-1))

            if(!editId) {
                msg.info('新增')
                item.id = Math.random()
            }

            msg.info(`█████████发请求${id}${editEnglish}${editChinese}`)
            // todo 失败就减 --total
            item.content=`███${editEnglish??''}@@@███${editChinese??''}`

            setEditId(-1)
        }   // 进入编辑状态
        else {
            !editId && listData.shift()
            setEditId(id)
            setEditChinese(chinese)
            setEditEnglish(english)
        }
    }
    /** 删除 or 取消*/
    const deleteOrCancel = item => {
        const {id} = item
        if (id === editId) {   // 取消编辑
            !editId && listData.shift() && msg.info('取消新增') && --total
            setEditId(-1)
        }
        else              // 请求删除
            md.confirm({
                title: '确定删除吗?',
                icon: <ExclamationCircleFilled />,
                content: '删除了就会消失了',
                onOk() {
                    --total
                    setEditId(-1 * id)  // 驱动页面变化，因为listData不是状态，无法驱动页面的改变,异步的放前面就行
                    listData = listData.filter(item => item.id !== id)
                    msg.info('█████████删除成功'+id)
                }
            });
    }

    /** 获取尾部 */
    const getTail = () =>
        webLoading ? <><Skeleton active/><Skeleton active/><Skeleton active/></>    // 加载中占位组件
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
            <Space key={item.id} className={[styles.topBottMargin5, item.id===editId? styles.borderLight:''].join(' ')} >
                <Space.Compact>
                    {/*查看时是编辑按钮 添加时是完成按钮*/}
                    <Button icon={editId===item.id?<CheckOutlined /> : <EditOutlined />}
                            onClick={() => {editOrSave(item)}}/>

                    <Input value={item.id===editId? editEnglish : item?.content?.split("@@@")?.[0]?? ''}
                           placeholder="请输入英文"
                           onChange={e => item.id===editId && setEditEnglish(e.target.value)}/>
                    <Input value={item.id === editId? editChinese :item?.content?.split("@@@")?.[1]?? ''}
                           placeholder="请输入中文"
                           onChange={e=> item.id === editId && setEditChinese(e.target.value)}/>

                    {/*查看时是删除按钮 编辑时是取消按钮*/}
                    <Button icon={editId===item.id?<CloseOutlined /> : <DeleteOutlined />}
                            className={styles.rightRadius6}
                            onClick={() => {deleteOrCancel(item)}} />
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
                        <SyncOutlined className='refresh' spin={webLoading} onClick={refresh}/> {/*刷新图标*/}
                        备忘英语
                        <Tooltip title={'添加一个单词'} mouseEnterDelay={1}>                      {/*添加图标*/}
                            <Button className={"addItemButton"} style={{visibility: editId?'visible': 'hidden'}}
                                    icon={<PlusOutlined/>} size={"small"}
                                    onClick={addEnglish}
                            />
                        </Tooltip>
                                                                                        {/*自己搞的《排序下拉框》*/}
                        <SortSelect
                            defaultValue={'5'}
                            onChange={(value) => console.log(`selected ${value}`)}
                            options={englishSortingOptions}
                            loading={webLoading}
                        />
                    </>
                }
        >
            {UserStore.jwt ?
                <>
                    <Space size={[0, 'small']} wrap>
                        { /*渲染26个字母*/ tagList.map(item => buildTag(item.value, item.color))}
                        { /*总数 */ buildTag(`条总数:${total}`)}
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