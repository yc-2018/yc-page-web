import {useRoutes,useLocation} from 'react-router-dom'
import React, { useEffect } from 'react';
import {ConfigProvider, message} from "antd";

import './App.css';
import routes, {routesName} from "./routes";
import Head from "./compontets/Head";
import Msg from "./store/Msg";
import LoginModal from "./compontets/LoginModal";

export default function App() {
    const element = useRoutes(routes);   //根据路由表生成对应的路由规则
    const location = useLocation();         // 获取当前的路由
    const [messageApi, contextMsg] = message.useMessage();   // 使用message组件

    Msg.setMsg(messageApi); // 将message组件挂载到store中

    useEffect(() => {
        document.title = routesName[location.pathname]??'未找到页面';
    }, [location]);
    return (
        <ConfigProvider theme={{components: {Message: {zIndexPopup: 9999999}}}}>
            {contextMsg}
            {window.location.pathname === '/' ? null : <Head/>}
            {element}
            <LoginModal/>
        </ConfigProvider>
    )
}

