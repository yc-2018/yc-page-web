import {useRoutes} from 'react-router-dom'
import React, { useEffect } from 'react';
import {App, message, Spin} from "antd";

import './App.css';
import routes from "./routes";
import Head from "./compontets/Head";
import CommonStore from "./store/CommonStore";
import LoginModal from "./compontets/LoginModal";

export default () => {
    const element = useRoutes(routes);   //根据路由表生成对应的路由规则
    const [messageApi, contextMsg] = message.useMessage();   // 使用message组件

    // 将message组件挂载到store中
    CommonStore.setMsg(messageApi);

    // 设置页面标题
    useEffect(() => {
        document.title = element.props.match.route.title
    }, [element]);

    return (
            <App message={{maxCount: 5}}>
                {contextMsg}
                {window.location.pathname === '/' ? null : <Head/>}
                {element}
                <LoginModal/>
                <Spin spinning={CommonStore.loading} fullscreen />{/* 加载动画 */}
            </App>
    )
}

