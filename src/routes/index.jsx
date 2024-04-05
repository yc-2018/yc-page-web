// import {Navigate} from 'react-router-dom'

import Home from '../pages/Home'
import Help from "../pages/Help";
import NoPage from "../compontets/404/NoPage";
import Blog from "../pages/Blog";
import Mobile from "../pages/Mobile";
import SpecialChar from "../pages/UtilsPage/SpecialChar";
import isMobile from "../utils/winUtils";


export default isMobile() ?
    [
        {
            path: '/*',
            element: <Mobile/>,
            title: '仰晨备忘',
        },
    ]
    :
    [
        {
            path: '/',
            element: <Home/>,
            title: 'Open备忘第一页',
        },
        {
            path: '/help',
            element: <Help/>,
            title: '仰晨-帮助页',
        },
        {
            path: '/blog',
            element: <Blog/>,
            title: '仰晨-博客',
        },
        {
            path: '/utils-specialChar',
            element: <SpecialChar/>,
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
