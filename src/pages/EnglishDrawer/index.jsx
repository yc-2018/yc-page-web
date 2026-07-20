import {observer} from 'mobx-react-lite'
import React, {useEffect, useRef, useState} from "react";
import {App, Button, Divider, Drawer, Input, Skeleton, Space, Spin, Tag} from "antd";
import {
    CheckOutlined, CloseOutlined, DashboardOutlined, DeleteOutlined, DeleteTwoTone, EditOutlined,
    ExclamationCircleFilled, PlusCircleOutlined, SyncOutlined
} from "@ant-design/icons";

import showOrNot from "@/store/ShowOrNot";
import UserStore from "@/store/UserStore";
import CommonStore from "@/store/CommonStore";
import {englishSortingOptions, tagList} from "@/store/NoLoginData";
import MyEmpty from "@/components/common/MyEmpty";
import SortSelect from "@/components/SortSelect";
import LoaderWhite from "@/components/common/LoaderWhite";
import {addMemo, deleteMemo, getMemos, updateMemo} from "@/request/memoApi";
import JWTUtils from "@/utils/JWTUtils";



let total = 0;    // 初始化待办总数
let init = true  // 第一次加载
let page = 1     // 页码
let listData = [] // 列表数据
let keyword = ''   // 异步太讨厌了   还得多用一个变量

let orderBy = 5;     // 《表单》默认排序方式
let firstLetter = null; // 《表单》首字母

