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
        path:'/blog',
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
    '/': 'Open备忘第一页',
    '/help': '仰晨-帮助页',
    '/blog': '仰晨-博客',

}