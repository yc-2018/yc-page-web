import React from 'react'
import {observer} from "mobx-react-lite";
import {Outlet, useLocation, useNavigate} from 'react-router-dom';

import {TabBar} from "antd-mobile";
import {tabs} from "./shared/data";

import styles from "./styles/mobile.module.css";
import './styles/mobileCommon.css';

/** 移动端底部导航布局 */
const MobileLayout = observer(() => {
  const navigate = useNavigate()      // 路由跳转
  const location = useLocation()      // 当前路由信息
  const activeKey = getActiveTabKey(location.pathname) // 当前底部导航高亮项

  return (
    <>
      <div className={styles.pageBody}>
        <Outlet/>
      </div>
      <TabBar
        activeKey={activeKey}
        className={styles.tabBar}
        onChange={key => navigate(tabs.find(item => item.key === key)?.path ?? '/')}
      >
        {tabs.map(item => <TabBar.Item key={item.key} icon={item.icon} title={item.title}/>)}
      </TabBar>
    </>
  )
})

/** 根据路径获取底部导航选中项 */
const getActiveTabKey = pathname => {
  if (pathname.startsWith('/blog')) return 'Blog'
  if (pathname.startsWith('/me')) return 'Me'
  return 'Memos'
}

export default MobileLayout
