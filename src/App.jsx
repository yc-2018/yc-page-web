import {useRoutes} from 'react-router-dom'
import React, { useEffect } from 'react';
import {App, message, Spin} from "antd";

import './App.css';
import routes from "./routes";
import Head from "./pages/Head";
import CommonStore from "./store/CommonStore";
import LoginModal from "./compontets/LoginModal";
import {observer} from "mobx-react-lite";
import MemoDrawer from "./pages/MemoDrawer";
import EnglishDrawer from "./pages/EnglishDrawer";
import InfoModal from "./compontets/InfoModal";
import isMobile from "./utils/winUtils";

export default observer(() => {
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
                {isMobile() ? null : window.location.pathname !== '/' && <Head/>}
                {element}
                {
                    isMobile() ? null : <>
                        {/*登录弹窗*/        <LoginModal/>}
                        {/*用户信息修改弹窗*/  <InfoModal/>}
                        {/*备忘录抽屉*/       <MemoDrawer/>}
                        {/*备忘英语抽屉*/      <EnglishDrawer/>}
                    </>
                }
                <Spin spinning={CommonStore.loading} fullscreen />{/* 加载动画 */}
            </App>
    )
})

