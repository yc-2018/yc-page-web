import {Segmented, Flex, Button, Modal, Form, Input, message, Alert, Divider, Dropdown} from 'antd'
import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite'
import { ThunderboltOutlined, PlusOutlined } from '@ant-design/icons';

import MySearch from '../../../compontets/MySearch';
import {addSearchEngine, getSearchEngineList} from "../../../request/homeRequest";
import searchStore from '../../../store/SearchEnginesStore';
import {searchData} from '../../../store/NoLoginData';
import UserStore from "../../../store/UserStore";
import "./Search.css"

const SEARCH_OPTION= 'searchOption'
const QUICK_SEARCH = 'quickSearch'
function Search() {
    const setSearchValue = value => setSearchVal(value)            // 输入框的值改变的回调(直接传setSearchVal给子组件会报错：Rendered more hooks than during the previous render.)
    const [searchValue, setSearchVal] = useState();     // 搜索框的值
    const [openModal, setOpenModal] = useState(false);         // 添加搜索引擎的对话框是否显示
    const [modalLoading, setModalLoading] = useState(false);  // 添加时的网络延迟动画
    const [modalType, setModalType] = useState(0);           // 添加时的搜索引擎类型类型
    const [searchOptions, setSearchOptions] = useState(searchData.filter(item => item.isQuickSearch === 0));    // 搜索引擎列表
    const [quickSearch, setQuickSearch] = useState(searchData.filter(item => item.isQuickSearch === 1));        // 快速搜索列表
    const [rightClickMenu, setRightClickMenu] = useState('');   // 右键菜单选中搞哪种搜索引擎
    const [rightClickName, setRightClickName] = useState('');   // 右键菜单选中的搜索引擎名字
 // const [searchEngines, setSearchEngines] = useState("Bing");  //放mobx去了

    const [form] = Form.useForm();      // 创建一个表单域
    const items = [{label: '编辑', key: '1'}, {label: '删除', key: '2'}];

    useEffect(() => {

        // 登录更新搜索引擎列表
        if (UserStore.jwt) (async()=>{
            // 获取云端引擎
            const searchEngineList = await getSearchEngineList()
            if (searchEngineList) {
                setSearchOptions(searchEngineList.filter(item => item.isQuickSearch === 0))
                setQuickSearch(searchEngineList.filter(item => item.isQuickSearch === 1))

                // 如果仓库的搜索引擎不在当前列表，就设置为当前列表的第一个搜索引擎
                if(searchEngineList.filter(item => item.name === searchStore.searchEngines).length===0)
                    searchStore.setSearchEngines(searchOptions[0].name)
            }
        })()

    }, [UserStore.jwt])
    

    // 点击搜索按钮 或回车触发的事件
    const onSearch = () => {
        // 通过搜索引擎名字找到他对应的URL=》这就要求名字在一个用户中是唯一的
        const engineUrl = searchOptions.find(option => option.name === searchStore.searchEngines).engineUrl;
        window.open(engineUrl.replace('@@@', searchValue), '_blank');
    }


    // 添加搜索引擎
    const addSearch = type => {
        setOpenModal(true)
        setModalType(type)
    }

    // 菜单右键后点击事件
    const onClick = ({ key }) => {
        //todo 长度超过10或者有换行的就提示菜单
        if (key.length > 10 || key.includes('\n')) {
            message.info('菜单长度超过10个字符或者有换行符，请重新选择');
            return;
        }
        Modal.confirm({
            title: 'This is a warning message',
            content: 'some messages...some messages...',
            onOk() {
                message.info(`000000000Click on item ${key}`);
            },
            onCancel() {
                message.info('1111111111Click on cancel');
            },
        })

    };

    // 右键时的动作
    const onContextMenu = (e) => {
        e.preventDefault();  // 阻止浏览器的右键菜单
        if (e.target.tagName === 'path')
            e.target = e.target.parentElement;
        if (e.target.tagName === 'svg')
            e.target = e.target.parentElement;
        if (e.target.innerText ==='')
            e.target = e.target.parentElement.parentElement;
        if (e.target.tagName ==='DIV') {
            setRightClickMenu(SEARCH_OPTION)
        }
        setRightClickMenu(QUICK_SEARCH)         // 右键菜单选中BUTTON或SPAN->快速搜索
        setRightClickName(e.target.innerText)
    }

    return (
        <>
            {/* 选择搜索引擎 */}
            <Dropdown menu={{items,onClick}} trigger={['contextMenu']} >
                <Segmented
                    options={searchOptions.map(option => option.name)}
                    value={searchStore.searchEngines}
                    onChange={(value) => searchStore.setSearchEngines(value)}
                    onContextMenu={onContextMenu}
                />
            </Dropdown>
            {
                /* 登录显示添加搜索引擎 */
                UserStore.jwt&&
                <Button icon={<PlusOutlined />} style={{ margin: '0 3px' }} className={"addButton"} onClick={()=> addSearch(0)}/>
            }
            <br />
            {/* 搜索框 */}
            <MySearch onSearch={onSearch} setSearchValue={setSearchValue} />


            <br />
            {/*快速搜索*/}
            <Flex style={{ margin: "5px 80px" }} wrap="wrap" gap="small" justify='center'>
                {quickSearch.map(item =>
                    <Dropdown menu={{items,onClick}} trigger={['contextMenu']} onContextMenu={onContextMenu}>
                        <Button
                            className={"searchButton"}
                            key={item.id}
                            onClick={() => window.open(item.engineUrl.replace('@@@', searchValue), '_blank')}
                            icon={<ThunderboltOutlined />}
                        >
                            {item.name}
                        </Button>
                    </Dropdown>
                )}
                {
                    /*登录后显示添加快速搜索按钮*/
                    UserStore.jwt&&
                    <Button icon={<PlusOutlined />} className={"addButton"} onClick={()=>addSearch(1)}/>
                }
            </Flex>



            <Modal
                title={`添加${modalType?"快速":''}搜索引擎`}
                open={openModal}
                onOk={() => {
                    form.validateFields()
                        .then(async values => {
                            if(modalType === 0 && searchOptions.filter(item => item.name === values.name).length!==0)
                               return message.error("普通搜索引擎名称不允许有相同的")
                            if(modalType === 1 && quickSearch.filter(item => item.name === values.name).length!==0)
                                return message.error("快速搜索引擎名称不允许有相同的")
                            setModalLoading(true)
                            const aSearch = {...values,isQuickSearch:modalType};
                            const response = await addSearchEngine(aSearch)
                            setModalLoading(false)
                            if (response) {
                                setOpenModal(false)
                                form.resetFields();
                                // 不从云获取了直接在本地添加算了
                                if (modalType === 0) setSearchOptions([...searchOptions, aSearch])
                                else setQuickSearch([...quickSearch, aSearch])
                            }
                        })
                        .catch(() => setModalLoading(false));
                }}
                confirmLoading={modalLoading}
                onCancel={()=>setOpenModal(false)}
            >
                <Alert
                    description={<>提示 添加搜索引擎时用@@@替代你要搜索的内容哦，比如百度的： <Divider style={{color:'blue'}}>https://www.baidu.com/s?wd=@@@</Divider></>}
                    type="success"
                />
                <br/>
                <Form
                    form={form}
                    labelCol={{span: 6}}
                    wrapperCol={{span: 16}}
                    style={{maxWidth: 600}}
                >
                    <Form.Item
                        label="引擎名称"
                        name="name"
                        rules={[{required: true, message: '请输入引擎名字'},{max: 10, message: '引擎名称不能超过10个字符'}]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="引擎URL"
                        name="engineUrl"
                        rules={[
                            {required: true, message: '请输入引擎URL'},
                            {max: 100, message: '引擎URL不能超过100个字符'},
                            {pattern: /^(http|https):\/\/.*@@@.*$/, message: 'URL必须以 http:// 或 https:// 开头，并且包含 "@@@"'}
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}
export default observer(Search)