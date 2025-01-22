import React, {lazy, useState} from 'react'
import {observer} from "mobx-react-lite";

import JWTUtils from "../../utils/JWTUtils";
import {TabBar} from "antd-mobile";
import {tabs} from "./data.jsx";

import styles from "./mobile.module.css";
import './mobileCommom.css';

// 动态导入组件
const Me = lazy(() => import('./Me'));
const Blog = lazy(() => import('./Blog'));
const Login = lazy(() => import('./Login'));
const Memos = lazy(() => import('./Memos'));

export default observer(() => {
    const [barItem,setBarItem] = useState('Memos');
        return  !JWTUtils.isExpired() ? (
            <>
                {
                    barItem === 'Memos' ? <Memos/> : barItem === 'Blog' ? <Blog/> : <Me setBarItem={setBarItem}/>
                }
                <br/>
                <br/>
                <TabBar className={styles.tabBar} onChange={key => setBarItem(key)}>
                    {tabs.map(item => <TabBar.Item key={item.key} icon={item.icon} title={item.title}/>)}
                </TabBar>
            </>
        ) : <Login/>
    }
)