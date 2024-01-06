import React from 'react';
import {Avatar, Col, Layout, Menu, Row} from "antd";
import {Header} from "antd/es/layout/layout";
import {items} from "../../store/NoLoginData";
import {useNavigate} from "react-router-dom";
import {UserOutlined} from "@ant-design/icons";

const Head = () => {
    const navigate = useNavigate()   // 路由跳转
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
                    <Col span={22}><Menu mode="horizontal" items={items} style={{background: '#ffffff00'}}/></Col>
                    <Col span={1}><Avatar icon={<UserOutlined />} size={40}/></Col>
                </Row>
            </Header>
        </Layout>
    );
};
export default Head;