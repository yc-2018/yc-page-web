import React, {useState} from 'react';
import {LaptopOutlined, NotificationOutlined, UserOutlined} from '@ant-design/icons';
import {Layout, Menu, theme} from 'antd';
import styles from './blog.module.css'
import MyDnd from "../../compontets/MyDnd";

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
    const [items, setItems] = useState([
        {id: "11hhh", name: 'Item 12111'},
        {id: "22hhh", name: 'Item 232'},
        {id: "33hhh", name: 'Item 334'},
        {id: "43hhh", name: 'Item 44'},
        {id: "5hhh", name: 'Item 556'},
        {id: "6hhh", name: 'Item 667'},
        {id: "37h", name: 'Item 77'},
        {id: "338h", name: 'Item 889'},
        {id: "33h9hh", name: 'Item 99'},
        {id: "331hhh", name: 'Item aa'},
        {id: "33h11hh", name: 'Item ss'},
        {id: "33h12hh", name: 'Item dd'},
        {id: "3314hhh", name: 'Item ff'},
        {id: "33hh13h", name: 'Item gg'},
        {id: "33h15hh", name: 'Item hh'},
        {id: "dd", name: 'Item dd'},
        {id: "cc", name: 'Item cc'},
        {id: "zz", name: 'Item zz'},
        {id: "vv", name: 'Item vv'},
        {id: "tt", name: 'tt hh'},
    ])
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

                    <MyDnd dndIds={items} setItems={setItems} storageName={'ikun'}>
                        {items.map(item =>
                            <MyDnd.Item key={item.id} id={item.id} drag={<>█</>}>
                                {item.name}
                            </MyDnd.Item>
                        )}
                        █████████zz
                    </MyDnd>
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