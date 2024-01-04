// import {Navigate} from 'react-router-dom'

import Home from '../pages/Home'
import Help from "../pages/Help";

export default [
    {
        path:'/',
        element:<Home/>
    },
    {
        path:'/help',
        element:<Help/>
    },
    // {
    //     path:'/',
    //     element:<Navigate to="/home"/>
    // }
]