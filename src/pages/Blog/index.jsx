import React, {useState, useEffect} from 'react';
import {Layout, Menu} from 'antd'
import {useNavigate} from "react-router-dom"
import {BookOutlined} from '@ant-design/icons'

import styles from './blog.module.css'
import {blogMenu} from "../../store/NoLoginData"


// 模拟菜单
const items = blogMenu.map(item => ({
    key      : item[0],
    label    : item[0],
    icon     : <BookOutlined/>,
    children : item.length > 1 ? item.slice(1).map(child => ({key: child, label: child})) : []
}))
// antd布局组件
const {Content, Sider} = Layout


/**
 * 博客页
 * */
const Blog = () => {
    const [content, setContent] = useState(<h2>欢迎来到仰晨博客</h2>);
    const [menu, setMenu] = useState(items);
    const navigate = useNavigate()   // 路由跳转

    /** 页面加载菜单 (和读取URL的菜单) */
    useEffect(() => {
        // 请求获取最新菜单

    }, [])

    /** 菜单点击事件 */
    const handleMenuClick = (item) => {
        navigate(`?item=${encodeURIComponent(item.keyPath)}`);
        const [sub, parent] = item.keyPath;
        setContent(`正在请求${parent}/${sub}，请稍后...`)
    }


    return (
        <Layout style={{maxHeight: 'calc(100vh - 64px)'}}>
            {/*------- 页面左侧 -------*/}
            <Sider width={200}
                   theme={'light'}
                   className={styles.scrollbar}
                   style={{overflow: 'auto'}}
                   collapsible
            >
                <Menu
                    mode="inline"
                    items={menu}
                    onClick={handleMenuClick}
                />
            </Sider>

            {/*------ 页面右侧 -------*/}
            <Layout style={{padding: '0 24px 24px'}}>
                <br/>
                <Content className={`${styles.scrollbar} ${styles.content}`}>
                    {content}
                </Content>
            </Layout>
        </Layout>
    )
}
export default Blog
