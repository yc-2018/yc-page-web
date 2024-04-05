import {useRoutes} from 'react-router-dom'
import React, {lazy, Suspense, useEffect} from 'react';
import {App, message, Spin} from "antd";

import './App.css';
import routes from "./routes";
import CommonStore from "./store/CommonStore";
import {observer} from "mobx-react-lite";
import isMobile from "./utils/winUtils";
import LoaderWhite from "./compontets/common/LoaderWhite";

// 动态导入组件
const Head = lazy(() => import('./pages/Head'));
const LoginModal = lazy(() => import('./compontets/LoginModal'));
const InfoModal = lazy(() => import('./compontets/InfoModal'));
const MemoDrawer = lazy(() => import('./pages/MemoDrawer'));
const EnglishDrawer = lazy(() => import('./pages/EnglishDrawer'));

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
      <Suspense fallback={<LoaderWhite/>}>
        {isMobile() ? null : window.location.pathname !== '/' && <Head/>}
        {element}
        {
          isMobile() ? null : <>
            {/*登录弹窗*/        <LoginModal/>}
            {/*用户信息修改弹窗*/  <InfoModal/>}
            {/*备忘录抽屉*/       <MemoDrawer />}
            {/*备忘英语抽屉*/      <EnglishDrawer/>}
          </>
        }
      </Suspense>
      <Spin spinning={CommonStore.loading} fullscreen/>{/* 加载动画 */}
    </App>
  )
})

