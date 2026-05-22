import {type RouteObject, useLocation, useRoutes} from 'react-router-dom'
import {lazy, Suspense, useEffect} from 'react';
import {App, message, Spin} from 'antd';

import './App.css';
import routes from './routes';
import CommonStore from './store/CommonStore';
import {observer} from 'mobx-react-lite';
import isMobile from '@/utils/winUtils';
import LoaderWhite from '@/components/common/LoaderWhite';

// 动态导入组件
const Head = lazy(() => import('./pages/Head'));
const LoginModal = lazy(() => import('@/components/LoginModal'));
const InfoModal = lazy(() => import('@/components/InfoModal'));
const MemoDrawer = lazy(() => import('./pages/MemoDrawer/index'));
const EnglishDrawer = lazy(() => import('./pages/EnglishDrawer'));

const AppShell = () => {
  const element = useRoutes(routes);   //根据路由表生成对应的路由规则
  const [messageApi, contextMsg] = message.useMessage();   // 使用message组件
  const location = useLocation();      // 当前路由信息

  // 将message组件挂载到store中
  CommonStore.setMsg(messageApi);

  // 设置页面标题
  useEffect(() => {
    document.title = findRouteTitle(routes, location.pathname) ?? element?.props.match.route.title
  }, [element, location.pathname]);

  return (
    <App message={{maxCount: 5}}>
      {contextMsg}
      <Suspense fallback={/* 懒加载等待时显示的组件 */<LoaderWhite/>}>
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
      <Spin rootClassName="rootSpin" spinning={CommonStore.loading} fullscreen delay={500}/>{/* 加载动画 延迟500毫秒 */}
    </App>
  )
}

const ObservedAppShell = observer(AppShell);

export default ObservedAppShell

type AppRoute = RouteObject & {
  title?: string
  children?: AppRoute[]
}

/** 查找当前路径匹配的路由标题 */
const findRouteTitle = (routeList: AppRoute[], pathname: string): string | undefined => {
  const paths = pathname.split('/').filter(Boolean) // 当前路径片段
  let fallbackTitle: string | undefined // 父级默认标题

  /** 在子路由中递归查找标题 */
  const findInChildren = (children: AppRoute[] = [], index = 0): string | undefined => {
    if (paths.length === index) {
      const indexRoute = children.find(route => route.index) // 默认子路由
      return indexRoute?.title
    }

    const currentPath = paths[index] // 当前一级路径
    for (const route of children) {
      if (route.path === currentPath) return route.title ?? findInChildren(route.children, index + 1)
      if (!route.path) {
        const nestedTitle = findInChildren(route.children, index)
        if (nestedTitle) return nestedTitle
      }
    }
  }

  for (const route of routeList) {
    if (route.path === '/' && route.children) {
      fallbackTitle = route.title
      const childTitle = findInChildren(route.children)
      if (childTitle) return childTitle
    }
    if (route.path === pathname) return route.title
  }
  return fallbackTitle
}

