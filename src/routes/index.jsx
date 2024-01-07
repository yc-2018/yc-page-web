// import {Navigate} from 'react-router-dom'

import Home from '../pages/Home'
import Help from "../pages/Help";
import NoPage from "../compontets/404/NoPage";
import Blog from "../pages/Blog";

export default [
    {
        path:'/',
        element:<Home/>
    },
    {
        path:'/help',
        element:<Help/>
    },
    {
        path:'/bolg',
        element:<Blog/>
    },
    {
        path:'/*',
        element:<NoPage/>
    },
    // {
    //     path:'/',
    //     element:<Navigate to="/home"/>
    // }
]

export const routesName = {
    '/': '仰晨首页',
    '/help': '仰晨-帮助页',
    '/bolg': '仰晨-博客',

}