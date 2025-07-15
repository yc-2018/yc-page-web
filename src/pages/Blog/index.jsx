import React, {useState, useEffect} from 'react';
import {Layout, Menu, Popover} from 'antd'
import {useNavigate} from "react-router-dom"
import {BookOutlined} from '@ant-design/icons'

import styles from './blog.module.css'
import {blogMenu} from "../../store/NoLoginData.jsx"
import {blogBaseURL, getBlogItemIconObj, getBlogList, getBlogMd} from "../../request/blogRequest";
import LoaderWhite from "@/components/common/LoaderWhite";
import Md from "@/components/Md";


// 模拟菜单
const items = (blogMenu, blogIcon = {}) => blogMenu.map(item => ({
  key: item[0],
  label: item[0],
  icon: blogIcon[item[0]] ? <img src={`${blogBaseURL}/icon/${blogIcon[item[0]]}`} alt="图标"/> : <BookOutlined/>,
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

const initContent = `
# 欢迎来到仰晨博客
看看菜单有什么感兴趣或者需要的吧

其他：[CSDN](https://blog.csdn.net/weixin_46665865)  [GitHub](https://github.com/yc-2018)  [Gitee](https://gitee.com/yc556)
`

/**
 * 博客页
 * */
const Blog = () => {
  const [content, setContent] = useState(initContent);
  const [loading, setLoading] = useState(false)      // 加载状态
  const [initLoad, setInitLoad] = useState(true)    // 初始加载菜单状态
  const [menu, setMenu] = useState(items(blogMenu))                   // 菜单项
  const [selectKey, setSelectKey] = useState([])     // 菜单选中项【子，父】


  const navigate = useNavigate()                     // 路由跳转


  /** 页面加载菜单 (和读取URL的菜单) */
  useEffect(() => {
    init()
  }, [])

  /** 初始化页面加载菜单 (和读取URL的菜单) */
  const init = async () => {
    const blogIconObj = await getBlogItemIconObj(); // 请求获取图标
    const blogList = await getBlogList();           // 请求获取最新菜单
    setMenu(items(blogList, blogIconObj))           // 生成菜单并设置到state
    setInitLoad(false)

    // ——————————————————————🟡处理带URL进来的情况🟡————————————————————————
    const params = window.location.href.split('?')?.[1];
    if (params) {
      // 获取查询参数
      const searchParams = new URLSearchParams(params);
      const itemValue = searchParams.get('item');
      try {
        const currentKeys = JSON.parse(decodeURIComponent(itemValue ?? ''));
        if (currentKeys?.length === 2) {
          const blogCatalog = blogList.find(item => item[0] === currentKeys[1]);  // 每个列表的里面的列表的第一个是目录，url的列表第二个是目录
          if (!blogCatalog) return setContent('# 没有找到对应的博客哦!')
          if (!blogCatalog.some(item => item === currentKeys[0])) return setContent('# 没有找到对应的文章哦!')
          setSelectKey(currentKeys)
          handleMenuClick({keyPath: currentKeys})
        }
      } catch (e) {
        setContent('# 参数异常')
        console.log('URL参数异常', e)
      }
    }
  }


  /** 菜单点击事件 */
  const handleMenuClick = item => {
    setLoading(true)
    setSelectKey(item.keyPath)  // 设置选中项【子，父】
    navigate(`?item=${encodeURIComponent(JSON.stringify(item.keyPath))}`);
    getBlogMd(item.keyPath).then(data => {
      setContent(data)
    }).catch(() => {
      setContent(`请求失败，请检查网络连接`)
    }).finally(() => setLoading(false))
  }
  
  
  return (
    <Layout style={{maxHeight: 'calc(100vh - 64px)'}}>
      {/*------- 页面左侧 -------*/}
      <Sider width={250}
             theme={'light'}
             className={styles.scrollbar}
             style={{overflow: 'auto',maxHeight: 'calc(100vh - 112px)'}}
             collapsible
      >
        {initLoad ?
          <LoaderWhite loadName="获取菜单中..."/>
          :
          <Menu
            selectedKeys={[selectKey[0]]}   // 当前选中的菜单项 key 数组
            openKeys={[selectKey[1]]}       // 当前展开的 SubMenu 菜单项 key 数组
            mode="inline"
            items={menu}
            onClick={handleMenuClick}       // 点击菜单子项
            onOpenChange={v => setSelectKey(l => v.length > 0 ? [l[0], v[1]] : [l[0], null])}  // 点击展开菜单
          />}
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
