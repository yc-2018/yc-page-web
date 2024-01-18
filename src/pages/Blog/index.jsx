import React from 'react';
import {LaptopOutlined, NotificationOutlined, UserOutlined} from '@ant-design/icons';
import {Layout, Menu, theme} from 'antd';
import styles from './blog.module.css'

const {Content, Sider} = Layout;
['1', '2', '3', '4'].map((key) => ({
    key,
    label: `nav ${key}`,
}));
const items2 = [UserOutlined, LaptopOutlined, NotificationOutlined, NotificationOutlined].map((icon, index) => {
    const key = String(index + 1);
    return {
        key: `sub${key}`,
        icon: React.createElement(icon),
        label: `subNav ${key}`,
        children: new Array(4).fill(null).map((_, j) => {
            const subKey = index * 4 + j + 1;
            return {
                key: subKey,
                label: `option${subKey}`,
            };
        }),
    };
});
const Blog = () => {
    const {token: {colorBgContainer}} = theme.useToken();
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
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['sub1']}
                    style={{height: '100%', borderRight: 0}}
                    items={items2}
                    inlineCollapsed={true}
                />
            </Sider>

            {/*------ 页面右侧 -------*/}
            <Layout style={{padding: '0 24px 24px'}}>
                <br/>
                <Content className={[styles.scrollbar, styles.content].join(' ')}>
                    Content
                    <p className={styles.testContent}>Content</p>
                    <p>电脑用这个组件</p>
                    <p>手机再创建一个</p>
                    <p>Content</p>
                    <p>Content</p>
                    <p>Content</p>
                    <p>Content</p>
                    <p>Content</p>
                    <p>Content</p>
                    <p>Content</p>
                    <p>Content</p>
                    <p>Content</p>
                    <p>Content</p>
                    <p>Content</p>
                    <p>Content</p>
                    <p>Content</p>
                    <p>Content</p>
                    <p>Content</p>
                    <p>Content</p>
                    <p>Content</p>
                    <p>Content</p>
                    <p>Content</p>
                    <p>Content</p>
                    <p>Content</p>
                    <p>Content</p>
                    <p>Content</p>
                    <p>Content</p>
                    <p>Content</p>
                    <p>Content</p>
                    <p>Content</p>
                    <p>Content</p>
                    <p>Content</p>
                    <p>Content</p>
                    <p>Content</p>
                    <p>Content</p>
                    <p>Content</p>
                    <p>Content</p>
                    <p>Content</p>
                    <p>Content</p>
                    <p>Content</p>
                    <p>Content</p>
                    <p>Content</p>
                    <p>Content</p>
                    <p>Content</p>
                    <p>Content</p>
                    <p>Content</p>
                    <p>Content</p>
                    <p>Content</p>
                    <p>Content</p>
                    <p>Content</p>
                    <p>Content</p>
                </Content>
            </Layout>

        </Layout>
    );
};
export default Blog;