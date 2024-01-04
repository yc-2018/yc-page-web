// import {Navigate} from 'react-router-dom'

import Home from '../pages/Home'
import Help from "../pages/Help";
import NoPage from "../compontets/404/NoPage";

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
        path:'/*',
        element:<NoPage/>
    },
    // {
    //     path:'/',
    //     element:<Navigate to="/home"/>
    // }
]