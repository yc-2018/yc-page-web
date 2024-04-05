// import {Navigate} from 'react-router-dom'

import NoPage from "../compontets/404/NoPage";
import isMobile from "../utils/winUtils";
import {lazy} from "react";


export default isMobile() ?
    [
        {
            path: '/*',
            element: load('Mobile'),
            title: '仰晨备忘',
        },
    ]
    :
    [
        {
            path: '/',
            element: load('Home'),
            title: 'Open备忘第一页',
        },
        {
            path: '/help',
            element: load('Help'),
            title: '仰晨-帮助页',
        },
        {
            path: '/blog',
            element: load('Blog'),
            title: '仰晨-博客',
        },
        {
            path: '/utils-specialChar',
            element: load('UtilsPage/SpecialChar'),
            title: '仰晨工具-字母数字转特殊字符',
        },
        {
            path: '/*',
            element: <NoPage/>,
            title: '未知页面',

        },
        // {
        //     path:'/',
        //     element:<Navigate to="/home"/>
        // }
    ]

// 把字符串组件 => 组件标签
export function load(name) {
    const Page = lazy(() => import(`../pages/${name}`))
    return <Page/>
}