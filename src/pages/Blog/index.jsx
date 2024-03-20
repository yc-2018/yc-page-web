import React from 'react';
import {BookOutlined} from '@ant-design/icons';
import {Layout, Menu, theme} from 'antd';
import styles from './blog.module.css'
import {blogMenu} from "../../store/NoLoginData";
import {useNavigate} from "react-router-dom";

const {Content, Sider} = Layout;

const items = blogMenu.map(item => ({
    key: item[0],
    label: item[0],
    icon: <BookOutlined />,
    children: item.length > 1 ?
        item.slice(1).map(child => ({
        key: child,
        label: child,
    })):[]
}))





const Blog = () => {
    const {token: {colorBgContainer}} = theme.useToken();
    const navigate = useNavigate()   // 路由跳转

    const handleMenuClick = (item, key, keyPath, domEvent) => {
        navigate(`?key=${encodeURIComponent(item.keyPath)}`);
        console.log('███████item,key,keyPath,domEvent>>>>', item,key,keyPath,domEvent,'<<<<██████')
    };


    return (
        <Layout style={{maxHeight: 'calc(100vh - 64px)'}}>
            {/*------- 页面左侧 -------*/}
            <Sider width={200}
                   theme={'light'}
                   className={styles.scrollbar}
                   style={{background: colorBgContainer,overflow: 'auto'}}
                   collapsible
            >
                <Menu
                    mode="inline"
                    style={{height: '100%', borderRight: 0}}
                    items={items}
                    onClick={handleMenuClick}
                />
            </Sider>

            {/*------ 页面右侧 -------*/}
            <Layout style={{padding: '0 24px 24px'}}>
                <br/>
                <Content className={[styles.scrollbar, styles.content].join(' ')}>
                    Content
                    <p>怎么动态变化呢</p>
                </Content>
            </Layout>

        </Layout>
    );
};
export default Blog;