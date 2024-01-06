import {useRoutes,useLocation} from 'react-router-dom'
import React, { useEffect } from 'react';
import './App.css';
import routes, {routesName} from "./routes";
import Head from "./compontets/Head";

export default function App() {
    //根据路由表生成对应的路由规则
    const element = useRoutes(routes)
    const location = useLocation(); // 获取当前的路由
    useEffect(() => {
        document.title = routesName[location.pathname]??'未找到页面';
    }, [location]);
    return (
        <>
            {window.location.pathname === '/' ? null : <Head/>}
            {element}
        </>
    )
}

