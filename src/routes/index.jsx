import Home from '../pages/Home'
import {Navigate} from 'react-router-dom'

export default [
    {
        path:'/home',
        element:<Home/>
    },
    {
        path:'/',
        element:<Navigate to="/home"/>
    }
]