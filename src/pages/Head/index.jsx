import React from 'react';
import {Header} from "antd/es/layout/layout";
import {UserOutlined} from "@ant-design/icons";
import {Avatar, Col, Dropdown, Layout, Menu, Row} from "antd";
import {useLocation, useNavigate} from "react-router-dom";

import {items} from "../../store/NoLoginData";
import showOrNot from "../../store/ShowOrNot";
import JWTUtils from "../../utils/JWTUtils";
import UserStore from "../../store/UserStore";
import {observer} from "mobx-react-lite";
import CommonStore from "../../store/CommonStore";
import css from './head.module.css'


export default observer(() => {
    const navigate = useNavigate()   // 路由跳转
    const location = useLocation()          // 获取当前路径就靠它

    /** 头部页面跳转 */
    const toPage = e => {
        if (e.domEvent.target.localName === 'a') return   // 点击a标签跳转 不需要改变路径
        navigate(e.key)
    }

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
                    <Col span={1}>
                        <Avatar src="/favicon.ico"
                                onClick={() => navigate('/')}
                                style={{cursor: 'pointer'}}
                        />
                    </Col>

                    <Col span={22}>
                        <Menu mode="horizontal"
                              items={items}
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

