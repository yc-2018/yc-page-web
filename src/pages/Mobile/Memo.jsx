import React, {useEffect, useRef, useState} from 'react'
import {
    InfiniteScroll, List, Popup, SwipeAction, Toast,
    Button, Tag, Radio, TextArea, Dialog, Picker,
    PullToRefresh, SearchBar, Badge
} from 'antd-mobile'

import {delToDoItem, getToDoItems, saveOrUpdateToDoItem, selectLoopMemoTimeList} from "../../request/homeRequest";
import {finishName, columns, leftActions, rightActions, orderByName} from "./data";
import styles from './mobile.module.css'


/**
 * @param type 要渲染的待办类型
 * @param setIncompleteCounts 给父组件传值：未完成总数s
 * @param changeType 监控值，如果和类型相同 就 重置该待办列表
 * @param setChangeType 如果新增或修改的类型不是目前待办的列表类型，就改变这个值为那个待办类型的值
 * */
export default ({type, setIncompleteCounts,changeType, setChangeType}) => {
    let total;  // 总条数 给父组件显示

    const [data, setData] = useState([])
    const [hasMore, setHasMore] = useState(true)         // 是否自动翻页
    const [page, setPage] = useState(1);                 // 待办翻页
    const [completed, setCompleted] = useState(0);       // 查看待办状态（看未完成的：0,看已完成的：1,看全部的：-1）
    const [orderBy,setOrderBy] = useState(1)             // 排序
    const [keyword, setKeyword] = useState(null)                 // 搜索关键字
    const [visible, setVisible] = useState(undefined);           // 查看弹窗的显示和隐藏
    const [editVisible, setEditVisible] = useState(undefined);   // 编辑弹窗的显示和隐藏
    const [loopTime, setLoopTime] = useState(undefined)          // 循环时间弹窗的显示和隐藏(用数据来控制)
    const [loopTimeHasMore, setLoopTimeHasMore] = useState(null) // 循环时间是否自动翻页(布尔值bug有时无法启动副作用的启动)
    const [loopTimePage, setLoopTimePage] = useState(1);          // 循环时间页数
    const [pickerVisible, setPickerVisible] = useState(false)    // 待办状态选择器的显示和隐藏

    const [content, setContent] = useState('')   // 表单内容
    const [itemType, setItemType] = useState(0) // 表单类型

    useEffect(()=>{type === changeType && resetList()},[changeType])
    useEffect(()=>{resetList()},[completed,orderBy])
    useEffect(()=>{loopTimeHasMore && showLoopTime(visible.id)},[loopTimeHasMore])


    const textRef = useRef(null)  // 搜索框的ref 让它能自动获得焦点
    const loading = useRef()          // 显示加载中

    /** 重置列表 */
    const resetList = () => {
        setPage(1)
        setData([])
        setHasMore(true)
    }

    /** 加载更多 */
    const loadMore = async() => {
        const append = await getToDoItems({type, page, completed,orderBy,keyword});
        if (!append) return showLoading('fail', '获取数据失败') || setHasMore(false)
        setData(val => [...val, ...append.data.records])
        setHasMore(data.length < append.data.total)
        setPage(val => val + 1)

        total = append.data.total
        // 给父组件传值：未完成总数s
        setIncompleteCounts(v=>({...v,...append?.map.groupToDoItemsCounts, [type]: total}))
    }

    /**
     * 改变总数 给父组件传值：未完成总数s*/
    const changeTotal = (add='++') => {
        if(add==='++') ++total
        else --total
        setIncompleteCounts(v => ({...v, [type]: total}))
    }


    const showLoading = (icon, content) => {Toast.show({icon, content})}

    /** 执行动作 */
    const onAction =async action => {
        const {id, text} = action;
        switch (action.key) {
            // 取消|完成
            case 'success':
                showLoading('loading', '加载中…')
                const finishResp = await saveOrUpdateToDoItem({id, completed: text === '完成' ? 1 : 0}, 'put')
                if(finishResp){
                    Toast.show({icon: 'success', content: '成功'})
                    /*全部的还是要显示在列表上*/completed === -1 && setData(val => val.map(item => item.id === id ? {...item, completed: text === '完成' ? 1 : 0, updateTime: new Date().toLocaleString()} : item))
                    /*类型变了不属于显示范畴了*/completed !== -1 && setData(val => val.filter(item => item.id !== id))

                    setVisible(undefined)

                    changeTotal(text === '完成' ? '--' : '++')// █给父组件传值：未完成总数s
                }else Toast.show({icon: 'fail', content: '失败'})
                break;

            // +1
            case 'addOne':
                showLoading('loading', '加载中…')
                const addOneResp = await saveOrUpdateToDoItem({id, numberOfRecurrences:777}, 'put')
                if(addOneResp){
                    Toast.show({icon: 'success', content: '成功'})
                    setData(val => val.map(item => item.id === id ? {...item, numberOfRecurrences:item.numberOfRecurrences +1, updateTime: new Date().toLocaleString() } : item))
                    setVisible(undefined)
                }else Toast.show({icon: 'fail', content: '失败'})
                break;

            // 编辑
            case 'edit':
                setVisible(undefined)
                const obj = data.find(item => item.id === id);
                setEditVisible(obj);
                setContent(obj.content);
                setItemType(obj.itemType)
                window.setTimeout(() => {
                    textRef.current?.focus()                                            // 获得焦点
                    const length = obj.content.length                                  // 获取输入框字符串的长度
                    textRef.current.nativeElement.setSelectionRange(length, length)   // 设置光标位置在最后
                }, 100)                         // 点击添加按钮后自动获得焦点,但是没在页面上所以要延迟一点点
                break;

            // 删除
            case 'delete':
                await Dialog.confirm({
                    content: '确定删除该条备忘吗',
                    onConfirm: async () => {
                        const deleteResponse = await delToDoItem(id)
                        if(deleteResponse){
                            Toast.show({icon: 'success', content: '删除成功'})
                            // 刷新列表
                            setData(val => val.filter(item => item.id !== id))
                            setVisible(undefined)
                            action.completed === 0 && changeTotal('--')// █给父组件传值：未完成总数s
                        }else Toast.show({icon: 'fail', content: '删除失败'})

                    },
                })
        }
    }

    /*打开添加弹窗*/
    const openAdd = () => {
        setEditVisible('新增');
        setContent('');
        setItemType(type);
        window.setTimeout(() => textRef.current?.focus(), 100) // 点击添加按钮后自动获得焦点,但是没在页面上所以要延迟一点点

    }

    /** 编辑或新增的提交表单 */
    const submit = async () => {
        if (content?.length === 0) return Toast.show({icon: 'fail', content: '内容不能为空'})
        // if (!itemType) return Toast.show({icon: 'fail', content: '类型不能为空'})

        // 构造请求体
        let body = {};
        body.content = content === editVisible?.content ? null : content;       // 内容不一致时才更新
        body.itemType = itemType === editVisible?.itemType ? null : itemType;   // 内容不一致时才更新
        if (!body.content && !body.itemType) return Toast.show({icon: 'fail', content: '没有变化'}) && setEditVisible(false)
        body.id = editVisible?.id;
        showLoading('loading', '处理中…')
        let result = await saveOrUpdateToDoItem(body, editVisible === '新增' ? 'post' : "put");
        if(result) {
            showLoading('success', '成功')
            setEditVisible(false);

            if (editVisible === '新增') {
                if (type !== body.itemType) return setChangeType(body.itemType);  /* 新增的待办不是当前类型，那个重置的数据 */
                // 新增的待办是当前类型，那么更新本地数据
                setData(data => [{
                    ...body,
                    id: result,
                    createTime: new Date().toLocaleString(),
                    updateTime: new Date().toLocaleString(),
                    numberOfRecurrences: 0,
                    completed:0
                }, ...data])
                changeTotal('++')/* █给父组件传值：未完成总数s */
                // 修改 而且修改的待办是当前类型，那么更新本地数据
            } else if (body.itemType === null)
                setData(data => data.map(item => item.id === editVisible?.id ? {
                    ...item,
                    itemType: body.itemType || item.itemType,
                    content: body.content || item.content,
                    updateTime: new Date().toLocaleString()
                } : item))
            else {  // 把类型修改到别的地方去了 就不要它了
                setData(data => data.filter(item => item.id !== body.id))
                setChangeType(body.itemType)
            }
        }else showLoading('fail', '失败')
    }


    /**
     * 获取循环时间显示
     * */
    const showLoopTime = async id => {
        if (!id) id = loopTime?.[0]?.toDoItemId
        const resp = await selectLoopMemoTimeList(id, loopTimePage);
        loading.current?.close()    // 关闭加载蒙版
        if (resp?.records?.length > 0) {
            setLoopTimePage(i=> i + 1)
            setLoopTime(list=> [...list??[], ...resp.records])
        }
        else Toast.show({icon: 'fail', content: '获取失败'})
        if (resp?.records?.length % 10 !== 0 && (loopTime?.length ?? 0 + resp?.records?.length > resp?.total ?? 0))
            setLoopTimeHasMore(false)
    }

    return(
        <>
            <Button onClick={openAdd}>添加一条</Button>
            <Button onClick={() => setPickerVisible(true)}>{/*状态:*/}{finishName(completed)} & {/*排序:*/}{orderByName(orderBy)}</Button>
            {/*todo：状态和排序可以改成下来菜单*/}


            {/*有数据时显示搜索框*/ (data?.length > 0 || keyword) &&
                <SearchBar cancelText={'清空'}
                           placeholder='要搜索内容吗😶‍🌫️'
                           onSearch={e => setKeyword(e) || resetList()}
                        // onBlur={onSearch}  // 输入框失去焦点时触发（搜索也会触发 如果想就可以改成e.target.value
                           onCancel={() => keyword && (setKeyword(null) || resetList())}
                           onClear={() => keyword && (setKeyword(null) || resetList())}
                           showCancelButton
                           maxLength={100}
                />
            }

            <PullToRefresh
                pullingText={'用点力拉🤤'}
                canReleaseText={'忍住，别放开🥺'}
                completeText={'哎呦，你干嘛🥴'}
                onRefresh={async () => resetList()}
            >
                <List>
                    {data.map(item => (
                        <SwipeAction key={item.id} leftActions={leftActions(item)} rightActions={rightActions(item)} onAction={onAction}>
                            <List.Item key={item.id}
                                       style={{background: item.completed ? 'linear-gradient(270deg, #f2fff0, #fff)' : '#fff'}}
                                       onClick={() => setVisible(item)}
                                       clickable={false}>
                                <Badge content={type === 1 && item.numberOfRecurrences} color={'#6ad59d'}> {/*循环待办显示次数*/}
                                    <span style={{width: '100%'}}>{item.content}</span>
                                </Badge>
                            </List.Item>
                        </SwipeAction>
                    ))}
                </List>
                <InfiniteScroll loadMore={loadMore} hasMore={hasMore}/>
                <br/>
            </PullToRefresh>


            <Popup    /* 查看详细弹出层*/
                visible={!!visible}
                closeOnSwipe /* 组件内向下滑动关闭 */
                onMaskClick={() => {setVisible(undefined)}}
                onClose={() => {setVisible(undefined)}}
                bodyStyle={{ height: '60vh', width: '95vw', padding: '10px',overflow: 'scroll'}}
            >
                {/*显示创建时间*/}
                <Tag color='primary' fill='outline' style={{ '--border-radius': '6px', '--background-color': '#c5f1f7' }}>
                    创建时间:{visible?.createTime?.replace('T', ' ')}
                </Tag>

                {/*显示完成或修改时间*/ visible?.createTime !== visible?.updateTime &&
                    <Tag color='success' fill='outline' style={{ '--background-color': '#c8f7c5', margin: '3px 10px' }}>
                        {` ${visible?.completed ? '完成' : '修改'}于:` + visible?.updateTime?.replace('T', ' ')}
                    </Tag>
                }
                {/*显示循环的次数*/ visible?.numberOfRecurrences > 0 && visible?.itemType === 1 &&
                    <Tag color='warning'
                         fill='outline'
                         onClick={() => {
                             setLoopTime([])
                             setLoopTimeHasMore(visible.id)
                             setLoopTimePage(1)
                             loading.current = Toast.show({
                                 icon: 'loading',
                                 content: '加载中…',
                                 duration: 0,
                             })
                         }}
                         style={{ '--background-color': '#fcecd8', '--border-radius': '6px' }}>
                        {`循环次数: ${visible?.numberOfRecurrences}▼`}
                    </Tag>
                }
                <div style={{height:'38vh',overflowY: 'scroll'}}>
                    <pre style={{whiteSpace: 'pre-wrap', fontSize: '14px'}}>
                        {visible?.content}
                    </pre>
                </div>


                {/* 未完成的显示修改按钮 */ visible?.completed === 0 &&
                    <Button color='primary' className={styles.popupButton} onClick={() => onAction({key: 'edit', id: visible?.id})}>
                        修改
                    </Button>
                }
                {/*未完成的显示完成按钮 */ visible?.completed === 0 &&
                    <Button color='success' className={styles.popupButton} onClick={() => onAction({key: 'success', text: '完成', id: visible?.id})}>
                        完成
                    </Button>
                }

                {/*完成的显示取消完成按钮 */ visible?.completed === 1 &&
                    <Button className={styles.popupButton}
                            style={{background: '#f6b234', border:'none',color: '#fff'}}
                            onClick={() => onAction({key: 'success', text: '取消完成', id: visible?.id})}>
                        取消完成
                    </Button>
                }

                {/*显示删除按钮*/
                    <Button color='danger' className={styles.popupButton} onClick={() => onAction({key: 'delete', id: visible?.id})}>
                    删除
                    </Button>
                }

                {/*循环的显示 +1 按钮*/visible?.itemType === 1 &&
                    <Button className={styles.popupButton}
                            style={{background: '#a934f6', border:'none',color: '#fff'}}
                            onClick={() => onAction({key: 'addOne', id: visible?.id})}>
                        +1
                    </Button>
                }
            </Popup>


            <Popup      /* 编辑弹出层 */
                visible={!!editVisible}
                onMaskClick={() => {setEditVisible(false)}}
                onClose={() => {setEditVisible(false)}}
                position='top'
                bodyStyle={{ height: '450px' }}
            >

                <div style={{padding: '10px'}}>
                    <div className={'█required'}>
                        内容
                    </div>
                    <TextArea rows={13}
                              ref={textRef}
                              style={{height: '250px'}}
                              maxLength={2000} showCount
                              placeholder="请输入备忘内容"
                              value={content} onChange={value => setContent(value)}/>
                    <br/>
                    <div className={'█required'}>
                        请选择类型
                    </div>

                        <Radio.Group value={itemType} onChange={value => setItemType(()=>value)}>
                            <Radio value={0}  className={'█Radio'}>普通</Radio>
                            <Radio value={1}  className={'█Radio'}>循环</Radio>
                            <Radio value={2}  className={'█Radio'}>长期</Radio>
                            <Radio value={3}  className={'█Radio'}>紧急</Radio>
                            <Radio value={5}  className={'█Radio'}>日记</Radio>
                            <Radio value={6}  className={'█Radio'}>工作</Radio>
                            <Radio value={7}  className={'█Radio'}>其他</Radio>
                        </Radio.Group>
                    <br/>
                    <br/>
                    <br/>
                    <Button block onClick={submit}> 提交 </Button>
                </div>
            </Popup>


            <Popup      /* 循环时间的弹出层 */
                visible={!!loopTime}
                onMaskClick={() => setLoopTime(undefined)}
                bodyStyle={{ height: '55vh', overflow: 'scroll'}}
            >
                {loopTime?.length > 0 && <>
                    <List>
                        {loopTime?.map((item, index) =>
                            <List.Item key={item.id}>{index + 1}：{item.memoDate.replace('T', ' ')} </List.Item>)
                        }
                    </List>
                    <InfiniteScroll loadMore={showLoopTime} hasMore={loopTime?.length % 10 === 0 && !!loopTimeHasMore}/></>
                }
            </Popup>


            <Picker  /*待办条件 选择器(筛选)*/
                columns={columns}
                visible={pickerVisible}
                onClose={() => setPickerVisible(false)}
                value={[completed,orderBy]}
                onConfirm={v => {
                    setCompleted(v[0])  // 完成状态
                    setOrderBy(v[1])    // 排序
                }}
            />
        </>
    )

}