import React, {useState} from 'react'
import {observer} from "mobx-react-lite";

import Memos from "./Memos";
import Login from "./Login";
import JWTUtils from "../../utils/JWTUtils";
import {TabBar} from "antd-mobile";
import {tabs} from "./data";

import styles from "./mobile.module.css";
import './mobileCommom.css';
import Blog from "../Blog";
import Me from "./Me";


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