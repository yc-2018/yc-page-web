import React, {useEffect, useState} from 'react';
import {Header} from "antd/es/layout/layout";
import {UserOutlined} from "@ant-design/icons";
import {Avatar, Col, Dropdown, Layout, Menu, Row} from "antd";
import {useLocation, useNavigate} from "react-router-dom";

import {items} from "@/store/NoLoginData";
import showOrNot from "../../store/ShowOrNot";
import JWTUtils from "../../utils/JWTUtils";
import UserStore from "../../store/UserStore";
import {observer} from "mobx-react-lite";
import CommonStore from "../../store/CommonStore";
import {getToolsList, toolsBaseURL} from "@/request/toolsRequest";
import css from './head.module.css'


/** 构建头部工具菜单 */
const buildToolChildren = (tools) =>
    tools.map(([name, uri]) => ({
        key: `tool-${name}`,
        label: <a href={toolsBaseURL + uri} target="_blank" rel="noopener noreferrer">{name}</a>,
    }))


export default observer(() => {
    const navigate = useNavigate()   // 路由跳转
    const location = useLocation()          // 获取当前路径就靠它
    const [tools, setTools] = useState([])  // 工具列表

    /** 头部页面跳转 */
    const toPage = e => {
        const target = e.domEvent.target
        if (target.closest?.('a') || e.key === 'util' || e.keyPath?.includes('util')) return   // 点击工具链接不改变路径
        navigate(e.key)
    }

    /** 获取工具列表 */
    useEffect(() => {
        getToolsList().then(dataList => setTools(dataList)).catch(() => {
            CommonStore.msg.error('获取工具列表失败');
        })
    }, [])

    const toolChildren = buildToolChildren(tools) // 工具菜单子项
    const menuItems = items.map(item => {
        if (item.key !== 'util') return item
        return toolChildren.length ? {...item, children: toolChildren} : item
    }) // 头部菜单数据

    return (
        <Layout>
            <Header style={{
                display: 'flex',
                alignItems: 'center',
                background: 'linear-gradient(100deg, #f9e4e4 0%, #afcdcc 100%)',
                boxShadow: '0 9px 66px 1px #39487061',
            }}>
                <Row style={{width: '100%'}}>
                    {/*logo 回到首页*/}
                    <Col span={1} onContextMenu={e => e.preventDefault() || navigate('/seeTime')}>
                        <Avatar src="/favicon.ico"
                                onClick={() => navigate('/')}
                                style={{cursor: 'pointer'}}
                        />
                    </Col>

                    <Col span={22}>
                        <Menu mode="horizontal"
                              items={menuItems}
                              style={{background: '#ffffff00'}}
                              selectedKeys={[location.pathname.split('/')[1]]}
                              onClick={toPage}
                        />
                    </Col>

                    {/*头像*/}
                    <Col span={1}>
                        {
                            JWTUtils.isExpired()?
                                <Avatar size={40}
                                        onClick={() => UserStore.setOpenModal(true)}
                                        style={{cursor: 'pointer'}}
                                >
                                    未登录
                                </Avatar>
                                :
                                <div className={css.userImg}>
                                    <Dropdown
                                        placement="bottom"
                                        menu={{
                                            items:[{
                                                key: 'info',
                                                label:'我的信息',
                                                onClick: () => UserStore.setInfoModal(true),
                                            },
                                                {
                                                    key: 'openMemo',
                                                    label:'备忘录',
                                                    onClick: () => showOrNot.setMemoDrawerShow(true),
                                                    onContextMenu: event => {
                                                        event.preventDefault();                 // 阻止默认的右键菜单弹出
                                                        showOrNot.setEnglishDrawerShow(true);  // 打开英语抽屉
                                                    }
                                                },
                                                {
                                                    key: 'logout',
                                                    danger: true,
                                                    label: '退出登录',
                                                    onClick: () => UserStore.clearJwt() || CommonStore.msg.info('退出成功')
                                                },
                                            ],
                                        }}
                                    >
                                        <Avatar size={40}
                                                style={{backgroundColor: 'rgba(255,255,255,0.45)'}}
                                                src={JWTUtils.getAvatar()}
                                                icon={<UserOutlined style={{color: 'blue'}}/>}
                                        />
                                    </Dropdown>
                                    <span className={css.helloUserName}>你好! {JWTUtils.getName()}</span>
                                </div>

                        }
                    </Col>
                </Row>
            </Header>
        </Layout>
    );
})

