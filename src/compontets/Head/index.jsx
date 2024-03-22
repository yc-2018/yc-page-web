import React from 'react';
import {Header} from "antd/es/layout/layout";
import {UserOutlined} from "@ant-design/icons";
import {Avatar, Col, Layout, Menu, Row} from "antd";
import {useLocation, useNavigate} from "react-router-dom";

import {items} from "../../store/NoLoginData";


export default () => {
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
                    <Col span={1}><Avatar src="/favicon.ico" onClick={() => navigate('/')} style={{cursor: 'pointer'}}/></Col>
                    <Col span={22}>
                        <Menu mode="horizontal"
                              items={items}
                              style={{background: '#ffffff00'}}
                              selectedKeys={[location.pathname.split('/')[1]]}
                              onClick={toPage}
                        />
                    </Col>
                    <Col span={1}><Avatar icon={<UserOutlined />} size={40}/></Col>
                </Row>
            </Header>
        </Layout>
    );
};
