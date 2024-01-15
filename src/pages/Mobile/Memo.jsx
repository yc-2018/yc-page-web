import React, {useState} from 'react'
import {
    InfiniteScroll,
    List,
    Popup,
    SwipeAction,
    Toast,
    Button,
    Tag,
    Radio,
    TextArea,
    Dialog
} from 'antd-mobile'
import {delToDoItem, getToDoItems, saveOrUpdateToDoItem} from "../../request/homeRequest";
import {leftActions, rightActions} from "./data";
import './mobileCommom.css'
import styles from './mobile.module.css'


export default ({type}) => {
    const [data, setData] = useState([])
    const [hasMore, setHasMore] = useState(true)
    const [page, setPage] = useState(1);    // 待办翻页
    const [completed, setCompleted] = useState(-1);      // 查看待办状态（看未完成的：0,看已完成的：1,看全部的：-1）
    const [visible, setVisible] = useState(undefined);
    const [editVisible, setEditVisible] = useState(undefined);

    const [content, setContent] = useState('')    //表单内容
    const [itemType, setItemType] = useState(0) // 表单类型


    async function loadMore() {
        const append = await getToDoItems({type, page, completed});
        setData(val => [...val, ...append.data.records])
        setHasMore(data.length < append.data.total)
        setPage(val => val + 1)
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
                    setData(val => val.map(item => item.id === id ? {...item, completed: text === '完成' ? 1 : 0, updateTime: new Date().toLocaleString()} : item))
                    setVisible(undefined)
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
                        }else Toast.show({icon: 'fail', content: '删除失败'})

                    },
                })
        }
    }


    return(
        <>
            <Button onClick={() => {setEditVisible('新增');setContent('');setItemType(type)}}>添加</Button>
            <List>
                {data.map(item => (
                    <SwipeAction key={item.id} leftActions={leftActions(item)} rightActions={rightActions(item)} onAction={onAction}>
                        <List.Item key={item.id}
                                   style={{background: item.completed ? 'linear-gradient(270deg, #f2fff0, #fff)' : '#fff'}}
                                   onClick={() => {setVisible(item)}}
                                   clickable={false}
                        >

                            <span style={{width: '100%'}}>{item.content}</span>
                        </List.Item>
                    </SwipeAction>
                ))}
            </List>
            <InfiniteScroll loadMore={loadMore} hasMore={hasMore}/>

            {/* 查看详细弹出层*/}
            <Popup
                visible={!!visible}
                onMaskClick={() => {setVisible(undefined)}}
                onClose={() => {setVisible(undefined)}}
                bodyStyle={{ height: '60vh', width: '95vw', padding: '10px'}}
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
                    <Tag color='warning' fill='outline' style={{ '--background-color': '#fcecd8', '--border-radius': '6px' }}>
                        {`循环次数: ${visible?.numberOfRecurrences}`}
                    </Tag>
                }

                <pre style={{whiteSpace: 'pre-wrap', fontSize: '14px',height:'38vh',overflowY: 'scroll'}}>
                    {visible?.content}
                </pre>


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


            {/* 编辑弹出层 */}
            <Popup
                visible={!!editVisible}
                onMaskClick={() => {setEditVisible(false)}}
                onClose={() => {setEditVisible(false)}}
                position='top'
                bodyStyle={{ height: '400px' }}
            >

                <div style={{padding: '10px'}}>
                    <div><span style={{color: '#f00' }}>*</span>
                        内容
                    </div>
                    <TextArea rows={6}
                              maxLength={2000} showCount
                              placeholder="请输入备忘内容"
                              value={content} onChange={value => setContent(value)}/>
                    <br/>
                    <div><span style={{color: '#f00' }}>*</span>
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
                    <Button block
                            onClick={async () => {
                                if (content?.length === 0) return Toast.show({icon: 'fail', content: '内容不能为空'})
                                // if (!itemType) return Toast.show({icon: 'fail', content: '类型不能为空'})

                                // 构造请求体
                                let body = {};
                                body.content = content === editVisible?.content ? null : content;       // 内容不一致时才更新
                                body.itemType = itemType === editVisible?.itemType ? null : itemType;   // 内容不一致时才更新
                                body.id = editVisible?.id;
                                showLoading('loading', '处理中…')
                                let result = await saveOrUpdateToDoItem(body, editVisible === '新增' ? 'post' : "put");
                                console.log('提交表单', body)
                                if(result) {
                                    showLoading('success', '成功')
                                    setEditVisible(false);
                                     // 刷新列表
                                    editVisible === '新增' && setData(data => [{...body,id: result,createTime:new Date().toLocaleString(), updateTime:new Date().toLocaleString(),numberOfRecurrences:0},...data])
                                    editVisible !== '新增' && setData(data => data.map(item => item.id === editVisible?.id ? {...item,itemType:body.itemType||item.itemType,content:body.content||item.content, updateTime:new Date().toLocaleString()} : item))
                                }else showLoading('fail', '失败')
                            }}>
                        提交
                    </Button>
                </div>
            </Popup>
        </>
    )

}