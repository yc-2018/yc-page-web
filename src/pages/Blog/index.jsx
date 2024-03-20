import React, {useState, useEffect} from 'react';
import {Layout, Menu} from 'antd'
import {useNavigate} from "react-router-dom"
import {BookOutlined} from '@ant-design/icons'

import styles from './blog.module.css'
import {blogMenu} from "../../store/NoLoginData"
import {getBlogList, getBlogMd} from "../../request/blogRequest";
import LoaderWhite from "../../compontets/common/LoaderWhite";


// 模拟菜单
const items = blogMenu => blogMenu.map(item => ({
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
    const [loading, setLoading] = useState(false)   // 加载状态
    const [menu, setMenu] = useState(items(blogMenu));
    const navigate = useNavigate()   // 路由跳转

    /** 页面加载菜单 (和读取URL的菜单) */
    useEffect(() => {
        // 请求获取最新菜单
        getBlogList().then(data => setMenu(items(data)))
    }, [])

    /** 菜单点击事件 */
    const handleMenuClick = (item) => {
        setLoading(true)
        navigate(`?item=${encodeURIComponent(item.keyPath)}`);
        getBlogMd(item.keyPath).then(data => {
            setContent(data)
        }).catch(() => {
            setContent(`请求失败，请检查网络连接`)
        }).finally(()=>setLoading(false))

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
                    <pre> {loading ? <LoaderWhite/> : content} </pre>
                </Content>
            </Layout>
        </Layout>
    )
}
export default Blog
