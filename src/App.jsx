import {useRoutes} from 'react-router-dom'

import './App.css';
import routes from "./routes";
import Head from "./compontets/Head";

export default function App() {
    //根据路由表生成对应的路由规则
    const element = useRoutes(routes)
    return (
        <>
            {window.location.pathname === '/' ? null : <Head/>}
            {element}
        </>
    )
}