function EnglishDrawer() {
    const [webLoading, setWebLoading] = useState(false);        // 网络加载(加载列表和刷新用
    const [reqLoading, setReqLoading] = useState(false);        // 网络请求（单个处理
    const [editId, setEditId] = useState(-1)                    // 编辑的id
    const [editEnglish, setEditEnglish] = useState(null)                // 编辑英语
    const [editChinese, setEditChinese] = useState(null)                // 编辑中文
    const [searchEmpty, setSearchEmpty] = useState(true);      // 搜索框为空（搜索框有值没点搜索？）
    const [word,setWord] = useState(null)                              // 《表单》关键词
    const [shouldFocus, setShouldFocus] = useState(false);    // 是否获取焦点（感觉ref有点消耗性能)

    const loadMoreRef = useRef(null)                  // 自动翻页触底监听元素
    const webLoadingRef = useRef(false)               // 自动翻页请求锁
    const autoLoadFailedRef = useRef(false)           // 自动翻页失败暂停标记
    const {msg} = CommonStore
    const {  modal } = App.useApp();

    /** 初始化第一次打开时刷新列表数据 */
    useEffect(() => {
        if (init && showOrNot.englishDrawerShow && !JWTUtils.isExpired()) {
            init = false;
            getListData()
        }
    }, [showOrNot.englishDrawerShow, UserStore.jwt])

    /** 触底自动加载下一页 */
    useEffect(() => {
        const loadMoreElement = loadMoreRef.current;  // 底部触发器元素
        if (!loadMoreElement || webLoading || JWTUtils.isExpired() || !showOrNot.englishDrawerShow) return;
        if (autoLoadFailedRef.current) return;
        if (total <= listData?.length) return;

        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) getListData();
        }, {rootMargin: '120px'});

        observer.observe(loadMoreElement);
        return () => observer.disconnect();
    }, [webLoading, editId, showOrNot.englishDrawerShow, UserStore.jwt])

    /** 获取列表数据 */
    const getListData = async () => {
        if (webLoadingRef.current) return;
        webLoadingRef.current = true
        setWebLoading(true)     // 网络加载
        try {
            const resp = await getMemos({type:4, page,orderBy, firstLetter, keyword})
            if (resp.code === 1) {
                autoLoadFailedRef.current = false
                listData = ([...listData, ...resp.data.records])
                total = resp.data.total;
                page++
            } else {
                autoLoadFailedRef.current = true
            }
        } finally {
            webLoadingRef.current = false
            setWebLoading(false)    // 网络加载
        }
    }

    /** 刷新 */
    const refresh = () => {
        if (webLoading) return msg.info('正在加载中....')
        orderBy = 5;        // 《表单》默认排序方式
        firstLetter = null; // 《表单》首字母

        keyword = null              // 《表单》关键词
        setSearchEmpty(true) // 搜索框为空（搜索框有值没点搜索？）
        setWord(null)       //  《表单》关键词同步
        reset()
    }

    /** 不重置条件获取列表数据 */
    const reset = () => {
        autoLoadFailedRef.current = false
        listData = []
        page = 1
        getListData()
        setEditId(-1)
    }


    /** 添加一个单词的输入框而已 */
    const addEnglish = () => {
        if (!editId) return msg.info('请在列表一个条输入');  // 防止点太快了
        ++total
        listData = [{id: undefined}, ...listData]
        setEditId(undefined)
        setEditEnglish(undefined)
        setEditChinese(undefined)
        setShouldFocus(true) // 让编辑框自动获得焦点  顺便驱动页面变化
    }

    /** 编辑|新增 and 保存 */
    const editOrSave = async item => {
        const {id} = item
        const [english, chinese] = item?.content?.split('@@@')??[undefined, undefined]
        const content = `${editEnglish?.trim()??''}@@@${editChinese?.trim()??''}`
        if (id === editId) {  // 编辑完成保存了
            if(!editEnglish?.trim() || !editChinese?.trim()) return msg.warning('输入框不能为空')
            if(editEnglish?.trim()?.length > 100 || editChinese?.trim()?.length > 100) return msg.warning('输入框最多100个字符')
            if(content === item.content) return msg.info('没有变化',setEditId(-1))

            if(!editId) {   // 新增请求
                setReqLoading(true)
                const saveResp = await addMemo({itemType: 4,content})
                setReqLoading(false)
                if(saveResp) {
                    reset() // 新增后重新读取版本号，避免紧接着编辑使用空版本
                }
            }else{          // 修改请求
                setReqLoading(true)
                const updateResp = await updateMemo({id: item.id, version: item.version, content})
                setReqLoading(false)
                if(updateResp) {
                    setEditId(-1)
                    item.content = `${editEnglish ?? ''}@@@${editChinese ?? ''}`
                    item.version = updateResp.version
                }
            }
        }   // 进入编辑状态
        else {
            !editId && listData.shift() && --total  // 在新增状态下编辑，把新增没保存第第一条去掉
            setEditId(id)
            setEditChinese(chinese)
            setEditEnglish(english)
            setShouldFocus(true) // 让编辑框自动获得焦点
        }
    }
    /** 删除 or 取消*/
    const deleteOrCancel =async item => {
        const {id} = item
        if (id === editId) {   // 取消编辑
            !editId && listData.shift() && msg.info('取消新增') && --total
            setEditId(-1)
        }
        else              // 请求删除
            modal.confirm({
                title: '确定删除吗?',
                icon: <ExclamationCircleFilled />,
                content: '删除了就会消失了',
                mask: {closable: true},  // 点遮罩可以关闭
                onOk () {
                    return new Promise(async (resolve, reject)=>{
                        if (item.version === undefined) {
                            msg.error('数据版本缺失，请刷新后重试')
                            return reject()
                        }
                        const delResp = await deleteMemo(id, item.version)
                        if (delResp) {
                            --total
                            setEditId(-1 * id)  // 驱动页面变化，因为listData不是状态，无法驱动页面的改变,异步的放前面就行
                            listData = listData.filter(item => item.id !== id)
                            return resolve()    // 成功,关闭按钮加载 关闭窗口
                        }
                        return reject() // 失败，关闭按钮加载,关闭窗口
                    })
                }
            });
    }


    /** 获取尾部 */
    const getTail = () =>
        webLoading ? <><Skeleton active/><Skeleton active/><Skeleton active/></>    // 加载中占位组件
            :
            autoLoadFailedRef.current ?
                <div className="loadMore">加载失败，点击刷新后重试</div>
                :
            total > listData?.length ?
                <div className="loadMore" ref={loadMoreRef}>
                    下滑自动加载更多...
                </div>
                :
                total ? <Divider className='loadMore' plain>🥺到底啦🐾</Divider>
                    : <MyEmpty/>   // 没有数据

    /** 标签生成器 */
    const buildTag=(value, color="processing",icon, onClick, outlined=false)=>
        <Tag key={value}
             icon={icon}
             color={color}
             onClick={onClick}
             variant={outlined ? 'outlined' : 'filled'}
             className={`pointer ${firstLetter===value? 'eCurrentTag': ''}`}
        >
            {value}
        </Tag>

    /** 英语列表生成器 */
    const buildList = () => listData?.map(item => (
            <Space key={item.id?? 'newItem'} className={['topBottMargin5', (item.id===editId && 'borderLight')||''].join(' ')} >
                <Space.Compact>
                    {/*查看时是编辑按钮 添加时是完成按钮*/}
                    <Button icon={editId===item.id?<CheckOutlined /> : <EditOutlined />}
                            onClick={() => {editOrSave(item)}}/>

                    <Input value={item.id===editId? editEnglish : item?.content?.split("@@@")?.[0]?? ''}
                           placeholder="请输入英文"
                           onChange={e => item.id===editId && setEditEnglish(e.target.value)}
                           ref={input => shouldFocus && item.id===editId && (setShouldFocus(false) || input?.focus() )}
                           onPressEnter={() => editOrSave(item)}
                    />

                    <Input value={item.id === editId? editChinese :item?.content?.split("@@@")?.[1]?? ''}
                           placeholder="请输入中文"
                           onChange={e=> item.id === editId && setEditChinese(e.target.value)}
                           onPressEnter={() => editOrSave(item)}
                    />

                    {/*查看时是删除按钮 编辑时是取消按钮*/}
                    <Button icon={editId===item.id?<CloseOutlined /> : <DeleteOutlined />}
                            className={'rightRadius6'}
                            onClick={() => deleteOrCancel(item)} />
                </Space.Compact>
            </Space>
        )
    )


    return (
        <Drawer placement="left"
                size={450}
                closeIcon={false}
                style={{opacity: 0.8}}
                open={showOrNot.englishDrawerShow}
                onClose={() => showOrNot.setEnglishDrawerShow(false)}
                title={
                    <Spin indicator={<></>} spinning={reqLoading}>
                        <SyncOutlined className='refresh' spin={webLoading} onClick={refresh}/> {/*刷新图标*/}
                        备忘英语
                    </Spin>
                }
                extra={!JWTUtils.isExpired() && <>
                    <SortSelect             /*自己搞的《排序下拉框》*/
                        value={orderBy}
                        onChange={value => reset(orderBy = value)/*这不是传参，就是赋值*/}
                        options={englishSortingOptions}
                        loading={webLoading}
                    />
                </>}

                /* 底部搜索框*/
                footer={!JWTUtils.isExpired() &&
                    <Space style={{display: 'grid', justifyContent: 'center'}}>    {/*居中*/}
                        <Space.Compact>
                            <Button icon={searchEmpty ? <DeleteOutlined/> : <DeleteTwoTone twoToneColor={'red'}/>}
                                    onClick={()=>{
                                        keyword = null
                                        !searchEmpty && reset()
                                        setSearchEmpty(true)
                                        setWord(null)
                                    }}/>
                            <Input.Search placeholder="要搜索内容吗😶‍🌫️"
                                          value={word}
                                          style={{width: 300}}
                                          onChange={v => setWord(v.target.value) || (keyword = v.target.value)}
                                          onSearch={() => word && ((reset() || setSearchEmpty(false)))}/>
                        </Space.Compact>
                    </Space>
                }
        >
            {!JWTUtils.isExpired() ?
                <Spin indicator={<LoaderWhite/>} spinning={reqLoading}>
                    <Space size={[0, 'small']} wrap>
                        { /*渲染26个字母*/ tagList.map(item => buildTag(item.value, item.color,undefined,()=> {
                            if (item.value === firstLetter) return reset(firstLetter=undefined)
                            firstLetter = item.value
                            reset()
                        }))}
                        { /*添加一条 */ buildTag(`添加一条`, '#75b659', <PlusCircleOutlined />, addEnglish)}
                        { /*重置列表 */ buildTag('重置列表', '#fa575c', <SyncOutlined spin={webLoading}/>, refresh)}
                        { /*总数 */ buildTag(`总数:${total}`, '#55acee', <DashboardOutlined />)}
                    </Space>
                    { /*渲染列表*/ buildList()}
                    { /*获取尾巴*/ getTail()}
                </Spin>
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
