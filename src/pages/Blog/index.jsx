import React from 'react';
import {LaptopOutlined, NotificationOutlined, UserOutlined} from '@ant-design/icons';
import {Breadcrumb, Layout, Menu, theme} from 'antd';
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
        label: `subnav ${key}`,
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
    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();
    return (
        <Layout style={{maxHeight: 'calc(100vh - 64px)'}}>
            {/*------- 页面左侧 -------*/}
            <Sider width={200} style={{background: colorBgContainer,overflow: 'auto'}}>
                <Menu
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['sub1']}
                    style={{height: '100%', borderRight: 0}}
                    items={items2}
                />
            </Sider>

            {/*------ 页面右侧 -------*/}
            <Layout style={{padding: '0 24px 24px'}}>
                {/*------ 面包屑 -------*/}
                <Breadcrumb style={{margin: '16px 0',}}>
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item>List</Breadcrumb.Item>
                    <Breadcrumb.Item>App</Breadcrumb.Item>
                </Breadcrumb>

                {/*------ 页面内容 -------*/}
                <Content
                    style={{
                        padding: 24,
                        margin: 0,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                        overflow: 'auto'
                    }}
                >
                    Content
                    <p className={styles.testContent}>Content</p>
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
                    <p>Content</p>
                    <p>Content</p>
                </Content>
            </Layout>

        </Layout>
    );
};
export default Blog;