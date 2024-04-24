import React, {useState, useEffect} from 'react';
import {Layout, Menu, Popover} from 'antd'
import {useNavigate} from "react-router-dom"
import {BookOutlined} from '@ant-design/icons'

import styles from './blog.module.css'
import {blogMenu} from "../../store/NoLoginData"
import {getBlogList, getBlogMd} from "../../request/blogRequest";
import LoaderWhite from "../../compontets/common/LoaderWhite";
import Md from "../../compontets/Md";
import iconMapping from './iconMapping'


// 模拟菜单
const items = blogMenu => blogMenu.map(item => ({
    key      : item[0],
    label    : item[0],
    icon     : iconMapping[item[0]] ??<BookOutlined/>,
    children: item.length > 1 ? item.slice(1).map(child => (
        {
            key: child,
            label:
                <Popover placement="right" content={child.replace('.md', ' ')}>
                    <div style={{maxWidth: 230}}>{child.replace('.md', ' ')}</div>
                </Popover>
        }
    )) : []
}))
// antd布局组件
const {Content, Sider} = Layout


/**
 * 博客页
 * */
const Blog = () => {
    const [content, setContent] = useState('# 欢迎来到仰晨博客');
    const [loading, setLoading] = useState(false)   // 加载状态
    const [menu, setMenu] = useState(items(blogMenu))                  // 菜单项
    const [selectKey, setSelectKey] = useState([])     // 菜单选中项【子，父】


    const navigate = useNavigate()                     // 路由跳转


    /** 页面加载菜单 (和读取URL的菜单) */
    useEffect(() => {
        // 请求获取最新菜单
        getBlogList().then(data => setMenu(items(data)))
        const params = window.location.href.split('?')?.[1];
        if (params) {
            // 获取查询参数
            const searchParams = new URLSearchParams(params);
            const itemValue = searchParams.get('item');
            try {
                const currentKeys = JSON.parse(decodeURIComponent(itemValue ?? ''));
                currentKeys?.length === 2 && setSelectKey(currentKeys) || handleMenuClick({keyPath: currentKeys})
            } catch (e) {console.log('URL参数异常',e)}

        }


    }, [])

    /** 菜单点击事件 */
    const handleMenuClick = item => {
        setLoading(true)
        setSelectKey(item.keyPath)  // 设置选中项【子，父】
        navigate(`?item=${encodeURIComponent(JSON.stringify(item.keyPath))}`);
        getBlogMd(item.keyPath).then(data => {
            setContent(data)
        }).catch(() => {
            setContent(`请求失败，请检查网络连接`)
        }).finally(()=>setLoading(false))

    }


    return (
        <Layout style={{maxHeight: 'calc(100vh - 64px)'}}>
            {/*------- 页面左侧 -------*/}
            <Sider width={250}
                   theme={'light'}
                   className={styles.scrollbar}
                   style={{overflow: 'auto'}}
                   collapsible
            >
                <Menu
                    selectedKeys={[selectKey[0]]}   // 当前选中的菜单项 key 数组
                    openKeys={[selectKey[1]]}       // 当前展开的 SubMenu 菜单项 key 数组
                    mode="inline"
                    items={menu}
                    onClick={handleMenuClick}       // 点击菜单子项
                    onOpenChange={v => setSelectKey(l => v.length > 0 ? [l[0], v[1]] : [l[0], null])}  // 点击展开菜单
                />
            </Sider>

            {/*------ 页面右侧 -------*/}
            <Layout style={{padding: '10px'}}>
                <Content className={`${styles.scrollbar} ${styles.content}`}>
                    {loading ?
                        <LoaderWhite/>
                        :
                        <Md>{content}</Md>
                    }
                </Content>
            </Layout>
        </Layout>
    );
}
export default Blog
