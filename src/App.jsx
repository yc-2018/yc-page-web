import {useRoutes} from 'react-router-dom'

import './App.css';
import routes from "./routes";

export default function App() {
    //根据路由表生成对应的路由规则
    return useRoutes(routes)
}

