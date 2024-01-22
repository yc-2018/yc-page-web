// import {Navigate} from 'react-router-dom'

import Home from '../pages/Home'
import Help from "../pages/Help";
import NoPage from "../compontets/404/NoPage";
import Blog from "../pages/Blog";
import Mobile from "../pages/Mobile";

// 判断是否是移动端
const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
// 判断是否是移动窗口
const isMobileViewport = isMobileDevice || (window?.matchMedia('(max-width: 767px)')?.matches);

const isMobile = isMobileDevice || isMobileViewport;

export default [
    {
        path:'/',
        element: isMobile ? <Mobile/> : <Home/>,
        title:'Open备忘第一页',
    },
    {
        path:'/help',
        element:<Help/>,
        title:'仰晨-帮助页',
    },
    {
        path:'/blog',
        element:<Blog/>,
        title:'仰晨-博客',
    },
    {
        path:'/*',
        element:<NoPage/>,
        title:'未知页面',

    },
    // {
    //     path:'/',
    //     element:<Navigate to="/home"/>
    // }
]
