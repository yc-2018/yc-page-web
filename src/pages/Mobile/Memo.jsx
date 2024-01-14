import React, {useState} from 'react'
import {
    InfiniteScroll,
    List,
    Popup,
    SwipeAction,
    Toast,
    Button,
    Tag,
    Space,
    Radio,
    TextArea,
    Dialog
} from 'antd-mobile'
import {delToDoItem, getToDoItems, saveOrUpdateToDoItem} from "../../request/homeRequest";
import {leftActions, rightActions} from "./data";
import './mobileCommom.css'


export default () => {
    const [data, setData] = useState([])
    const [hasMore, setHasMore] = useState(true)
    const [page, setPage] = useState(1);    // 待办翻页
    const [type, setType] = useState(0);    // 待办类型
    const [unFinishCounts, setUnFinishCounts] = useState();      // 待办未完成计数
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
                finishResp?showLoading('success', '成功'):showLoading('fail', '失败')
                setData(val => val.map(item => item.id === id ? {...item, completed: text === '完成' ? 1 : 0} : item))
                break;

            // +1
            case 'addOne':
                break;

            // 编辑
            case 'edit':
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
                        }else Toast.show({icon: 'fail', content: '删除失败'})

                    },
                })
                break;
            default:
                break;
        }
    }


    return(
        <>
            <Button onClick={() => {setEditVisible('新增');setContent('');setItemType(type)}}>添加</Button>
            <List>
                {data.map(item => (
                    <SwipeAction key={item.id} leftActions={leftActions(item)} rightActions={rightActions(item.id)} onAction={onAction}>
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
                <Space>
                    <Tag color='primary' fill='outline' style={{ '--border-radius': '6px', '--background-color': '#c5f1f7' }}>
                        创建时间:{visible?.createTime?.replace('T', ' ')}
                    </Tag>

                    {visible?.createTime !== visible?.updateTime && visible?.itemType!== 1?
                        <Tag color='success' fill='outline' style={{ '--background-color': '#c8f7c5' }}>
                            {` ${visible?.completed ? '完成' : '修改'}于:` + visible?.updateTime?.replace('T', ' ')}
                        </Tag>:null
                    }
                </Space>
                <pre style={{whiteSpace: 'pre-wrap', fontSize: '14px',height:'48vh',overflowY: 'scroll'}}>
                    {visible?.content}
                </pre>

                <Button block color='primary' size='large'
                        onClick={() => {
                            setEditVisible(visible);setVisible(undefined)
                            setContent(visible?.content);
                            setItemType(visible?.itemType)
                        }}
                >
                    修改
                </Button>
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

                        <Radio.Group value={itemType} onChange={value => setItemType(value)}>
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
                                    editVisible === '新增' && setData(data => [{...body,id: result},...data])
                                    editVisible !== '新增' && setData(data => data.map(item => item.id === editVisible?.id ? {...item,itemType:body.itemType||item.itemType,content:body.content||item.content} : item))

                                }else showLoading('fail', '失败')

                            }}>
                        提交
                    </Button>
                </div>
            </Popup>
        </>
    )

}